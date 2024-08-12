import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-usuario-delete',
  templateUrl: './usuario-delete.component.html',
  styleUrls: ['./usuario-delete.component.scss']
})
export class UsuarioDeleteComponent {

  dataform: any = '';
  FormularioDataDelete: FormGroup;
  usuario: any = [];
  usuario_delete: any = [];
  errorMessage;
  userConn: any;

  public ventana = "usuario-delete"
  public detalle = "usuario-detalle";
  public tipo = "transaccion-usuario-PUT";

  constructor(public dialogRef: MatDialogRef<UsuarioDeleteComponent>, private spinner: NgxSpinnerService, public log_module: LogService
    , private _formBuilder: FormBuilder, private api: ApiService, public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public dataUsuarioEliminar: any) {

  }

  ngOnInit(): void {
    this.FormularioDataDelete = this.createForm();
    this.usuario_delete = this.dataUsuarioEliminar.dataUsuarioEliminar;
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      activo: [this.dataform.activo],
      login: [this.dataform.login]
    });
  }

  submitData() {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    let data = this.FormularioDataDelete.value;

    console.log(data);

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adusuario/adusuarioEstado Update";
    return this.api.update('/seg_adm/mant/adusuario/adusuarioEstado/' + this.userConn + "/" + this.usuario_delete.login, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.usuario = datav;
          this.onNoClick();

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 2000);

          this._snackBar.open('Se elimino correctamente!', 'Ok', {
            duration: 3000,
          });
          location.reload();
        },

        error: (err: any) => {
          console.log(this.errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
