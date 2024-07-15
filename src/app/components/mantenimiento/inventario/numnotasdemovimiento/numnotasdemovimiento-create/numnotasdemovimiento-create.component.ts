import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-numnotasdemovimiento-create',
  templateUrl: './numnotasdemovimiento-create.component.html',
  styleUrls: ['./numnotasdemovimiento-create.component.scss']
})
export class NumnotasdemovimientoCreateComponent implements OnInit {

  FormularioData: FormGroup;
  public unidadnegocio = [];
  dataform: any = '';
  datanum_notas_movi = [];
  userConn: any;
  usuarioLogueado: any;


  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana = "nts-movimiento-create"
  public detalle = "nts-movimiento";
  public tipo = "nts-movimiento-POST";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<NumnotasdemovimientoCreateComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService, public _snackBar: MatSnackBar) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();

  }

  ngOnInit() {
    this.getAllUnidadNegocio();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual],
      codunidad: [this.dataform.codunidad],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adunidad POST";
    return this.api.create("/inventario/mant/intipomovimiento/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.datanum_notas_movi = datav;

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

  getAllUnidadNegocio() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adempresa/";
    return this.api.getAll('/seg_adm/mant/adempresa/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.unidadnegocio = datav;
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
