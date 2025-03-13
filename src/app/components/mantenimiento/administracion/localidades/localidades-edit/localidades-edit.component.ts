import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-localidades-edit',
  templateUrl: './localidades-edit.component.html',
  styleUrls: ['./localidades-edit.component.scss']
})
export class LocalidadesEditComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  localidad_edit: any = [];
  dataform: any = '';
  empresa: [];
  area: any = [];
  userLogueado: any;
  userConn: any;
  codigo: any;
  errorMessage;

  public ventana = "localidad"
  public detalle = "localidad-edit";
  public tipo = "localidad-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<LocalidadesEditComponent>,
    public log_module: LogService,
    @Inject(MAT_DIALOG_DATA) public dataLocalidadEdit: any, private api: ApiService, private datePipe: DatePipe, private toastr: ToastrService,
    public _snackBar: MatSnackBar) {
    this.FormularioData = this.createForm();

    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.localidad_edit = this.dataLocalidadEdit.dataLocalidadEdit;
  }

  createForm(): FormGroup {
    let userLogueado1 = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.codigo = this.dataLocalidadEdit.dataLocalidadEdit?.codigo;
    console.log(this.codigo);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      provincia: [this.dataform.provincia,],
      codigo_postal: [this.dataform.codigo_postal],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [userLogueado1],
    });
  }

  submitData() {
    let data = this.FormularioData.value;

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adusuario Update";
    return this.api.update('/seg_adm/mant/abmadlocalidad/' + this.userConn + "/" + this.localidad_edit.codigo, data)
      .subscribe({
        next: (datav) => {
          this.area = datav;
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
