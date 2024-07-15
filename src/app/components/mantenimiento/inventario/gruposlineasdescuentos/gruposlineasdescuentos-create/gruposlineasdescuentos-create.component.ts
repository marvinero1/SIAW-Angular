import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-gruposlineasdescuentos-create',
  templateUrl: './gruposlineasdescuentos-create.component.html',
  styleUrls: ['./gruposlineasdescuentos-create.component.scss']
})
export class GruposlineasdescuentosCreateComponent implements OnInit {

  FormularioData: FormGroup;
  dataform: any = '';
  data_unidad_medida = [];
  userConn: any;
  usuarioLogueado: any;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "grupo-lindesct-create"
  public detalle = "grupo-lindesct";
  public tipo = "grupo-lindesct-POST";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<GruposlineasdescuentosCreateComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService, public _snackBar: MatSnackBar) {
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
      codigo: [this.dataform.Codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.Descripcion, Validators.compose([Validators.required])],
      rango_monto: [this.dataform.rango_monto],
      rango_peso: [this.dataform.rango_peso],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      Usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adunidad POST";
    return this.api.create("/inventario/mant/ingrupo/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.data_unidad_medida = datav;

          console.log('data', datav);
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
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
