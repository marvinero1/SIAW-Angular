import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-percepcionesretenciones-edit',
  templateUrl: './percepcionesretenciones-edit.component.html',
  styleUrls: ['./percepcionesretenciones-edit.component.scss']
})
export class PercepcionesretencionesEditComponent implements OnInit {

  FormularioDataEdit: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  percpRet_edit: any = [];
  dataform: any = '';
  unidadNegocio: [];
  percpRet: any = [];
  usuario_logueado: any;
  user_conn: any;
  errorMessage;

  public ventana = "percepcionesRetenciones"
  public detalle = "percepcionesRetenciones-edit";
  public tipo = "percepcionesRetenciones-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public log_module: LogService, public dialogRef: MatDialogRef<PercepcionesretencionesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public datapercpRetEdit: any, private api: ApiService, private datePipe: DatePipe, private toastr: ToastrService,
    public _snackBar: MatSnackBar) {
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.percpRet_edit = this.datapercpRetEdit.datapercpRetEdit;
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.datapercpRetEdit.datapercpRetEdit?.codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      porcentaje: [this.dataform.porcentaje, Validators.compose([Validators.required])],
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [this.usuario_logueado],
    });
  }

  submitData() {
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  /compras/mant/cppercepcion/ Update";
    return this.api.update('/compras/mant/cppercepcion/' + this.user_conn + "/" + this.percpRet_edit.codigo, data)
      .subscribe({
        next: (datav) => {
          this.percpRet = datav;
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },

        error: (err: any) => {
          this.toastr.error('! NO SE EDITO !');
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
