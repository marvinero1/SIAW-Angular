import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veNumeracion } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { TipoidService } from '../serviciotipoid/tipoid.service';

@Component({
  selector: 'app-modal-idtipo',
  templateUrl: './modal-idtipo.component.html',
  styleUrls: ['./modal-idtipo.component.scss']
})

export class ModalIdtipoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    console.log("Hola Lola ENTER");

    this.mandarTipoId();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarTipoId();
  };

  id_tipo: any = [];
  public codigo: string = '';
  public tipo_view: any = [];
  public numero_id: string;
  userConn: any;
  user: any;

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<veNumeracion>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControlCodigo = new FormControl<string | veNumeracion>('');
  myControlDescripcion = new FormControl<string | veNumeracion>('');

  options: veNumeracion[] = [];
  filteredOptions: Observable<veNumeracion[]>;

  constructor(public dialogRef: MatDialogRef<ModalIdtipoComponent>, private api: ApiService, private spinner: NgxSpinnerService,
    public servicioTipoID: TipoidService,) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.user = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

  }

  ngOnInit() {
    this.getIdTipo();
  }

  private _filter(name: string): veNumeracion[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: veNumeracion): string {
    return user && user.id ? user.id : '';
  }

  getIdTipo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.user)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', datav);

          this.dataSource = new MatTableDataSource(this.id_tipo);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIdTipoView(element) {
    this.tipo_view = element;
  }

  mandarTipoId() {
    this.servicioTipoID.disparadorDeIDTipo.emit({
      id_tipo: this.tipo_view,
      // numero_id:
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
