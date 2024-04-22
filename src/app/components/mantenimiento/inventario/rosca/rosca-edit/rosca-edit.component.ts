import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rosca-edit',
  templateUrl: './rosca-edit.component.html',
  styleUrls: ['./rosca-edit.component.scss']
})
export class RoscaEditComponent implements OnInit {

  FormularioDataEdit:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  rosca_edit:any=[];
  dataform:any='';
  rosca_form_update:any=[];
  userConn:any;
  usuarioLogueado:any;
  errorMessage;

  public ventana="rosca-edit"
	public detalle="rosca-detalle";
	public tipo="transaccion-rosca-PUT";

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<RoscaEditComponent>, public log_module:LogService,
    @Inject(MAT_DIALOG_DATA) public dataRoscaEdit: any, private api:ApiService, private datePipe: DatePipe,private toastr: ToastrService,
    public _snackBar: MatSnackBar){
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit(){
    this.rosca_edit = this.dataRoscaEdit.dataRoscaEdit;
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataRoscaEdit.dataRoscaEdit.codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData(){
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /seg_adm/mant/adusuario Update";
    return this.api.update('/inventario/mant/inrosca/'+this.userConn+"/"+this.rosca_edit.codigo, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.rosca_form_update = datav;

          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          this._snackBar.open('Se ha editado correctamente!', 'Ok', {
            duration: 3000,
          });
          location.reload();
        },
    
        error: (err: any) => { 
          console.log(err, this.errorMessage);
          this.toastr.error('! NO SE EDITO !');

        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
