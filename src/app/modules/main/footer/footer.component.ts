import { Component, HostBinding, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import packageInfo from './../../../../../package.json';
import { ApiService } from '@services/api.service';
import { DatePipe } from '@angular/common';
import { NombreVentanaService } from './servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @HostBinding('class') classes: string = 'main-footer';
  public appVersion = packageInfo.version;
  public currentYear: string = DateTime.now().toFormat('y');
  public tipo_cambio_hoy_dia: any = [];
  public nombre_ventana: string;

  fecha_actual = new Date();

  public usuario_logueado: any;
  public agencia_storage: any;
  public BD_storage: any;
  public userConn: any;
  public usuarioLogueado: any;

  tipo_cambio_dolar: any;
  tipo_cambio_dolar_dolar: any;
  tipo_cambio_dolar_moneda_base: any;

  constructor(private api: ApiService, private datePipe: DatePipe, public nombre_ventana_service: NombreVentanaService) {
    this.agencia_storage = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.nombre_ventana_service.disparadorDeNombreVentana.subscribe(data => {
      console.log("Recibiendo Ventana: ", data);
      this.nombre_ventana = data.nombre_vent;
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTipoCambioHoyDia(this.userConn);
  }

  getTipoCambioHoyDia(userConn) {
    let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adtipocambio/getTipocambioFecha/";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getTipocambioFecha/' + this.userConn + "/" + dataTransform)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio_hoy_dia = datav;
          console.log("Tipo de Cambio HOY DIA: ", this.tipo_cambio_hoy_dia);

          this.tipo_cambio_dolar = this.tipo_cambio_hoy_dia.filter((element) => element.moneda === 'US');
          this.tipo_cambio_dolar_dolar = this.tipo_cambio_dolar[0].factor;
          this.tipo_cambio_dolar_moneda_base = this.tipo_cambio_dolar[0].monedabase;

          console.log(this.tipo_cambio_dolar);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
}
