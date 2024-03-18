import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { DatePipe } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipocambiovalidacionComponent } from '@components/seguridad/tipocambiovalidacion/tipocambiovalidacion.component';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { AppService } from '@services/app.service';
import { Observable } from 'rxjs';

const BASE_CLASSES = 'bck-azul elevation-4 main-sidebar sidebar-dark-warning';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {

    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;

    public tipo_cambio: boolean;
    public dato_local_storage: any = [];
    public dato_local_session: any = [];
    public tipo_cambio_hoy_dia: any = [];
    public agencia_storage: any;
    public BD_storage: any;
    public session: any;
    public usuario_logueado: any;

    tipo_cambio_dolar: any;
    tipo_cambio_dolar_dolar: any;
    tipo_cambio_dolar_moneda_base: any;

    userConn: any;

    fecha_actual_format: any;
    fecha_actual = new Date();

    constructor(public appService: AppService, private datePipe: DatePipe, private api: ApiService,
        private store: Store<AppState>, public dialog: MatDialog, public _snackBar: MatSnackBar) {

        this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
        let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

        this.obtenerUsuarioLogueado();
        this.getTipoCambioHeader(dataTransform);
        this.getTipoCambioHoyDia();
        this.obtenerAgenciaStorage();
        this.obtenerBDStorage();
    }

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;

        // FECHA ACTUAL EN HEADER
        this.fecha_actual_format = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")
        // FIN FECHA ACTUAL  
        this.loadDataSession();
    }

    loadDataSession() {
        this.usuario_logueado = this.api.dato_local_storage;
        this.session = JSON.parse(this.usuario_logueado);
    }

    obtenerUsuarioLogueado() {
        this.dato_local_storage = localStorage.getItem('usuario_logueado');
        this.dato_local_session = sessionStorage.getItem('usuario_logueado');
    }

    obtenerAgenciaStorage() {
        this.agencia_storage = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
        return this.agencia_storage;
    }

    obtenerBDStorage() {
        this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
        return this.BD_storage;
    }

    getTipoCambioHeader(dataTransform) {
        let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
        return this.api.getAll('/seg_adm/mant/adtipocambio/verificaTipocambioFecha/' + this.userConn + "/" + dataTransform)
            .subscribe({
                next: (datav) => {
                    this.tipo_cambio = datav;
                    console.log("Hay tipo de cambio?: ", this.tipo_cambio);

                    if (this.tipo_cambio == false) {
                        const dialogRef = this.dialog.open(TipocambiovalidacionComponent, {
                            disableClose: true,
                            width: 'auto',
                        })
                    } else {
                        // this._snackBar.open('¡ Hay Tipo de Cambio !', '💲', {
                        //     duration: 3000,
                        //     panelClass: ['coorporativo-snackbar', 'login-snackbar'],
                        // });
                    }
                },
                error: (err: any) => {
                    console.log(err, errorMessage);
                },
                complete: () => { }
            })
    }

    getTipoCambioHoyDia() {
        let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
        let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
        return this.api.getAll('/seg_adm/mant/adtipocambio/getTipocambioFecha/' + this.userConn + "/" + dataTransform)
            .subscribe({
                next: (datav) => {
                    this.tipo_cambio_hoy_dia = datav;
                    console.log("Tipo de Cambio HOY DIA: ", this.tipo_cambio_hoy_dia);

                    this.tipo_cambio_dolar = this.tipo_cambio_hoy_dia.filter((element) => element.moneda === 'US');
                    this.tipo_cambio_dolar_dolar = this.tipo_cambio_dolar[0].factor;
                    this.tipo_cambio_dolar_moneda_base = this.tipo_cambio_dolar[0].monedabase;

                    console.log(this.tipo_cambio_dolar);
                },
                error: (err: any) => {
                    console.log(err, errorMessage);
                },
                complete: () => { }
            })
    }

}

