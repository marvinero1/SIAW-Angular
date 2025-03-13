import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deudores-comp-edit',
  templateUrl: './deudores-comp-edit.component.html',
  styleUrls: ['./deudores-comp-edit.component.scss']
})
export class DeudoresCompEditComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  userConn: any;
  userLogueado: any = [];
  deudor_post: any = [];
  deudor_edit: any = []
  deudor_edit_codigo: any;

  public ventana = "abmfndeudor_compuesto-create"
  public detalle = "abmfndeudor_compuesto-detalle";
  public tipo = "transaccion-abmfndeudor_compuesto-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<DeudoresCompEditComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public dataDeudorCompEdit: any) {

    this.deudor_edit = dataDeudorCompEdit.dataDeudorCompEdit;
    this.deudor_edit_codigo = dataDeudorCompEdit.dataDeudorCompEdit?.id;

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
  }

  createForm(): FormGroup {
    let usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.deudor_edit_codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /fondos/mant/fndeudor_compuesto/";

    return this.api.update("/fondos/mant/fndeudor_compuesto/" + this.userConn + "/" + this.deudor_edit_codigo, data)
      .subscribe({
        next: (datav) => {
          this.deudor_post = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
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
