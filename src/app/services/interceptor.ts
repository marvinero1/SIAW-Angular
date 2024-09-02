import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from "@angular/common/http";
import {
	Injectable
} from "@angular/core";
import {
	MatSnackBar
} from "@angular/material/snack-bar";
import {
	Observable,
	catchError,
	firstValueFrom,
	throwError
} from "rxjs";
import {
	ApiService
} from "./api.service";
import {
	ToastrService
} from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmacionComponent } from "@modules/dialog-confirmacion/dialog-confirmacion.component";
import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
	providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {

	public err;
	public status;
	public error_code: any;
	public userConn: string;
	public tokken: any = [];
	public refresh: any = [];

	constructor(public _snackBar: MatSnackBar, public api: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService,
		private dialog: MatDialog) {

		this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
		this.tokken = sessionStorage.getItem("token") !== undefined ? JSON.parse(sessionStorage.getItem("token")) : null;
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(err => {
			this.err = err.error;
			this.status = err.status;
			if (this.err && this.err.resp !== undefined && this.err.resp !== null) {
				this.error_code = this.err.resp;
			} else {
				this.error_code = "error devolvio nulo";
			}

			console.log(this.error_code, this.status);

			// CODIGO DE ERROR PARA QUE NO SALGA EL TOAST DE ITEM NO VALIDO EN LA RUTA / inventario / mant / inmatriz / infoItemRes
			// CODIGO DE ERROR PARA QUE NO SALGA EL TOAST DE ITEM NO VALIDO EN LA RUTA transac / veproforma / getempaques

			if (this.error_code === 801 || this.error_code === undefined) {
				console.log("NO TOAST xD");
			} else {
				this.toastr.error(this.err.resp);
			}

			// this.error_code === 801 ? console.log("NO TOAST xD") : this.toastr.error(this.err.resp);
			// this.error_code === undefined ? console.log("NO TOAST xD") : console.log("NO TOAST xD");
			// this.error_code ===  ? console.log("NO TOAST xD") : console.log("NO TOAST xD");

			let cadenaResultado: string = this.error_code.toString();
			switch (cadenaResultado) {
				//CODIGOS DE EXITO
				case "202":
					this._snackBar.open('¡ Guardado con Exito !', '✅', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				//ERRORES EXCEPCIONES LOGIN
				case "201":
					this._snackBar.open('¡ No se encontro los datos proporcionados !', '🤨', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "203":
					this._snackBar.open('¡ Contraseña Erronea !', '😠', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "205":
					this._snackBar.open('¡ Su contraseña ya vencio, registre una nueva !', '🛡️', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					this.api.refrescarContrasenia();
					break;

				case "207":
					this._snackBar.open('¡ Usuario NO ACTIVO, Informe al Dpto. de Sistemas !', '😥', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "209":
					this._snackBar.open('¡ La contraseña  no cumple los requisitos !', '❌', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "211":
					this._snackBar.open('¡ La contraseña no puede ser la misma !', '❌', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "213":
					this._snackBar.open('¡ No se encontro un registro con los datos proporcionados (rol). !', '❌', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "215":
					this._snackBar.open('¡ La Contraseña ah expirado su VENCIMIENTO, favor consulte al DIOS DEL SISTEMA !', '❌', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "701":
					this._snackBar.open('¡ No hay Tipo de Cambio para el dia de Hoy!', '😥', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "713":
					this._snackBar.open('¡ Contraseña Incorrecta !', '❌', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;

				case "715":
					this._snackBar.open('¡ PERSONA YA ESTA EN LA LISTA !', '❌', {
						duration: 3000,
						panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					});
					break;
			}

			// switch (this.status) {
			// 	case 401:
			// 		this.refreshToken();

			// 		this._snackBar.open('¡ USUARIO SIN TOKEN O TOKEN EXPIRADO !', '☠️', {
			// 			duration: 3000,
			// 			panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
			// 		});
			// 		break;
			// }

			switch (this.status) {
				case 500:
					// this._snackBar.open('¡ ERROR 500 EN EL SERVIDOR, FALLA SERVIDOR', '☠️', {
					// 	duration: 3000,
					// 	panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
					// });

					this.spinner.hide();
					break;
			}

			const error = err.error.message || err.statusText;
			console.log(error);

			return throwError(error);
		}))
	}

	refreshToken() {
		const data = {
			user: this.userConn,
			token: this.tokken.token
		};

		console.log(data);

		let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/login/refreshToken/";
		return this.api.createAllWithOutToken("/seg_adm/login/refreshToken/" + this.userConn, data)
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

	openConfirmacionDialog(): Promise<boolean> {
		//btn aceptar
		const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
			width: '450px',
			height: 'auto',
			data: { mensaje_dialog: "TOKEN VENCIDO, ¿ DESEA REFRESCAR TOKEN PARA SEGUIR UTILIZANDO EL SISTEMA ?" },
			disableClose: true,
		});

		return firstValueFrom(dialogRef.afterClosed());
	}

}