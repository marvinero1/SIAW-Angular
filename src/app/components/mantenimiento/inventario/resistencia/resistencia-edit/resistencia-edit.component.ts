import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resistencia-edit',
  templateUrl: './resistencia-edit.component.html',
  styleUrls: ['./resistencia-edit.component.scss']
})
export class ResistenciaEditComponent implements OnInit {

  public ventana = "resistencia-edit"
  public detalle = "resistencia-detalle";
  public tipo = "transaccion-resistencia-PUT";

  FormularioDataEdit: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  resistencia_edit: any = [];
  dataform: any = '';
  resistencia_form_update: any = [];
  userConn: any;
  usuarioLogueado: any;


  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<ResistenciaEditComponent>, public log_module: LogService,
    @Inject(MAT_DIALOG_DATA) public dataRoscaEdit: any, private api: ApiService, private datePipe: DatePipe,
    public _snackBar: MatSnackBar, private toastr: ToastrService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.resistencia_edit = this.dataRoscaEdit.dataRoscaEdit;
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataRoscaEdit.dataRoscaEdit?.codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    let data = this.FormularioDataEdit.value;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adusuario Update";
    return this.api.update('/inventario/mant/inresistencia/' + this.userConn + "/" + this.resistencia_edit?.codigo, data)
      .subscribe({
        next: (datav) => {

          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.resistencia_form_update = datav;

          this._snackBar.open('Se ha editado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
          location.reload();
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE EDITO !');
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
