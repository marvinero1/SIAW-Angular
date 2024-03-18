import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-resistencia-create',
  templateUrl: './resistencia-create.component.html',
  styleUrls: ['./resistencia-create.component.scss']
})
export class ResistenciaCreateComponent implements OnInit {


  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  resistencia:any=[];
  userConn:any;
  usuarioLogueado:any;

  public ventana="resistencia-create"
  public detalle="resistencia-detalle";
  public tipo="transaccion-resistencia-POST";

  constructor(private _formBuilder: FormBuilder,  private datePipe: DatePipe,public _snackBar: MatSnackBar,
    private api:ApiService, public dialogRef: MatDialogRef<ResistenciaCreateComponent>, private toastr: ToastrService,
    public log_module:LogService){
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:-- inventario/mant/inresistencia POST";
    return this.api.create("/inventario/mant/inresistencia/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.resistencia = datav;
          console.log('data', datav);

          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.toastr.success('Guardado con Exito! 🎉');
          this._snackBar.open('Se guardo correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });
          location.reload();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
