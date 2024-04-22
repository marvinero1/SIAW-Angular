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
  selector: 'app-vehiculo-create',
  templateUrl: './vehiculo-create.component.html',
  styleUrls: ['./vehiculo-create.component.scss']
})
export class VehiculoCreateComponent implements OnInit {
  
  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  vehiculo:any=[];
  userConn:any;
  userLogueado:any=[];

  public ventana="vehiculo-create"
  public detalle="vehiculo-detalle";
  public tipo="transaccion-vehiculo-POST";
  
  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<VehiculoCreateComponent>, public _snackBar: MatSnackBar,
    public log_module:LogService, private toastr: ToastrService){
      this.FormularioData = this.createForm();
  } 

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;  
  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    console.log(this.userLogueado);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      placa: [this.dataform.placa, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      activo: [this.dataform.activo, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /seg_adm/mant/advehiculo/";
    
    return this.api.create("/seg_adm/mant/advehiculo/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.vehiculo = datav;
        
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
