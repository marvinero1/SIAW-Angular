import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipoconocimientocarga-edit',
  templateUrl: './tipoconocimientocarga-edit.component.html',
  styleUrls: ['./tipoconocimientocarga-edit.component.scss']
})
export class TipoconocimientocargaEditComponent implements OnInit {

  FormularioData: FormGroup;
  public unidadnegocio = [];
  dataform: any = '';
  userConn: any;
  num_conocimiento_carga = [];
  dataEdit: any = [];
  dataEdit_codigo: any;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "nts-conocimicarga-update"
  public detalle = "nts-conocimicarga";
  public tipo = "nts-conocimicarga-POST";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<TipoconocimientocargaEditComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService, private toastr: ToastrService,
    public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public dataConocimientoEdit: any) {

    this.dataEdit = dataConocimientoEdit?.dataConocimientoEdit;
    this.dataEdit_codigo = dataConocimientoEdit?.dataConocimientoEdit?.id;

    console.log(this.dataEdit_codigo);

    this.FormularioData = this.createForm();
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataEdit_codigo],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.userConn],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /inventario/mant/intipocarga/ UPDATE";
    return this.api.update("/inventario/mant/intipocarga/" + this.userConn + "/" + this.dataEdit_codigo, data)
      .subscribe({
        next: (datav) => {
          this.num_conocimiento_carga = datav;

          console.log('data', datav);
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('Guardado con Exito! 🎉');

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
