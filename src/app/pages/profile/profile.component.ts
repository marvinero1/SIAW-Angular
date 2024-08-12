import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ModificarParametroAComponent } from './modificar-parametro-A/modificar-parametro-A.component';
import { CambiarPasswordComponent } from '@modules/cambiar-password/cambiar-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  public user;
  public session: any;
  public userConn: any;
  public usuario_logueado: any;
  rol: any = [];

  constructor(private api: ApiService, public dialog: MatDialog) {

  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.session = JSON.parse(this.usuario_logueado);

    this.getRolUser();
  }

  getRolUser() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/logs/selog/getselogfecha/  --Vista LOG/Angular";
    return this.api.getAll('/seg_adm/mant/adusuario/' + this.userConn + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.rol = datav.codrol;
          console.log(this.rol);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  cambiarContrasenia() {
    this.dialog.open(CambiarPasswordComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  configuracionA() {
    this.dialog.open(ModificarParametroAComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
}
