import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonaCatalogoComponent } from '@components/mantenimiento/persona-catalogo/persona-catalogo.component';
import { ServicePersonaService } from '@components/mantenimiento/persona-catalogo/service-persona/service-persona.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deudores-create',
  templateUrl: './deudores-create.component.html',
  styleUrls: ['./deudores-create.component.scss']
})
export class DeudoresCreateComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  userConn: any;
  
  numChecCli:any=[];
  userLogueado: any = [];
  persona_get: any = [];
  persona_get_catalogo: any = [];
  persona_get_id: any = [];
  persona_get_catalogo_id: any;

  public ventana="deudores-create"
  public detalle="deudores-detalle";
  public tipo="transaccion-deudores-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<DeudoresCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, public dialog: MatDialog, public servicioPersona:ServicePersonaService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
    
  }

  ngOnInit() {
    this.getPersona();
    this.servicioPersona.disparadorDePersonas.subscribe(data =>{
      console.log("Recibiendo Persona: " , data);
      this.persona_get_catalogo = data.persona;
        this.persona_get_catalogo_id = data.persona.codigo;
    });
  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      codpersona: [this.dataform.codpersona],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /fondos/mant/fndeudor/";
    
    return this.api.create("/fondos/mant/fndeudor/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.numChecCli = datav;

          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.onNoClick();
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');

          location.reload();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  getPersona(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/"
    return this.api.getAll('/pers_plan/mant/pepersona/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.persona_get = datav;
          // console.log(this.persona_get);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeave(event: any){
    const inputValue = event.target.value;
    let numero = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.persona_get.some(objeto => objeto.codigo === numero);

    if(!encontrado){
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
      this.persona_get_catalogo.descrip = "";
    } else {
      event.target.value = numero;
      this.getPersonaID(numero);
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', numero);
  }

  getPersonaID(id){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/"
    return this.api.getAll('/pers_plan/mant/pepersona/'+this.userConn+"/"+id)
      .subscribe({
        next: (datav) => {
          this.persona_get_id = datav;
          console.log(this.persona_get_id);

          this.persona_get_catalogo.descrip = this.persona_get_id.nombre1+" "+ this.persona_get_id.nombre2+" "+this.persona_get_id.apellido1+" "+this.persona_get_id.apellido2;
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  catalogoPersona(): void {
    this.dialog.open(PersonaCatalogoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
