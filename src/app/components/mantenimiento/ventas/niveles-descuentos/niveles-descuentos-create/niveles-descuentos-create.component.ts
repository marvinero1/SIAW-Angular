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
  selector: 'app-niveles-descuentos-create',
  templateUrl: './niveles-descuentos-create.component.html',
  styleUrls: ['./niveles-descuentos-create.component.scss']
})
export class NivelesDescuentosCreateComponent implements OnInit {

  FormularioData: FormGroup;
  dataform: any = '';
  data_linea_producto = [];
  public ingrupo = [];
  public grupo_linea = [];
  public sub_grupo_linea = [];

  userConn: any;
  usuarioLogueado: any;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "nivel-desct-create"
  public detalle = "nivelDesct";
  public tipo = "nivelDesct-POST";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<NivelesDescuentosCreateComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService, private spinner: NgxSpinnerService,
    private toastr: ToastrService, public _snackBar: MatSnackBar,) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;



    this.FormularioData = this.createForm();
  }


  ngOnInit() {

  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:  /venta/mant/vedesnivel/ POST";
    return this.api.create("/venta/mant/vedesnivel/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.data_linea_producto = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  close() {
    this.dialogRef.close();
  }
}
