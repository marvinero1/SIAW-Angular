import { Component, OnInit, OnDestroy, Renderer2, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransformacionDigitalComponent } from '@modules/transformacion-digital/transformacion-digital.component';
import { LogService } from '@services/log-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box';

  public isAuthLoading = false;
  public isGoogleLoading = false;
  public isFacebookLoading = false;

  public ip_servidores = true;
  public bd_datos = true;
  public login_box = true;
  public existe_usuario = false;
  public usuario_login: any;
  public contrasenia: any;

  public dato_local_storage;
  public dato_local_session;

  public fecha_hoy_dia = Date.now();
  public fecha_actual = new Date();
  public anio_actual = new Date();

  loginForm: FormGroup;
  logData: FormGroup;
  serverForm: FormGroup;
  BDForm: FormGroup;
  BDForm1: FormGroup;

  public logs: any = [];
  public agencias: any = [];
  public connDBs: any = [];
  public IP_api: any = [];
  public ip: any = [];

  public agencia = '';
  public login_form_complete_with_status: any = [];
  public token;
  public anio;

  public userConn: any;
  public ventana = "login"
  public detalle = "login-user";
  public tipo = "ingreso-login-POST";

  code_error: number;

  @ViewChild('usernameInput') usernameInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor(
    private renderer: Renderer2, private _formBuilder: FormBuilder, private router: Router,
    private toastr: ToastrService, private api: ApiService, public log_module: LogService,
    private spinner: NgxSpinnerService, public _snackBar: MatSnackBar,private messageService: MessageService,
    public dialog: MatDialog) {

    this.BDForm = this.createFormBD();
    this.BDForm1 = this.createFormBD1();

    this.serverForm = this.createFormServer();
  }

  ngOnInit() {
    this.anio = this.anio_actual.getFullYear();
  }

  ngOnDestroy() {
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'login-page'
    );
  }

  createFormServer(): FormGroup {
    return this._formBuilder.group({
      agencia: new UntypedFormControl(null, [Validators.required])
    });
  }

  createFormBD(): FormGroup {
    return this._formBuilder.group({
      login: new UntypedFormControl(null, [Validators.required]),
      password: new UntypedFormControl(null, [Validators.required])
    });
  }

  createFormBD1(): FormGroup {
    return this._formBuilder.group({
      bd: new UntypedFormControl(null, [Validators.required])
    });
  }

  async loginAgencias() {
    // let data = this.loginForm.value;
    let dataForm = this.BDForm.value; // usuarioJSON
    let dataFormAgencia = this.serverForm.value; //agenciaJson
    let login = dataForm.login; //usuario
    let password = dataForm.password; //usuario
    let agencia = dataFormAgencia.agencia; //agencia

    let bd = this.BDForm1.value; //base de datos seleccionada
    let select_bd = bd.bd;
    let userConn = login + "_" + agencia + "_" + select_bd;
    this.userConn = login + "_" + agencia + "_" + select_bd;

    console.log("🚀 ~ LoginComponent ~ loginByAuth ~ login:", login, agencia, select_bd, bd, dataForm)


    // 1) Revisa Agencia Connection
    this.conectarAgencia(agencia); //AGENCIAS LISTA
    // Una vez q se elige agencia, pasamos los datos del usuario
    // if (this.BDForm.valid && login != null && password != null) {
    //   try {
    //     console.log("json completo", login, this.BDForm.valid);
    //     // aca se hace el login
    //     // this.guardarStorageUsuario(login);
    //    this.conectarBD(select_bd);
    //     // this.guardarStorageBD(bd);
    //     // this.guardarStorageuserConn(userConn);
    //     // this.login(userConn, dataForm); //login
    //     this.isAuthLoading = true;

    //     // await this.appService.loginByAuth(this.loginForm.value);
    //     //this.isAuthLoading = false;
    //   } catch (error) {
    //     console.log("No se pudo hacer login");

    //     this._snackBar.open('¡ No se pudo Iniciar Sesion, verifique su conexion !', '🤖', {
    //       duration: 1000,
    //       panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
    //     });
    //   }
    // }

    if (agencia == null) {
      this._snackBar.open('¡ Agencia no encontrada o sin conexion !', '📡', {
        duration: 1000,
        panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
      });
    }
  }

  conectarAgencia(agencia) {

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /Connection/connServers/";
    return this.api.getAll("/Connection/connServers/" + agencia)
      .subscribe({
        next: (agencias) => {
          this.agencias = agencias;
          console.log(agencias);
          if (agencias) {
            console.log("Lista de AG del Servidor Seleccionado: ", agencia);
            // sessionStorage.setItem('agencia_logueado', JSON.stringify(agencia));
            this.ip_servidores = false;
            this.bd_datos = false;
            return agencias;
          }
        },
        error: (err) => {
          console.log(err, errorMessage);
          this._snackBar.open('¡ La Agencia NO ESTA DISPONIBLE !', '⚠️', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
        },
        complete: () => { }
      })
  }

  conectarBD() {
    this.spinner.show();

    let dataFormAgencia = this.serverForm.value; //agenciaForm
    let agencia = dataFormAgencia.agencia; //agencia

    let dataFormUsuarioPassword = this.BDForm.value; // usuarioPasswordJSON    
    let usuario = dataFormUsuarioPassword.login; //usuario
    let password = dataFormUsuarioPassword.password;

    let base_dato_seleccionada = this.BDForm1.value.bd
    console.warn("Agencia Seleccionada:", agencia,
      "BaseDatos:", base_dato_seleccionada,
      "Usuario: ", usuario,
      "Form Login: ", dataFormUsuarioPassword,
    );
    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /Connection/connDBS/";
    return this.api.getAll("/Connection/connDBS/" + base_dato_seleccionada)
      .subscribe({
        next: (connDBs) => {
          console.log("Conexion exitosa: ", this.connDBs);
          this.connDBs = connDBs;
          if (connDBs.valido) {
            //let cadena_encriptada = connDBs.conDatDesc
            this.login2(usuario, password, connDBs.conDatDesc);
          };
        },
        error: (err) => {
          console.log(err, errorMessage);
          this._snackBar.open('¡ La Agencia NO ESTA DISPONIBLE !', '⚠️', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
          setTimeout(() => {
            this.spinner.hide();
          }, 100);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 100);
        }
      });
  }

  login2(usuario, pass, cod_encript) {
    // DECLARAMOS LAS CONSTANTES QUE UTILIZAREMOS PARA EL LOGIN
    let dataFormAgencia = this.serverForm.value; //agenciaForm
    let agencia = dataFormAgencia.agencia; //agencia
    // let dataFormUsuarioPassword = this.BDForm.value; // usuarioPasswordJSON    
    // let usuario = dataFormUsuarioPassword.login; //usuario
    let base_dato_seleccionada = this.BDForm1.value.bd
    // console.warn("Agencia Seleccionada:", agencia,
    //             "BaseDatos:", base_dato_seleccionada,
    //             "Usuario: ", usuario,
    //             "Form Login: ", dataFormUsuarioPassword,
    // );
    let userConn = usuario + "_" + agencia + "_" + base_dato_seleccionada;
    let arr_authenticate = {
      login: usuario,
      password: pass,
      conDatDesc: cod_encript
    };

    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /seg_adm/login/authenticate/";
    return this.api.login("/seg_adm/login/authenticate/" + userConn, arr_authenticate)
      .subscribe({
        next: (datav) => {
          this.login_form_complete_with_status = datav;
          console.log(datav);

          // controlar el codigo que devuelve el BE con el Interceptor
          // 200 Todos los datos correctos
          // 201 No se encontro los datos proporcionados
          // 203 Contrasenia Erronea
          // 207 Usuario no activo
          // 205 Contrasenia Vencida
          if (datav != null || datav != undefined) {
            // UNA VEZ QUE SE CARGUE EL TOKEN SIGNIFICA LOGIN EXITOSO PROCEDEMOS A
            // GRABAR NUESTRA INFO NECESARIA EN EL SESSION STORAGE
            this.guardarStorageUsuario(usuario);
            this.guardarStorageBD(base_dato_seleccionada);
            this.guardarStorageuserConn(userConn);
            this.guardarToken(datav);
                    
            this.isAuthLoading = false;
            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
            // this.getParametrosIniciales(userConn, dataForm.login);

            this.getVerificaraDondeEstaConectadoUsuario(userConn);
            this.getParametrosIniciales(userConn, usuario);
            this._snackBar.open('¡ Bienvenido ' + usuario + ' al SIAW !', '🎉', {
              duration: 3500,
              panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
            }),

            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'BIENVENIDO! 🎉' })
            console.log("DATOS CORRECTOS, BENVENUTO !!");

            this.router.navigate(['/']);
          } else { 
            this.messageService.add({
              severity: 'error', summary: 'Error', detail: 'NO SE PUDO OBTENER EL TOKEN AUTHENTICATE FALLO =(' })
          }
        },
        error: (err) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 100);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 100);
        }
      })
  }

  getParametrosIniciales(userConn, usuario) {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/principal/getParamIniciales/";
    return this.api.getAll('/principal/getParamIniciales/' + userConn + "/" + usuario)
      .subscribe({
        next: (datav) => {
          //ACA SOLO GUARDA EL COD DE LA AGENCIA LOGUEADA
          console.log("🚀 ~ LoginComponent ~ getParametrosIniciales ~ datav:", datav)
          this.guardarStorageAgenciaLogueada(datav.codAlmacenUsr);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getVerificaraDondeEstaConectadoUsuario(userConn) {
    this.spinner.show();
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/oper/infoConexion/getConnectionInfo/";
    return this.api.getAll("/seg_adm/oper/infoConexion/getConnectionInfo/" + userConn)
      .subscribe({
        next: (datav) => {
          console.log("Usuario BD getConnectionInfo: ", datav.database);
          
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this._snackBar.open('¡ EL USUARIO BD NO ESTA DISPONIBLE !', '⚠️', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          })
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }















  atras() {
    this.ip_servidores = true;
    this.bd_datos = true;
  }

  guardarToken(token) {
    // localStorage.setItem('token', JSON.stringify(token));
    sessionStorage.setItem('token', JSON.stringify(token));
    sessionStorage.setItem('contrasenia', JSON.stringify(this.contrasenia));
  }

  guardarStorageUsuario(usuario) {
    // localStorage.setItem('usuario_logueado', JSON.stringify(usuario));
    sessionStorage.setItem('usuario_logueado', JSON.stringify(usuario));
  }

  guardarStorageBD(data) {
    // localStorage.setItem('bd_logueado', JSON.stringify(data));
    sessionStorage.setItem('bd_logueado', JSON.stringify(data));
  }

  guardarStorageuserConn(data) {
    // localStorage.setItem('user_conn', JSON.stringify(data));
    sessionStorage.setItem('user_conn', JSON.stringify(data));
  }

  guardarStorageAgenciaLogueada(agencia) { 
    sessionStorage.setItem('agencia_logueado', JSON.stringify(agencia));
  }

  // obtenerStorage() {
  //   this.dato_local_storage = localStorage.getItem('usuario_logueado');
  //   this.dato_local_session = sessionStorage.getItem('usuario_logueado');
  //   console.log(this.dato_local_storage, JSON.parse(this.dato_local_storage));
  // }

  transformacionTecnologica() {
    this.dialog.open(TransformacionDigitalComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  // login(userConn, data) {
  //   let event: Event
  //   let dataFormAgencia = this.serverForm.value; //agenciaForm
  //   let dataForm = this.BDForm.value; // usuarioJSON
  //   let agencia = dataFormAgencia.agencia; //agencia
  //   let login = dataForm.login; //usuario
  //   console.log(agencia, data, this.serverForm.value, this.BDForm.value, dataForm.login);
    

  //   // this.spinner.show();
  //   // let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /seg_adm/login/authenticate/";
  //   // return this.api.login("/seg_adm/login/authenticate/" + userConn, data)
  //   //   .subscribe({
  //   //     next: (datav) => {
  //   //       this.login_form_complete_with_status = datav;
  //   //       console.log(datav);

  //   //       // controlar el codigo que devuelve el BE con el Interceptor
  //   //       // 200 Todos los datos correctos
  //   //       // 201 No se encontro los datos proporcionados
  //   //       // 203 Contrasenia Erronea
  //   //       // 207 Usuario no activo
  //   //       // 205 Contrasenia Vencida
  //   //       if (datav != null) {
  //   //         //aca se guarda el TOKEN
  //   //         this.guardarToken(datav);
  //   //         this.isAuthLoading = false;

  //   //         this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");            
  //   //         this.getParametrosIniciales(userConn, dataForm.login);
  //   //         this.obtenerBDUsuario(login, agencia);

  //   //         this._snackBar.open('¡ Bienvenido al SIAW !', '🎉', {
  //   //           duration: 2200,
  //   //           panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
  //   //         }),

  //   //         setTimeout(() => {
  //   //           this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'BIENVENIDO! 🎉' })
  //   //         }, 0); // Ejecuta el método después de que Angular complete la carga.

  //   //         console.log("DATOS CORRECTOS");

  //   //         this.router.navigate(['/']);
  //   //         setTimeout(() => {
  //   //           this.spinner.hide();
  //   //         }, 10);
  //   //       }
  //   //     },

  //   //     error: (err) => {
  //   //       console.log(err, errorMessage);
  //   //       setTimeout(() => {
  //   //         this.spinner.hide();
  //   //       }, 10);
  //   //     },
  //   //     complete: () => {
  //   //       setTimeout(() => {
  //   //         this.spinner.hide();
  //   //       }, 10);
  //   //     }
  //   //   })
  // }


  // verificarUsuario() {
  //   //primero verificamos que el usuario que se puso en el input exista si no ya no entra 
  //   let dataForm = this.loginForm.value;
  //   let usuario = dataForm.usuario;

  //   let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/adusuario + login_usuario";
  //   return this.api.getById('/seg_adm/mant/adusuario/' + usuario)
  //     .subscribe({
  //       next: (datav) => {
  //         this.usuario_login = datav;
  //         console.log(this.usuario_login);

  //         this.login_box = true;
  //         this.ip_servidores = false;

  //         this._snackBar.open('¡ El usuario existe !', 'Ok', {
  //           duration: 2000,
  //           panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
  //         });
  //         return this.existe_usuario = true;
  //       },

  //       error: (err: any) => {
  //         console.log(err, errorMessage);

  //         this._snackBar.open('¡ No se encontro el usuario !', '=(', {
  //           duration: 2500,
  //           panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
  //         });
  //         return this.existe_usuario = false;
  //       },
  //       complete: () => {
  //         return this.existe_usuario
  //       }
  //     })
  // }
}