import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehiculo-edit',
  templateUrl: './vehiculo-edit.component.html',
  styleUrls: ['./vehiculo-edit.component.scss']
})
export class VehiculoEditComponent implements OnInit {

  FormularioDataEdit:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  vehiculo_edit:any=[];
  dataform:any='';
  area:any=[];
  usuario_logueado:any;
  user_conn:any;

  public ventana="area"
  public detalle="area-edit";
  public tipo="area-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<VehiculoEditComponent>, 
    public log_module:LogService,private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public dataVehiculoEdit: any, private api:ApiService, private toastr: ToastrService,
    public _snackBar: MatSnackBar){
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit(){
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.user_conn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.vehiculo_edit = this.dataVehiculoEdit.dataVehiculoEdit;
  }

  createForm(): FormGroup {
    const usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

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
    let data = this.FormularioDataEdit.value;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /seg_adm/mant/adusuario Update";
    return this.api.update('/seg_adm/mant/advehiculo/'+this.user_conn+"/"+this.vehiculo_edit.placa, data)
      .subscribe({
        next: (datav) => {
          this.area = datav;
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },
    
        error: (err: any) => { 
          this.toastr.error('! NO SE EDITO !');
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
