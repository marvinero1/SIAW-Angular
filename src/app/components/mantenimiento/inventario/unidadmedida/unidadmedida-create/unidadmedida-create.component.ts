import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unidadmedida-create',
  templateUrl: './unidadmedida-create.component.html',
  styleUrls: ['./unidadmedida-create.component.scss']
})
export class UnidadmedidaCreateComponent implements OnInit {

  FormularioData: FormGroup;
  dataform: any = '';
  data_unidad_medida = [];
  userConn: any;
  usuarioLogueado: any;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "nts-unimedida-create"
  public detalle = "nts-unimedida";
  public tipo = "nts-unimedida-POST";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<UnidadmedidaCreateComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService,
    private toastr: ToastrService, public _snackBar: MatSnackBar) {
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
      Codigo: [this.dataform.Codigo, Validators.compose([Validators.required])],
      Descripcion: [this.dataform.Descripcion, Validators.compose([Validators.required])],
      entera: [this.dataform.entera === null ? true : false],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      Usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adunidad POST";
    return this.api.create("/inventario/mant/inudemed/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.data_unidad_medida = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('Guardado con Exito! 🎉');

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! No Se Guardo Correctamente !');
        },

        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
