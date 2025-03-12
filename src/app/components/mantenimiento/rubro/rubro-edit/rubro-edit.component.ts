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
  selector: 'app-rubro-edit',
  templateUrl: './rubro-edit.component.html',
  styleUrls: ['./rubro-edit.component.scss']
})
export class RubroEditComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  rubro: any = [];
  moneda: any = [];
  empresa: any = [];
  userConn: any;
  userLogueado: any = [];
  dataRubroEdit_get: any = [];

  public ventana = "rubro-create"
  public detalle = "rubro-detalle";
  public tipo = "transaccion-rubro-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<RubroEditComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public dataRubroEdit: any) {

    this.dataRubroEdit_get = this.dataRubroEdit.dataRubroEdit;
    this.FormularioData = this.createForm();
  }

  ngOnInit(): void {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  createForm(): FormGroup {
    console.log(this.userLogueado);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataRubroEdit_get?.codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.userLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/verubro/";

    return this.api.update("/venta/mant/verubro/" + this.userConn + "/" + this.dataRubroEdit_get.codigo, data)
      .subscribe({
        next: (datav) => {
          this.rubro = datav;

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

  getAllEmpresa(user_conn) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adempresa/' + user_conn)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
          //console.log('data', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
