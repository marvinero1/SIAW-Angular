import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from '@modules/login/login.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.scss']
})
export class CambiarPasswordComponent implements OnInit {

  nombre_ventana: string = "prgcambpass.vb";

  FormularioDataRefrescarPassword: FormGroup;
  dataform: any = '';
  login_modal_password_get: any = [];
  public usuario_logueado: any;
  password: any;
  usuarioLogueado: any = [];
  useConn: any = [];

  public ventana = "refresh-pasword-update"
  public detalle = "refresh-pasword-update";
  public tipo = "transaccion-refresh-pasword-UPDATE";

  constructor(private _formBuilder: FormBuilder, private api: ApiService, public _snackBar: MatSnackBar, private toastr: ToastrService,
    public dialogRef: MatDialogRef<CambiarPasswordComponent>,
    public login: LoginComponent, public log_module: LogService, @Inject(MAT_DIALOG_DATA) public login_modal_password: any) {

    this.FormularioDataRefrescarPassword = this.createForm();
  }

  ngOnInit() {
    this.useConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.login_modal_password_get = this.login_modal_password.login_modal_password;
    console.log(this.login_modal_password_get);
    this.toastr.error('Actualizar Contraseña');
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      passwordAnt: [this.dataform.codigo, Validators.compose([Validators.required])],
      passwordNew: [this.dataform.descripcion, Validators.compose([Validators.required])],
    });
  }

  submitData() {
    let data = this.FormularioDataRefrescarPassword.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-  /seg_adm/login/changePassword/";
    return this.api.createAllWithOutToken("/seg_adm/login/changePassword/" + this.usuarioLogueado, data)
      .subscribe({
        next: (datav) => {
          this.password = datav;
          console.log(this.password);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.onNoClick();
          this.toastr.success('! Se Actualizo Correctamente !');
          this._snackBar.open('Se Actualizo Correctamente la Contraseña!', '🙂', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE ACTUALIZO LA CONTRASEÑA !');
        },
        complete: () => { }
      })
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
