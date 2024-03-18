import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, catchError, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";

@Injectable({providedIn:'root'})
export class Interceptor implements HttpInterceptor {
    
    public err;
    public status;
    public error_code: number;
    public userConn: string;
    public tokken: any = [];
    public refresh: any = [];

    constructor(public _snackBar: MatSnackBar, public api: ApiService, private toastr: ToastrService) {
        this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
        this.tokken = localStorage.getItem("token") !== undefined ? JSON.parse(localStorage.getItem("token")) : null;
    
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(request).pipe(catchError(err => {
            this.err = err.error;
            this.status = err.status;
            this.error_code = this.err.resp

            console.log(this.error_code);
            
            this.toastr.warning(this.err.resp);
            let cadenaResultado: string = this.error_code.toString();
            
            switch(cadenaResultado){
                //CODIGOS DE EXITO
                case "202":
                    this._snackBar.open('¡ Guardado con Exito !', '✅', {
                        duration: 2300,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
                
                //ERRORES EXCEPCIONES LOGIN
                case "201":
                    this._snackBar.open('¡ No se encontro los datos proporcionados !', '🤨', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;

                case "203":                    
                    this._snackBar.open('¡ Contraseña Erronea !', '😠', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;

                case "205":
                    this._snackBar.open('¡ Su contraseña ya vencio, registre una nueva !', '🛡️', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    this.api.refrescarContrasenia();
                    break;

                case "207":
                    this._snackBar.open('¡ Usuario NO ACTIVO, Informe al Dpto. de Sistemas !', '😥', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
                
                case "209":
                    this._snackBar.open('¡ La contraseña  no cumple los requisitos !', '❌', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
                
                case "211":
                    this._snackBar.open('¡ La contraseña no puede ser la misma !', '❌', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
            
                case "213":
                    this._snackBar.open('¡ No se encontro un registro con los datos proporcionados (rol). !', '❌', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
                
                case "215":
                    this._snackBar.open('¡ La Contraseña ah expirado su VENCIMIENTO, favor consulte al DIOS DEL SISTEMA !', '❌', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;

                case "701":
                    this._snackBar.open('¡ No hay Tipo de Cambio para el dia de Hoy!', '😥', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
                
                case "713":
                    this._snackBar.open('¡ Contraseña Incorrecta !', '❌', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
                
                case "715":
                    this._snackBar.open('¡ PERSONA YA ESTA EN LA LISTA !', '❌', {
                        duration: 6000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
            }

            switch(this.status){
                case 401:
                    this.refreshToken();

                    this._snackBar.open('¡ Usuario SIN AUTORIZACION, Falta de Token !', '🚫', {
                        duration: 3000,
                        panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                    });
                    break;
            }

            // switch(this.status){
            //     case 404:
            //         this._snackBar.open('¡ Usuario SIN AUTORIZACION, Falta de Token !', '🚫', {
            //             duration: 3000,
            //             panelClass: ['coorporativo-snackbar', 'login-snackbar'],
            //         });
            //         break;
            // }

            const error = err.error.message || err.statusText;
            console.log(error);
            
            return throwError(error);
        }))
    }

    refreshToken() {
        const data = { user: this.userConn, token: this.tokken.token };
        
        console.log(data);

        let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /seg_adm/login/refreshToken/";
        return this.api.create("/seg_adm/login/refreshToken/"+this.userConn, data)
        .subscribe({
            next: (datav) => {
            this.refresh = datav;
                console.log('data', datav);
            },
        
            error: (err) => { 
            console.log(err, errorMessage);
            },
            complete: () => { }
        })
    }
}
