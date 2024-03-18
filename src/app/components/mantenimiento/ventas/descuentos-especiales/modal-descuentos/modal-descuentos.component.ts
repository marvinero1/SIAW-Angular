import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veDescuento } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
@Component({
  selector: 'app-modal-descuentos',
  templateUrl: './modal-descuentos.component.html',
  styleUrls: ['./modal-descuentos.component.scss']
})
export class ModalDescuentosComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarDescuento();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarDescuento();
  };

  descuentos_get: any = [];
  public descuento_view: any = [];
  userConn: any;

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<veDescuento>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControlCodigo = new FormControl<string | veDescuento>('');
  myControlDescripcion = new FormControl<string | veDescuento>('');

  options: veDescuento[] = [];
  filteredOptions: Observable<veDescuento[]>;

  constructor(public dialogRef: MatDialogRef<ModalDescuentosComponent>, private api: ApiService,
    public servicioDescuento: DescuentoService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getDescuentos();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: veDescuento): any {
    return user && user.codigo ? user.codigo : '';
  }

  getDescuentos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --vedescuento/catalogo";

    return this.api.getAll('/venta/mant/vedescuento/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          console.log(this.descuentos_get);

          this.dataSource = new MatTableDataSource(this.descuentos_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDescuentobyId(element) {
    this.descuento_view = element;
    console.log(element);
  }

  mandarDescuento() {
    this.servicioDescuento.disparadorDeDescuentos.emit({
      descuento: this.descuento_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
