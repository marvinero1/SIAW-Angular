import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss']
})
export class RolesEditComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  role_edit: any = [];
  rol: any = [];
  role_edit_codigo: any;
  userConn: any = [];

  public ventana = "rol-edit"
  public detalle = "rol-detalle";
  public tipo = "transaccion-rol-PUT";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<RolesEditComponent>, public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dataRolEdit: any, public log_module: LogService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.role_edit_codigo = this.dataRolEdit.dataRolEdit?.codigo;

  }

  ngOnInit(): void {
    this.FormularioData = this.createForm();

    this.role_edit = this.dataRolEdit.dataRolEdit;
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.role_edit_codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      contabilizar: [this.dataform.contabilizar],
      contabiliza: [true],
      dias_cambio: [this.dataform.dias_cambio],
      long_minima: [this.dataform.long_minima],
      con_letras: [this.dataform.con_letras],
      con_numeros: [this.dataform.con_numeros],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.userConn],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/serol/";
    return this.api.update("/seg_adm/mant/serol/" + this.userConn + "/" + this.role_edit.codigo, data)
      .subscribe({
        next: (datav) => {
          this.rol = datav;
          //  console.log('data', datav);

          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 2000);

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
