import { Component, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { moneda } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { MonedaServicioService } from '../../servicio-moneda/moneda-servicio.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-moneda-catalogo',
  templateUrl: './moneda-catalogo.component.html',
  styleUrls: ['./moneda-catalogo.component.scss']
})
export class MonedaCatalogoComponent implements OnInit, AfterViewInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarVendedor();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarVendedor();
  };

  public moneda_view: string;
  public codigo: string = '';
  public nombre: string = '';

  moneda: any = [];
  tipo_cambio_moneda: any = [];
  monedaBase: any = [];
  fecha_actual = new Date();
  userConn: string;
  displayedColumns = ['codigo', 'descripcion'];


  dataSource = new MatTableDataSource<moneda>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: moneda[] = [];
  BD_storage: any = [];

  bd_logueado: any;
  filteredOptions: Observable<moneda[]>;
  myControlCodigo = new FormControl<string | moneda>('');
  myControlDescripcion = new FormControl<string | moneda>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<MonedaCatalogoComponent>,
    private serviciMoneda: MonedaServicioService, private datePipe: DatePipe) {

    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.bd_logueado = this.BD_storage.bd;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getMonedaBase();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getAllmoneda();
  }

  private _filter(name: string): moneda[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toString().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: moneda): any {
    return user && user.codigo ? user.codigo : '';
  }

  getAllmoneda() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
          this.dataSource = new MatTableDataSource(this.moneda);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getMonedaBase() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adempresa/getcodMon/' + this.userConn + "/" + this.bd_logueado)
      .subscribe({
        next: (datav) => {
          this.monedaBase = datav;
          console.log(this.monedaBase);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getMonedaTipoCambio(moneda) {
    let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getmonedaValor/' + this.userConn + "/" + this.monedaBase.moneda + "/" + moneda + "/" + fechareg)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio_moneda = datav;
          console.log(this.tipo_cambio_moneda);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getMonedabyId(moneda) {
    this.moneda_view = moneda.codigo;
    console.log(this.moneda_view);
    this.getMonedaTipoCambio(this.moneda_view);
  }

  mandarVendedor() {
    this.serviciMoneda.disparadorDeMonedas.emit({
      moneda: this.moneda_view,
      tipo_cambio: this.tipo_cambio_moneda.valor,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
