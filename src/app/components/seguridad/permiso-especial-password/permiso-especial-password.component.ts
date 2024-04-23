import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-permiso-especial-password',
  templateUrl: './permiso-especial-password.component.html',
  styleUrls: ['./permiso-especial-password.component.scss']
})
export class PermisoEspecialPasswordComponent implements OnInit {
  //ESTA VENTANA NO SE USA PARA GENERAR CONTRASENIAS

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.getaAutorizacion();
  };

  contrasenia: string;
  userConn: any;
  precio_get: any = [];
  data_autorizacionA: any = [];
  data_autorizacionB: any = [];
  servicio_id: any = [];
  text_servicio: any = [];
  autorizacion_recibida: any = [];
  BD_storage: any = [];


  constructor(private api: ApiService, public dialog: MatDialog, public dialogRef: MatDialogRef<PermisoEspecialPasswordComponent>,
    public log_module: LogService, private toastr: ToastrService, public _snackBar: MatSnackBar, private clipboard: Clipboard,
    @Inject(MAT_DIALOG_DATA) public dataA: any, @Inject(MAT_DIALOG_DATA) public dataB: any,
    @Inject(MAT_DIALOG_DATA) public permiso_id: any,
    @Inject(MAT_DIALOG_DATA) public permiso_text: any) {

  }

  ngOnInit() {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.data_autorizacionA = this.dataA.dataA;
    this.data_autorizacionB = this.dataB.dataB;
    this.servicio_id = this.permiso_id.permiso_id;
    this.text_servicio = this.permiso_text.permiso_text;


    console.log(this.data_autorizacionA, this.data_autorizacionB, this.servicio_id, this.text_servicio);
  }

  getaAutorizacion() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/seg_adm/oper/prgcontrasena/passwordAut/"
    return this.api.getAll('/seg_adm/oper/prgcontrasena/passwordAut/' + this.userConn + "/" + this.BD_storage.bd + "/" + this.servicio_id + "/" + this.contrasenia)
      .subscribe({
        next: (datav) => {
          this.autorizacion_recibida = datav;
          console.log(this.autorizacion_recibida);

          if (datav = 712) {
            this._snackBar.open('¡ Permiso Autorizado !' + this.autorizacion_recibida.resp, '☑️', {
              duration: 2000,
              panelClass: ['coorporativo-snackbar', 'login-snackbar'],
            });
            this.toastr.success('!AUTORIZADO!');

            this.closeEventTrue();
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  copyToClipboard(): void {
    let copia = "Codigo Servicio: " + this.servicio_id + "Dato A: " + this.data_autorizacionA + "Dato B: " + this.data_autorizacionB
    // Se copia el texto del input al portapapeles
    this.clipboard.copy(copia);

    // Se muestra un snackbar durante 2 segundos en la parte inferior
    this._snackBar.open('¡ Texto Copiado !', '📑', {
      duration: 2000,
      panelClass: ['coorporativo-snackbar', 'login-snackbar'],
    });
  }

  closeEventTrue() {
    this.dialogRef.close(true);
  }

  closeEventFalse() {
    this.dialogRef.close(false);
  }
}
