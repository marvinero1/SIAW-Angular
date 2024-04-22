import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';
import { EtiquetaService } from './servicio-etiqueta/etiqueta.service';
@Component({
  selector: 'app-modal-etiqueta',
  templateUrl: './modal-etiqueta.component.html',
  styleUrls: ['./modal-etiqueta.component.scss']
})
export class ModalEtiquetaComponent implements OnInit {

  cod_cliente_proforma: any;
  id_proforma_get: any;
  numero_id_proforma: any;
  tipo_de_pago_proforma: any;
  nombre_cliente_get: any;
  desc_linea_proforma: any;
  id_sol_desct_proforma: any;
  nro_id_sol_desct_proforma: any;

  URL_maps: string;
  input: string;
  cliente_real_proforma: string;

  data: any = [];
  userConn: string;

  array_enviar: any = [];

  constructor(public dialogRef: MatDialogRef<ModalEtiquetaComponent>,
    private api: ApiService, public _snackBar: MatSnackBar, public servicioEtiqueta: EtiquetaService,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any, @Inject(MAT_DIALOG_DATA) public id_proforma: any,
    @Inject(MAT_DIALOG_DATA) public numero_id: any, @Inject(MAT_DIALOG_DATA) public nom_cliente: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea: any, @Inject(MAT_DIALOG_DATA) public id_sol_desct: any,
    @Inject(MAT_DIALOG_DATA) public nro_id_sol_desct: any, @Inject(MAT_DIALOG_DATA) public cliente_real: any) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.cod_cliente_proforma = cod_cliente.cod_cliente;
    this.id_proforma_get = id_proforma.id_proforma;
    this.numero_id_proforma = numero_id.numero_id;
    this.nombre_cliente_get = nom_cliente.nom_cliente;
    this.desc_linea_proforma = desc_linea.desc_linea;
    this.id_sol_desct_proforma = id_sol_desct.id_sol_desct;
    this.nro_id_sol_desct_proforma = nro_id_sol_desct.nro_id_sol_desct;
    this.cliente_real_proforma = cliente_real.cliente_real;

    console.log(this.cod_cliente_proforma, this.id_proforma_get, this.numero_id_proforma, this.nombre_cliente_get,
      this.desc_linea_proforma, this.id_sol_desct_proforma, this.nro_id_sol_desct_proforma, this.cliente_real_proforma);

    console.log('/venta/transac/veproforma/getDataEtiqueta/' + this.userConn + "/" + this.cliente_real_proforma + "/" + this.id_proforma_get + "/" + this.numero_id_proforma + "/" + this.cod_cliente_proforma + "/" + this.nombre_cliente_get + "/" + "false" + "/0" + "/0");
  }

  ngOnInit() {
    //EL DESCUENTO DE LINEA SEGUN SOLICITUD ESTA DESHABILITADO A LA FECHA QUE SE CREO ESTE COMPONENTE 8-3-2024
    // POR ENDE EL CAMPO  this.desc_linea_proforma, this.id_sol_desct_proforma, this.nro_id_sol_desct_proforma SE LOS
    // ENVIA VALOR FALSE 0, 0 RESPECTIVAMENTE
    this.getDataEtiquetaClientesinDescuento();
  }

  getDataEtiquetaClientesinDescuento() {
    let a = {
      codcliente_real: this.cliente_real_proforma,
      id: this.id_proforma_get,
      numeroid: this.numero_id_proforma,
      codcliente: this.cod_cliente_proforma,
      nomcliente: this.nombre_cliente_get,
      desclinea_segun_solicitud: this.desc_linea_proforma === undefined ? false : this.desc_linea_proforma,
      idsoldesctos: this.id_sol_desct_proforma === undefined ? "0" : this.id_sol_desct_proforma,
      nroidsoldesctos: this.nro_id_sol_desct_proforma === undefined ? 0 : this.nro_id_sol_desct_proforma,
    }
    console.log(a);

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getDataEtiqueta/";
    return this.api.create('/venta/transac/veproforma/getDataEtiqueta/' + this.userConn, a)
      .subscribe({
        next: (datav) => {
          this.data = datav;
          console.log('data', this.data);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.data.latitud_entrega + "%2C" + this.data.longitud_entrega;
        }
      })
  }

  enviarArrayToProforma() {
    this.servicioEtiqueta.disparadorDeEtiqueta.emit({
      etiqueta: this.data,
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
