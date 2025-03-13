import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { TipocambiovalidacionComponent } from '../tipocambiovalidacion.component';
import { LogService } from '@services/log-service.service';
@Component({
  selector: 'app-tipocambiovalidacion-create',
  templateUrl: './tipocambiovalidacion-create.component.html',
  styleUrls: ['./tipocambiovalidacion-create.component.scss']
})

export class TipocambiovalidacionCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  dataform: any = '';
  moneda: any;
  moneda_save = [];
  tipo_cambio = [];
  tamanio: any;
  userConn: any;

  public ventana = "tipocambio-create"
  public detalle = "tipocambio-detalle";
  public tipo = "transaccion-tipocambio-POST";
  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, public dialogRef: MatDialogRef<TipocambiovalidacionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public dataMoneda: any, private api: ApiService, public _snackBar: MatSnackBar, public log_module: LogService,
    public dialog: MatDialog, ) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

  }

  ngOnInit() {
    this.FormularioData = this.createForm();
    this.moneda = this.dataMoneda.dataMoneda;
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      monedabase: ["BS"],
      factor: [this.dataform.factor, Validators.compose([Validators.required])],
      moneda: [this.dataMoneda.dataMoneda?.codigo],
      fecha: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: ["DPD200"],
      codalmacen: ["310"],
    });
  }

  submitData() {
    let data = this.FormularioData.value;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /serol";
    return this.api.create("/seg_adm/mant/adtipocambio/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.moneda_save = datav;
          location.reload();

          this._snackBar.open('Se ha guardado correctamente el tipo de cambio!', 'Ok', {
            duration: 3000,
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  reabrirModal() {
    this.dialog.open(TipocambiovalidacionCreateComponent, {
      width: '350px',
      height: 'auto',
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
