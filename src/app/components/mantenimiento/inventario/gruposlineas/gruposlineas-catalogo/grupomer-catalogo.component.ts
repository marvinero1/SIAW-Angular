import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { inGrupoMer } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { ServicioGrupoMerService } from '../service-gruposmerlineas/servicio-gruposmer.service';

@Component({
  selector: 'app-grupomer-catalogo',
  templateUrl: './grupomer-catalogo.component.html',
  styleUrls: ['./grupomer-catalogo.component.scss']
})
export class GrupoMerCatalogoComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarGrupoMer();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarGrupoMer();
  };

  linea_get: any = [];
  public linea_view: any = [];

  public codigo: string = '';
  public nombre: string = '';

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<inGrupoMer>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: inGrupoMer[] = [];
  filteredOptions: Observable<inGrupoMer[]>;
  myControlCodigo = new FormControl<string | inGrupoMer>('');
  myControlDescripcion = new FormControl<string | inGrupoMer>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<GrupoMerCatalogoComponent>,
    private servicioGrupoMer: ServicioGrupoMerService) {
  }

  ngOnInit() {
    let useConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.getGrupoMerCatalogo(useConn);
  }

  private _filter(name: string): inGrupoMer[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toString().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: inGrupoMer): any {
    return user && user.codigo ? user.codigo : '';
  }

  getGrupoMerCatalogo(userConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --catalogoVendedor";
    return this.api.getAll('/inventario/mant/ingrupomer/' + userConn)
      .subscribe({
        next: (datav) => {
          this.linea_get = datav;

          this.dataSource = new MatTableDataSource(this.linea_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getveVendedorbyId(element) {
    this.linea_view = element;
    console.log(element);
  }

  mandarGrupoMer() {
    this.servicioGrupoMer.disparadorDeGrupoMer.emit({
      linea: this.linea_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
