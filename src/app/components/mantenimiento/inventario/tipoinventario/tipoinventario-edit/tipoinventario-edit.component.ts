import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-tipoinventario-edit',
  templateUrl: './tipoinventario-edit.component.html',
  styleUrls: ['./tipoinventario-edit.component.scss']
})
export class TipoinventarioEditComponent implements OnInit {

  FormularioData: FormGroup;
  unidadnegocio = [];
  dataform: any = '';
  userConn: any;
  usuarioLogueado: any;
  num_tipo_inventario = [];
  data_inventario: any = [];
  data_inventario_codigo: any;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "nts-tipoinventario-create"
  public detalle = "nts-tipoinventario";
  public tipo = "nts-tipoinventario-POST";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<TipoinventarioEditComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService,
    public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public dataInventarioEdit: any) {

    this.data_inventario = dataInventarioEdit.dataInventarioEdit;
    this.data_inventario_codigo = dataInventarioEdit.dataInventarioEdit?.id;

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.data_inventario_codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  inventario/mant/intipoinv/ POST";
    return this.api.update("/inventario/mant/intipoinv/" + this.userConn + "/" + this.data_inventario_codigo, data)
      .subscribe({
        next: (datav) => {
          this.num_tipo_inventario = datav;

          console.log('data', datav);
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
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
