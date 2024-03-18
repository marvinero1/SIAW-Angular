import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { IDProforma } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { ServicioCatalogoProformasService } from '../../proforma/sevicio-catalogo-proformas/servicio-catalogo-proformas.service';

@Component({
  selector: 'app-catalogo-cotizacion',
  templateUrl: './catalogo-cotizacion.component.html',
  styleUrls: ['./catalogo-cotizacion.component.scss']
})
export class CatalogoCotizacionComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    this.mandarProforma();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarProforma();
  };

  cotizacion_get: any = [];
  cotizacion_view: any = [];
  userConn: string;
  usuario: string;

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<IDProforma>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControlCodigo = new FormControl<string | IDProforma>('');
  myControlDescripcion = new FormControl<string | IDProforma>('');

  options: IDProforma[] = [];
  filteredOptions: Observable<IDProforma[]>;

  constructor(public dialogRef: MatDialogRef<CatalogoCotizacionComponent>, private api: ApiService, private spinner: NgxSpinnerService,
    public servicioCatalogoProformas: ServicioCatalogoProformasService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getProforma();
  }

  private _filter(name: string): IDProforma[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toString().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: IDProforma): any {
    return user && user.id ? user.id : '';
  }

  getProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";

    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "6")
      .subscribe({
        next: (datav) => {
          this.cotizacion_get = datav;
          console.log(this.cotizacion_get);

          this.dataSource = new MatTableDataSource(this.cotizacion_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getCotiziacionbyId(precio_venta) {
    this.cotizacion_view = precio_venta;
    console.log(precio_venta);
  }

  mandarProforma() {
    this.servicioCatalogoProformas.disparadorDeIDCotizacion.emit({
      cotizacion: this.cotizacion_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }


}
