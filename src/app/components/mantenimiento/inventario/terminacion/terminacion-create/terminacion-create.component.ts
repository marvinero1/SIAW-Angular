import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-terminacion-create',
  templateUrl: './terminacion-create.component.html',
  styleUrls: ['./terminacion-create.component.scss']
})
export class TerminacionCreateComponent implements OnInit {
  
  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  terminacion:any=[];
  userConn:any;
  usuarioLogueado:any;

  public ventana="terminacion-create"
  public detalle="terminacion-detalle";
  public tipo="transaccion-terminacion-POST";

  constructor(private _formBuilder: FormBuilder,  private datePipe: DatePipe, private api:ApiService,
    public dialogRef: MatDialogRef<TerminacionCreateComponent>, public _snackBar: MatSnackBar,
    public log_module:LogService, private toastr: ToastrService){

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit(): void{
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /inventario/mant/interminacion POST";
    return this.api.create("/inventario/mant/interminacion/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.terminacion = datav;
          console.log('data', datav);
          this.toastr.success('! SE GUARDO EXITOSAMENTE !');
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);          
          location.reload();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
          this.toastr.error('!NO SE GUARDO!');
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
