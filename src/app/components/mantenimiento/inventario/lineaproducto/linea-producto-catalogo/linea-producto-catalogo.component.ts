import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { inLineaProducto } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { ServicioLineaProductoService } from '../service-linea/servicio-linea-producto.service';
import { element } from 'protractor';

@Component({
  selector: 'app-linea-producto-catalogo',
  templateUrl: './linea-producto-catalogo.component.html',
  styleUrls: ['./linea-producto-catalogo.component.scss']
})
export class LineaProductoCatalogoComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarLinea();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarLinea();
  };

  linea_get: any = [];
  public linea_view: any = [];

  public codigo: string = '';
  public nombre: string = '';

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<inLineaProducto>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: inLineaProducto[] = [];
  filteredOptions: Observable<inLineaProducto[]>;
  myControlCodigo = new FormControl<string | inLineaProducto>('');
  myControlDescripcion = new FormControl<string | inLineaProducto>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<LineaProductoCatalogoComponent>,
    private servicioLinea: ServicioLineaProductoService) {
  }

  ngOnInit() {
    let useConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.getLineaCatalogo(useConn);
  }

  private _filter(name: string): inLineaProducto[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toString().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: inLineaProducto): any {
    return user && user.codigo ? user.codigo : '';
  }

  getLineaCatalogo(userConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --catalogoVendedor";
    return this.api.getAll('/inventario/mant/inlinea/' + userConn)
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

  mandarLinea() {
    this.servicioLinea.disparadorDeLineaItem.emit({
      linea: this.linea_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
