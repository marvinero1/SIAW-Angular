import { DatePipe } from '@angular/common';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  fecha_hoy_dia = Date.now();
  fecha_actual = new Date();
  hora_actual = new Date();
  logs: any = [];
  logData: FormGroup;
  userConn: any;
  usuarioLogueado: any;

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private api: ApiService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

  }



  createFormLog(ventana: string, detalle: string, tipo: string, id, numero_id): FormGroup {

    const usuario = this.usuarioLogueado;
    let hour = this.hora_actual.getHours().toString().padStart(2, '0');
    let minutes = this.hora_actual.getMinutes().toString().padStart(2, '0');
    let hora_actual_complete = `${hour}:${minutes}`; // Usar backticks para concatenar

    return this._formBuilder.group({
      usuario: new UntypedFormControl(usuario),
      fecha: new UntypedFormControl(this.datePipe.transform(this.fecha_hoy_dia, "yyyy-MM-dd")),
      hora: new UntypedFormControl(hora_actual_complete), // Se usa hora_actual_complete correctamente formateado
      entidad: new UntypedFormControl("SIAW"),
      codigo: new UntypedFormControl(""),
      id_doc: new UntypedFormControl(id),
      numeroid_doc: new UntypedFormControl(numero_id.toString()),
      ventana: new UntypedFormControl(ventana),
      detalle: new UntypedFormControl(detalle),
      tipo: new UntypedFormControl(tipo),
    });
  }

  createFormLogVentana(ventana: string, detalle: string): FormGroup {
    const usuario = this.usuarioLogueado;
    const hora_actual_complete = new Date();
    const horas = hora_actual_complete.getHours().toString().padStart(2, '0');
    const minutos = hora_actual_complete.getMinutes().toString().padStart(2, '0');
    const hora_formateada = `${horas}:${minutos}`;

    return this._formBuilder.group({
      usuario: new UntypedFormControl(usuario),
      fecha: new UntypedFormControl(this.datePipe.transform(this.fecha_hoy_dia, "yyyy-MM-dd")),
      hora: new UntypedFormControl(hora_formateada),
      entidad: new UntypedFormControl("SIAW"),
      codigo: new UntypedFormControl(""),
      id_doc: new UntypedFormControl(""),
      numeroid_doc: new UntypedFormControl(""),
      ventana: new UntypedFormControl(ventana),
      detalle: new UntypedFormControl(detalle),
      tipo: new UntypedFormControl("ruta"),
    });
  }

  guardarLog(ventana: string, detalle: string, tipo: string, id: string, numero_id: any) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.logData = this.createFormLog(ventana, detalle, tipo, id, numero_id);
    let data = this.logData.value;

    let errorMessage = "LOG Salio Error en guardar" + "Ruta:-/seg_adm/logs/selog/ OO  ACA SALE NULO?";
    return this.api.create("/seg_adm/logs/selog/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.logs = datav;
          console.log("LOG Guardados");
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  guardarVentana(ventana: string, detalle: string) {
    //ventana es el nombre de la ventana
    //detalle es la ruta PATH que redireccionara
    this.logData = this.createFormLogVentana(ventana, detalle);
    let data = this.logData.value;

    let errorMessage = "LOG Salio Error en guardar" + "Ruta: -/seg_adm/logs/selog/ ACA SALE NULO?";
    return this.api.create("/seg_adm/logs/selog/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.logs = datav;
          console.log("LOG Guardados");
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
}
