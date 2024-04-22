import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-localidades-create',
  templateUrl: './localidades-create.component.html',
  styleUrls: ['./localidades-create.component.scss']
})
export class LocalidadesCreateComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  localidad:any=[];
  moneda:any=[];
  empresa:any=[];
  userConn:any;
  userLogueado:any=[];

  public ventana="localidad-create"
  public detalle="localidad-detalle";
  public tipo="transaccion-localidad-POST";
  
  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<LocalidadesCreateComponent>, public _snackBar: MatSnackBar,
    public log_module:LogService, private toastr: ToastrService){
      this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  
      this.FormularioData = this.createForm();
  } 

  ngOnInit(): void {
  }

  createForm(): FormGroup{
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataform.codigo,Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion,Validators.compose([Validators.required])],
      provincia: [this.dataform.provincia,],
      codigo_postal: [this.dataform.codigo_postal],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.userLogueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:-- /seg_adm/mant/adarea/";
    
    return this.api.create("/seg_adm/mant/abmadlocalidad/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.localidad = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
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
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
