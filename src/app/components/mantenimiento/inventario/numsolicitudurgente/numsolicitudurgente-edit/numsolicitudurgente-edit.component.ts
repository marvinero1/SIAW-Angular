import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-numsolicitudurgente-edit',
  templateUrl: './numsolicitudurgente-edit.component.html',
  styleUrls: ['./numsolicitudurgente-edit.component.scss']
})
export class NumsolicitudurgenteEditComponent implements OnInit {

  FormularioData: FormGroup;
  public unidadnegocio = [];
  dataform: any = '';
  num_pedidos_mercaderia = [];
  dataSolUrgenteEdit1: any = [];
  dataSolUrgenteEditcodigo: any;
  usuarioLogueado: any;
  userConn: any;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "nts-movurgentes-create"
  public detalle = "nts-movurgentes";
  public tipo = "nts-movurgentes-POST";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<NumsolicitudurgenteEditComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService, public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dataSolUrgenteEdit: any) {

    this.dataSolUrgenteEdit1 = dataSolUrgenteEdit.dataSolUrgenteEdit;
    this.dataSolUrgenteEditcodigo = dataSolUrgenteEdit.dataSolUrgenteEdit.id;

    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataSolUrgenteEditcodigo],
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

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  /inventario/mant/intiposolurgente POST";
    return this.api.update("/inventario/mant/intiposolurgente/" + this.userConn + "/" + this.dataSolUrgenteEditcodigo, data)
      .subscribe({
        next: (datav) => {
          this.num_pedidos_mercaderia = datav;

          console.log('data', datav);
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
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
