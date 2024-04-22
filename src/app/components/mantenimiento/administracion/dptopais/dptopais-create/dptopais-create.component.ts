import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dptopais-create',
  templateUrl: './dptopais-create.component.html',
  styleUrls: ['./dptopais-create.component.scss']
})
export class DptopaisCreateComponent implements OnInit {

  public FormularioData:FormGroup;
  public fecha_actual = new Date();
  public hora_actual = new Date();
  public dataform:any='';
  public dpto:any=[];
  public usuario_logueado:any;

  public ventana="dptopais-create"
	public detalle="dptopais-detalle";
	public tipo="dptopais-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module:LogService,
    private api:ApiService, public dialogRef: MatDialogRef<DptopaisCreateComponent>, public _snackBar: MatSnackBar,
    private toastr: ToastrService,){

    this.FormularioData = this.createForm();
  }

  ngOnInit(){

  }

  createForm(): FormGroup {
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataform.codigo,Validators.compose([Validators.required])],
      nombre: [this.dataform.nombre,Validators.compose([Validators.required])],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuario_logueado],
    });
  }

  submitData(){
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /admoneda";
    return this.api.create("/seg_adm/mant/addepto/"+userConn, data)
      .subscribe({
        next: (datav) => {
          this.dpto = datav;
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);

          this.toastr.success('! GUARDADO EXITOSAMENTE !');

          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
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
