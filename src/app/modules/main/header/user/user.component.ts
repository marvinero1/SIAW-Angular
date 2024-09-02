import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public user;
  public session: any;
  public userConn: any;
  public token: any = [];
  public usuarioLogueado: any;
  public agencia_logueado: any;
  public BD_storage: any;
  private password: any;

  rol: any = [];
  refresh: any = [];

  constructor(private api: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public _snackBar: MatSnackBar) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.token = sessionStorage.getItem("token") !== undefined ? JSON.parse(sessionStorage.getItem("token")) : null;
    this.password = sessionStorage.getItem("contrasenia") !== undefined ? JSON.parse(sessionStorage.getItem("contrasenia")) : null;
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

        complete: () => {

        }
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

  refreshLogin() {
    this.spinner.show();

    let data = {
      login: this.usuarioLogueado,
      password: this.password
    }

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /seg_adm/login/authenticate/";
    return this.api.login("/seg_adm/login/authenticate/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ UserComponent ~ refreshlogin ~ datav:", datav)
          // this.login_form_complete_with_status = datav;

          // controlar el codigo que devuelve el BE con el Interceptor
          // 200 Todos los datos correctos
          // 201 No se encontro los datos proporcionados
          // 203 Contrasenia Erronea
          // 207 Usuario no activo
          // 205 Contrasenia Vencida
          if (datav != null) {
            //aca se guarda el TOKEN
            this.toastr.info('LOGIN REFRESCADO ♻️');

            this._snackBar.open('¡ LOGIN REFRESCADO !', '♻️', {
              duration: 2500,
              panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
            }),

              // event.preventDefault();
              setTimeout(() => {
                this.spinner.hide();
              }, 1000);
          }
        },

        error: (err) => {
          console.log(err, errorMessage);
          //aca se guarda el TOKEN
          this.toastr.error('FALLO EN RECARGO TOKEN ❌');

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      })
  }

  refreshToken() {

    const data = {
      user: this.userConn,
      token: this.token,
    };

    console.log("Refresh Token: ", data, this.token);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion Ruta:- /seg_adm/login/refreshToken/";
    return this.api.createAllWithOutToken("/seg_adm/login/refreshToken/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.refresh = datav;
          this.toastr.info("Token Refresh! 🚀");

          sessionStorage.setItem('token', JSON.stringify(this.refresh.accessToken));
          console.log('Token Refresh! 🚀', datav);
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
}