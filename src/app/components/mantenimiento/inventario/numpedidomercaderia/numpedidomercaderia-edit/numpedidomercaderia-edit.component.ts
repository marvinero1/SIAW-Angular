import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-numpedidomercaderia-edit',
  templateUrl: './numpedidomercaderia-edit.component.html',
  styleUrls: ['./numpedidomercaderia-edit.component.scss']
})
export class NumpedidomercaderiaEditComponent implements OnInit {

  public numntipopedmercaderia: any = [];

  FormularioDataEdit: FormGroup;
  dataform: any = '';
  userConn: any;
  usuarioLogueado: any;
  num_pedidos_mercaderia = [];

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "nts-movpedmerca-edit"
  public detalle = "nts-movpedmerca";
  public tipo = "nts-movpedmerca-UPDATE";

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<NumpedidomercaderiaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public dataMercaderiaEdit: any, private api: ApiService, private datePipe: DatePipe,
    public _snackBar: MatSnackBar, public log_module: LogService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.numntipopedmercaderia = this.dataMercaderiaEdit.dataMercaderiaEdit;
    console.log(this.dataMercaderiaEdit.dataMercaderiaEdit.id);
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataMercaderiaEdit.dataMercaderiaEdit.id],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    let data = this.FormularioDataEdit.value;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /inventario/mant/intipopedido POST";
    return this.api.update('/inventario/mant/intipopedido/' + this.userConn + "/" + this.dataMercaderiaEdit.dataMercaderiaEdit.id, data)
      .subscribe({
        next: (datav) => {
          this.num_pedidos_mercaderia = datav;

          this._snackBar.open('Se ha editado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });
          location.reload();
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
