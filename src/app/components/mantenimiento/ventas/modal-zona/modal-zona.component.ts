import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ServiciozonaService } from '../serviciozona/serviciozona.service';
import { MatTableDataSource } from '@angular/material/table';
import { Zona } from '@services/modelos/objetos';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-zona',
  templateUrl: './modal-zona.component.html',
  styleUrls: ['./modal-zona.component.scss']
})
export class ModalZonaComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarZona();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarZona();
  };

  vezona: any = [];
  zona_view: any = [];
  useConn: any;

  displayedColumns = ['codigo', 'descripcion'];
  dataSource = new MatTableDataSource<Zona>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: Zona[] = [];
  filteredOptions: Observable<Zona[]>;
  myControlCodigo = new FormControl<string | Zona>('');
  myControlDescripcion = new FormControl<string | Zona>('');

  constructor(public dialogRef: MatDialogRef<ModalZonaComponent>, private api: ApiService,
    public servicioZona: ServiciozonaService) {

    this.useConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getZona();
  }

  private _filter(name: string): Zona[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: Zona): string {
    return user && user.codigo ? user.codigo : '';
  }

  getZona() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vezona/catalogo/' + this.useConn)
      .subscribe({
        next: (datav) => {
          this.vezona = datav;
          console.log('data', datav);

          this.dataSource = new MatTableDataSource(this.vezona);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarZona() {
    this.servicioZona.disparadorDeZonas.emit({
      zona: this.zona_view,
    });

    this.close();
  }

  getDescripcionView(element) {
    this.zona_view = element;
    console.log(this.zona_view);
  }

  close() {
    this.dialogRef.close();
  }

}
