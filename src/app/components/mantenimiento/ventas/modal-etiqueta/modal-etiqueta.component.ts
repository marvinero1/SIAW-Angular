import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { EtiquetaService } from './servicio-etiqueta/etiqueta.service';
import { ToastrService } from 'ngx-toastr';

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
  linea2_input: any;
  cliente_real_proforma: string;
  longitud_etiqueta:number;

  data: any = [];
  data_map: any = [];
  longitud_data_map:number=0;

  userConn: string;
  direccion_get: string;
  latitud_get: any;
  longitud_get: any;

  array_enviar: any = [];
  data_map_con_etiqueta_elegida: any = [];
  data_array: any = {}

  constructor(public dialogRef: MatDialogRef<ModalEtiquetaComponent>,
    private api: ApiService, public _snackBar: MatSnackBar, public servicioEtiqueta: EtiquetaService,
    private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public cliente_real: any,
    @Inject(MAT_DIALOG_DATA) public cod_cliente_proforma1: any,
    @Inject(MAT_DIALOG_DATA) public id_proforma: any, @Inject(MAT_DIALOG_DATA) public latitud: any,
    @Inject(MAT_DIALOG_DATA) public numero_id: any, @Inject(MAT_DIALOG_DATA) public nom_cliente: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea: any, @Inject(MAT_DIALOG_DATA) public id_sol_desct: any,
    @Inject(MAT_DIALOG_DATA) public nro_id_sol_desct: any, @Inject(MAT_DIALOG_DATA) public etiqueta_elegida: any,
    @Inject(MAT_DIALOG_DATA) public direccion: any, @Inject(MAT_DIALOG_DATA) public longitud: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.cod_cliente_proforma = cod_cliente_proforma1.cod_cliente_proforma1;
    this.id_proforma_get = id_proforma.id_proforma;
    this.numero_id_proforma = numero_id.numero_id;
    this.nombre_cliente_get = nom_cliente.nom_cliente;
    this.desc_linea_proforma = desc_linea.desc_linea;
    this.id_sol_desct_proforma = id_sol_desct.id_sol_desct;
    this.nro_id_sol_desct_proforma = nro_id_sol_desct.nro_id_sol_desct;
    this.cliente_real_proforma = cliente_real.cliente_real;
    this.direccion_get = direccion.direccion;
    this.longitud_get = longitud.longitud;
    this.latitud_get = latitud.latitud;
    this.data_map_con_etiqueta_elegida = etiqueta_elegida.etiqueta_elegida === undefined || null ? []:etiqueta_elegida.etiqueta_elegida;
      
    this.linea2_input = this.data_map_con_etiqueta_elegida[0]?.linea2;

    console.log("🚀 ~ ModalEtiquetaComponent ~ @Inject ~ data_map_con_etiqueta_elegida:", this.data_map_con_etiqueta_elegida, "linea2:", this.linea2_input, this.linea2_input);

    this.longitud_data_map = this.data_map_con_etiqueta_elegida.length;
    
    console.log("🚀 ~ ModalEtiquetaComponent ~ @Inject ~ longitud_data_map:", this.longitud_data_map)
    this.longitud_etiqueta = 0;
    
    // console.log(this.cod_cliente_proforma, this.id_proforma_get, this.numero_id_proforma, this.nombre_cliente_get,
    //   this.desc_linea_proforma, this.id_sol_desct_proforma, this.nro_id_sol_desct_proforma, this.cliente_real_proforma);

    if(this.longitud_data_map != 0){
      this.data_map = this.data_map_con_etiqueta_elegida;
    }else{
      this.getDataEtiquetaClientesinDescuento();
    }
  }

  ngOnInit() {
    //EL DESCUENTO DE LINEA SEGUN SOLICITUD ESTA DESHABILITADO A LA FECHA QUE SE CREO ESTE COMPONENTE 8-3-2024
    // POR ENDE EL CAMPO  this.desc_linea_proforma, this.id_sol_desct_proforma, this.nro_id_sol_desct_proforma SE LOS
    // ENVIA VALOR FALSE 0, 0 RESPECTIVAMENTE
  }

  getDataEtiquetaClientesinDescuento() {
    let a = {
      // codcliente_real: this.cliente_real_proforma,
      codcliente_real: this.cliente_real_proforma,
      id: this.id_proforma_get === undefined ? "0" : this.id_proforma_get,
      numeroid: this.numero_id_proforma,
      codcliente: this.cod_cliente_proforma,
      nomcliente: this.nombre_cliente_get,
      desclinea_segun_solicitud: this.desc_linea_proforma === undefined ? false : this.desc_linea_proforma,
      idsoldesctos: this.id_sol_desct_proforma === undefined ? "0" : this.id_sol_desct_proforma,
      nroidsoldesctos: this.nro_id_sol_desct_proforma === undefined ? 0 : this.nro_id_sol_desct_proforma,
      linea2: this.linea2_input?.slice(0, 25),
    }
    console.log(a);

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getDataEtiqueta/";
    return this.api.create('/venta/transac/veproforma/getDataEtiqueta/' + this.userConn, a)
      .subscribe({
        next: (datav) => {
          this.data = datav;
          console.log('data', this.data);
          this.data_map = this.data.etiquetas;
          // datav.forEach(element => {
          //   if(element.central){
          //     this.direccion = element.direccion;
          //   }
          // });

          // this.data_map = this.data.map((element) => ({
          //   ...element,
          //   ciudad:element.ciudad?.slice(0, 30),
          //   codcliente: this.cod_cliente_proforma,
          //   representante: this.direccion_get,
          //   longitud_entrega: this.longitud_get?.slice(0, 25),
          //   latitud_entrega: this.latitud_get?.slice(0, 25),
          //   linea2: this.linea2_input?,
          // }));

          // console.log("Data Etiqueta Mapeada: ", this.data_map);
          this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.data_map.latitud_entrega + "%2C" + this.data_map.longitud_entrega;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  seleccionarEtiqueta(etiqueta, valor_linea_2){
    console.log("ETIQUETA ELEGIDA: ", etiqueta, valor_linea_2);

    this.data_map = [etiqueta].map((element) => ({
      ...element,
      linea1: element?.linea1.slice(0, 25) === undefined ? "":element?.linea1?.slice(0, 25),
      linea2: valor_linea_2?.slice(0, 25) === undefined ? "":valor_linea_2?.slice(0, 25),
      elegida:true,

      ciudad:element.ciudad?.slice(0, 30),
      // codcliente: this.cod_cliente_proforma,
      // representante: this.direccion_get,
      longitud_entrega: element.longitud_entrega?.slice(0, 25),
      latitud_entrega: element.latitud_entrega?.slice(0, 25),
    }));
    this.longitud_etiqueta = this.data_map.length

    console.log("ETIQUETA ELEGIDA MAP: ", this.data_map, this.data_map.length);
  }

  enviarArrayToProforma() {
    this.servicioEtiqueta.disparadorDeEtiqueta.emit({
      etiqueta: this.data_map[0],
    });

    this.close();
    this.toastr.success("ETIQUETA GRABADA CON EXITO !");
  }

  close() {
    this.dialogRef.close();
  }
}
