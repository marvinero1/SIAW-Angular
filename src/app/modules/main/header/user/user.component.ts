import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public user;
  public session: any;
  public userConn: any;
  public token: any;
  public usuarioLogueado: any;
  public agencia_logueado: any;
  public BD_storage: any;

  rol: any = [];

  constructor(private api: ApiService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.token = sessionStorage.getItem("token") !== undefined ? JSON.parse(sessionStorage.getItem("token")) : null;
  }

  ngOnInit(): void {
    this.getRolUser();
  }

  logout() {
    this.api.create("/seg_adm/login/logout/" + this.userConn + "/" + this.token, [])
      .subscribe({
        next: (datav) => {
          console.log(datav);
        },

        error: (err) => {
          console.error(err);
        },

        complete: () => { }
      })

    this.api.logout();
  }

  getRolUser() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/mant/adusuario/";
    return this.api.getAll('/seg_adm/mant/adusuario/' + this.userConn + "/" + this.usuarioLogueado)
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
}