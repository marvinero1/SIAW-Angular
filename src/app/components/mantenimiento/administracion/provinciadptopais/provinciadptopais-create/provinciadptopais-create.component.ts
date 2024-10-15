import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provinciadptopais-create',
  templateUrl: './provinciadptopais-create.component.html',
  styleUrls: ['./provinciadptopais-create.component.scss']
})
export class ProvinciadptopaisCreateComponent implements OnInit {

  public FormularioData: FormGroup;
  public fecha_actual = new Date();
  public hora_actual = new Date();
  public dataform: any = '';
  public dpto: any = [];
  userConn: string;
  usuario_logueado;

  public ventana = "provdpto-create"
  public detalle = "provdpto-detalle";
  public tipo = "transaccion-provdpto-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
    private api: ApiService, public dialogRef: MatDialogRef<ProvinciadptopaisCreateComponent>, public log_module: LogService,
    public _snackBar: MatSnackBar, private toastr: ToastrService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      nombre: [this.dataform.nombre, Validators.compose([Validators.required])],
      coddepto: [this.dataform.coddepto, Validators.compose([Validators.required])],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuario_logueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /adprovincia";
    return this.api.create("/seg_adm/mant/adprovincia/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.dpto = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

          this.toastr.success('!GUARDADO EXITOSAMENTE!');

          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
