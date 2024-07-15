import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recargo-documento-edit',
  templateUrl: './recargo-documento-edit.component.html',
  styleUrls: ['./recargo-documento-edit.component.scss']
})
export class RecargoDocumentoEditComponent implements OnInit {

  recargo_edit: any = [];
  recargo_edit_codigo: any;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';

  userConn: any;
  usuarioLogueado;
  moneda_get: any = [];
  recargo: any = [];

  monto = false;
  porcentaje = false;
  indeterminate = false;
  disabled = false;
  checked = true;

  codigo: any;
  descripcion: any;
  descorta: any;
  moneda: any;
  porcentaje_set: any;
  monto_set: any;
  modificable: any;

  public ventana = "Recargos-edit"
  public detalle = "Recargos-detalle";
  public tipo = "Recargos-UPDATE";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<RecargoDocumentoEditComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public dataRecargoEdit: any) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;


    this.recargo_edit = this.dataRecargoEdit.dataRecargoEdit;
    this.recargo_edit_codigo = this.dataRecargoEdit.dataRecargoEdit.codigo;
    console.log(this.recargo_edit);
  }

  ngOnInit() {
    this.getAllmoneda();
  }

  submitData() {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    console.log(this.usuarioLogueado);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    let data = {
      codigo: this.recargo_edit.codigo,
      descorta: this.recargo_edit.descorta,
      descripcion: this.recargo_edit.descripcion,
      porcentaje: this.recargo_edit.porcentaje,
      monto: this.recargo_edit.monto,
      moneda: this.recargo_edit.moneda,
      modificable: this.recargo_edit.modificable,

      fechareg: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
      horareg: hora_actual_complete,
      usuarioreg: usuario_logueado,
    };

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/verecargo/";

    return this.api.update("/venta/mant/verecargo/" + this.userConn + '/' + this.recargo_edit_codigo, data)
      .subscribe({
        next: (datav) => {
          this.recargo = datav;
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

  getAllmoneda() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/admoneda/catalogo/";
    return this.api.getAll('/seg_adm/mant/admoneda/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get = datav;
          console.log(this.moneda_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
}
