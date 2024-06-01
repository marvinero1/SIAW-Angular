import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDetalleObserValidacionComponent } from '../modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
@Component({
  selector: 'app-verificar-credito-disponible',
  templateUrl: './verificar-credito-disponible.component.html',
  styleUrls: ['./verificar-credito-disponible.component.scss']
})
export class VerificarCreditoDisponibleComponent implements OnInit {

  fecha_actual = new Date();
  dataform: any = '';
  area: any = [];
  credito_disponible: any = [];
  usuario_logueado: any;
  user_conn: any;
  BD_storage: any;
  agencia_logueado: any;
  validacion: boolean = false;
  id_proforma: any;
  num_id_proforma: any;

  cod_cliente_proforma: any;
  cod_moneda_proforma: any;
  totalProf_proforma: any;
  tipo_de_pago_proforma: any;
  client_real: any;
  credito_disponible_moneda: any;
  credito_disponible_monto_credito_disponible: any = [];

  limite_text: string;
  anticipo_text: string;
  deuLoc_text: string;
  profApro_text: string;
  profApAgs_text: string;
  profAct_text: string;
  message: string[] = [];

  constructor(public log_module: LogService, public dialogRef: MatDialogRef<VerificarCreditoDisponibleComponent>,
    private api: ApiService, private datePipe: DatePipe, private toastr: ToastrService, public _snackBar: MatSnackBar,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public cod_cliente: any,
    @Inject(MAT_DIALOG_DATA) public tipoPago: any,
    @Inject(MAT_DIALOG_DATA) public cod_moneda: any,
    @Inject(MAT_DIALOG_DATA) public cliente_real: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any,
    @Inject(MAT_DIALOG_DATA) public totalProf: any,
    @Inject(MAT_DIALOG_DATA) public moneda: any,
    @Inject(MAT_DIALOG_DATA) public id_prof: any, @Inject(MAT_DIALOG_DATA) public numero_id_prof: any) {

    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.user_conn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;

    this.cod_cliente_proforma = cod_cliente.cod_cliente;
    this.cod_moneda_proforma = cod_moneda.cod_moneda;
    this.totalProf = totalProf.totalProf;
    this.tipo_de_pago_proforma = tipoPago.tipoPago;
    this.client_real = cliente_real.cliente_real;
    this.id_proforma = id_prof.id_prof;
    this.num_id_proforma = numero_id_prof.numero_id_prof;


    console.log(this.cod_cliente_proforma, this.cod_moneda_proforma, this.totalProf);
    if (this.agencia_logueado === 'Loc') {
      this.agencia_logueado = '311'
    }
  }

  ngOnInit() {
    this.validarCreditoDisponible();

    if (this.cod_cliente_proforma == undefined || this.cod_cliente_proforma == "") {
      // this.toastr.error('SELECCIONE CLIENTE ⚠️');
      this.validacion = true;
      this.message.push("SELECCIONE CLIENTE");
    }
    if (this.cod_moneda_proforma == undefined || this.cod_moneda_proforma == "") {
      // this.toastr.error('SELECCIONE MONEDA ⚠️');
      this.validacion = true;
      this.message.push("SELECCIONE MONEDA");
    }
    if (this.totalProf == undefined || this.totalProf == 0) {
      // this.toastr.error('EL TOTAL ES 0 O NO HAY TOTAL ⚠️');
      this.validacion = true;
      this.message.push("EL TOTAL TIENE QUE SER DISTINTO A 0");
    }
    if (this.tipo_de_pago_proforma == undefined || this.tipo_de_pago_proforma == "CONTADO") {
      // this.toastr.error('SELECCIONE TIPO DE PAGO EN LA PROFORMA ⚠️');
      this.validacion = true;
      this.message.push("EL TIPO DE PAGO EN LA PROFORMA TIENE QUE SER CREDITO");
    }

    // Mostramos los mensajes de validación concatenados
    // if (this.validacion) {
    //   this.toastr.error('¡' + this.message.join(', ') + '!');
    // }
  }

  validarCreditoDisponible() {
    let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/valCredDispCli/' + this.user_conn + "/" + this.cod_cliente_proforma + "/" +
      this.usuario_logueado + "/" + this.BD_storage + "/" + this.cod_moneda_proforma + "/" + this.totalProf + "/" + fechareg)
      .subscribe({
        next: (datav) => {
          this.credito_disponible = datav;
          console.log(this.credito_disponible);
          this.credito_disponible_moneda = datav.moneda_cliente;
          this.credito_disponible_monto_credito_disponible = datav.monto_credito_disponible;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          if (this.credito_disponible) {
            this.limite_text = this.credito_disponible.limite?.text?.slice(0, 3) || '';
            this.anticipo_text = this.credito_disponible.anticipo?.text?.slice(0, 3) || '';
            this.deuLoc_text = this.credito_disponible.deuLoc?.text?.slice(0, 3) || '';
            this.profApro_text = this.credito_disponible.profApro?.text?.slice(0, 3) || '';
            this.profApAgs_text = this.credito_disponible.profApro?.text?.slice(0, 3) || '';
            this.profAct_text = this.credito_disponible.profAct?.text?.slice(0, 3) || '';
          } else {
            console.error('Credito Disponible no está definido');
          }
        }
      })
  }

  aceptar() {
    console.log(this.credito_disponible.resultado_func);

    if (this.credito_disponible.resultado_func === false) {
      const confirmacionValidacionesResultadoFunc: boolean = window.confirm(`¿Desea verificar y asignar SI ES POSIBLE un CREDITO TEMPORAL?`);
      if (confirmacionValidacionesResultadoFunc) {
        this.aplicarCreditoTempAuto();
      }
    } else {
      this.close();
      this.toastr.success("CREDITO VALIDO");
    }
  }

  aplicarCreditoTempAuto() {
    let mesagge: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesMinimosVerifica/";
    return this.api.create('/venta/transac/veproforma/aplicarCredTempAutoCli/' + this.user_conn + "/" + this.client_real + "/" + this.usuario_logueado + "/" + this.BD_storage + "/" + this.cod_moneda_proforma
      + "/" + this.totalProf + "/" + this.credito_disponible_moneda + "/" + this.credito_disponible_monto_credito_disponible + "/"
      + this.id_proforma + "/" + this.num_id_proforma, [])
      .subscribe({
        next: (datav) => {
          console.log(datav);
          let mesaje_comleto = datav.msgConfir;
          this.modalDetalleObservaciones(datav.msgAlertOpcional, mesaje_comleto, datav.msgInfo);
        },

        error: (err: any) => {
          console.log(err, mesagge)
        },
        complete: () => { }
      });
  }

  modalDetalleObservaciones(obs, obsDetalle, msgInfo) {
    this.dialog.open(ModalDetalleObserValidacionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        obs_titulo: obs,
        obs_contenido: obsDetalle,
        more_messages: msgInfo
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
