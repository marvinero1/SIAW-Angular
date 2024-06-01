import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { TipocambiovalidacionCreateComponent } from './tipocambiovalidacion-create/tipocambiovalidacion-create.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
@Component({
  selector: 'app-tipocambiovalidacion',
  templateUrl: './tipocambiovalidacion.component.html',
  styleUrls: ['./tipocambiovalidacion.component.scss']
})

export class TipocambiovalidacionComponent implements OnInit {

  public fecha_actual = new Date();
  public moneda = [];
  public data = [];
  public ultimo_registro = [];
  public backupData = [];
  public formulariotipocambio;
  public formnuevoarray;
  public bd_logueado;

  public userConn: any;
  public BD_storage: any = [];
  public monedaBase: any;

  displayedColumns = ['codigo', 'accion'];
  dataSource = new MatTableDataSource();

  public tipo_cambio: any = [];
  public tipo_cambio_ultimo: any = [];
  public ultimo_registro_create: any = [];

  public ventana = "tipocambio-create"
  public detalle = "tipocambio-detalle";
  public tipo = "transaccion-tipocambio-POST";

  tamanio: any;
  tamanio_moneda: any;

  constructor(private api: ApiService, public dialog: MatDialog, public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TipocambiovalidacionComponent>, private router: Router,
    private datePipe: DatePipe, public log_module: LogService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.bd_logueado = this.BD_storage;
    console.log(this.bd_logueado);
  }

  ngOnInit() {
    this.getAllmoneda();
    this.getAllTipoCambio();
    this.getMonedaBase();
  }

  agregarTipoCambio(dataMoneda) {
    this.data = dataMoneda;
    this.dialog.open(TipocambiovalidacionCreateComponent, {
      data: { dataMoneda: dataMoneda },
      width: 'auto',
    });
  }

  getAllmoneda() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
          this.tamanio = this.moneda.length;
          // console.log(this.tamanio);
          this.dataSource = new MatTableDataSource(this.moneda);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllTipoCambio() {
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET al tipo de cambio ruta /seg_adm/mant/getTipocambioFecha/";

    return this.api.getAll('/seg_adm/mant/adtipocambio/getTipocambioFecha/' + userConn + "/" + dataTransform)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio = datav;
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
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllTipoCambioUltimoRegistro() {
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage: string;
    let fecha_actual = new Date();
    let dataTransform = this.datePipe.transform(fecha_actual, "yyyy-MM-dd");

    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET al tipo de cambio ruta /seg_adm/mant/getTipocambioFecha/";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getTipocambioAnt/' + userConn)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio_ultimo = datav;

          // mapeo que cambia un valor de un array
          this.tipo_cambio_ultimo.map(function (dato) {
            if (dato.codalmacen) {
              dato.fecha = dataTransform;
            }
            return dato;
          })

          console.log(this.tipo_cambio_ultimo);

          // aca esta la solucion
          this.GuardartipoCambioUltimoRegistro(this.tipo_cambio_ultimo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  GuardartipoCambioUltimoRegistro(elementoArray) {
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer POST al guardar un array de datos de tipo de cambio ruta --/seg_adm/mant/addlisttipocambio/";

    return this.api.create('/seg_adm/mant/adtipocambio/addlisttipocambio/' + userConn, elementoArray)
      .subscribe({
        next: (datav) => {
          this.ultimo_registro_create = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this._snackBar.open('Se guardo correctamente los tipos de cambio, con los ultimos valores!', '💲', {
            duration: 3500,

          });

          location.reload();
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  logout() {
    this.api.logout();
  }
}
