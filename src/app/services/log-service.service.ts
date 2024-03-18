import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  fecha_hoy_dia=Date.now();
  fecha_actual = new Date();
  hora_actual = new Date();
  logs:any=[];
  logData:FormGroup;
  userLogueado:any=[];
  userConn:any;

  constructor(private _formBuilder: FormBuilder,private datePipe: DatePipe, private api:ApiService){

  }

  ngOnInit(){
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  createFormLog(ventana:string, detalle:string, tipo:string): FormGroup {
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    const usuario = this.userLogueado;
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      usuario: new UntypedFormControl(usuario),
      fecha: new UntypedFormControl(this.datePipe.transform(this.fecha_hoy_dia,"yyyy-MM-dd")),
      hora: new UntypedFormControl(hora_actual_complete),
      entidad: new UntypedFormControl("SIAW"),
      codigo: new UntypedFormControl(""),
      id_doc: new UntypedFormControl(""),
      numeroid_doc: new UntypedFormControl(""),
      ventana: new UntypedFormControl(ventana),
      detalle: new UntypedFormControl(detalle),
      tipo: new UntypedFormControl(tipo),
    });
  } 

  createFormLogVentana(ventana:string, detalle:string): FormGroup {
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    const usuario = this.userLogueado;
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      usuario: new UntypedFormControl(usuario),
      fecha: new UntypedFormControl(this.datePipe.transform(this.fecha_hoy_dia,"yyyy-MM-dd")),
      hora: new UntypedFormControl(hora_actual_complete),
      entidad: new UntypedFormControl("SIAW"),
      codigo: new UntypedFormControl(""),
      id_doc: new UntypedFormControl(""),
      numeroid_doc: new UntypedFormControl(""),
      ventana: new UntypedFormControl(ventana),
      detalle: new UntypedFormControl(detalle),
      tipo: new UntypedFormControl("ruta"),
    });
  } 

  guardarLog(ventana:string, detalle:string, tipo:string){
    this.logData = this.createFormLog(ventana, detalle, tipo);
    let data = this.logData.value;

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage = "LOG Salio Error en guardar"+"Ruta:--  /LOG";
    return this.api.create("/seg_adm/logs/selog/"+this.userConn, data)
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

  guardarVentana(ventana:string, detalle:string){
    //ventana es el nombre de la ventana
    //detalle es la ruta PATH que redireccionara
    this.logData = this.createFormLogVentana(ventana, detalle);
    let data = this.logData.value;

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage = "LOG Salio Error en guardar"+"Ruta:--  /LOG";
    return this.api.create("/seg_adm/logs/selog/"+this.userConn, data)
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
