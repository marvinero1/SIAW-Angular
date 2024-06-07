import {
  AppState
} from '@/store/state';
import {
  UiState
} from '@/store/ui/state';
import {
  DatePipe
} from '@angular/common';
import {
  Component,
  HostBinding,
  OnInit,
  NgZone
} from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {
  TipocambiovalidacionComponent
} from '@components/seguridad/tipocambiovalidacion/tipocambiovalidacion.component';
import {
  Store
} from '@ngrx/store';
import {
  ApiService
} from '@services/api.service';
import {
  AppService
} from '@services/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

const BASE_CLASSES = 'bck-azul elevation-4 main-sidebar sidebar-dark-warning';
@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  private onlineStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(navigator.onLine);

  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui: Observable<UiState>;
  public user;

  public tipo_cambio: boolean;
  public dato_local_storage: any = [];
  public dato_local_session: any = [];
  public tipo_cambio_hoy_dia: any = [];
  public almacn_parame_usuario: any = [];
  public agencia_storage: any;
  public BD_storage: any;
  public session: any;
  public usuario_logueado: any;
  public statusInternet: boolean = true;

  tipo_cambio_dolar: any;
  tipo_cambio_dolar_dolar: any;
  tipo_cambio_dolar_moneda_base: any;

  userConn: any;
  usuarioLogueado: any;
  fecha_actual_format: any;
  fecha_actual = new Date();

  constructor(public appService: AppService, private datePipe: DatePipe, private api: ApiService,
    private store: Store<AppState>, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public _snackBar: MatSnackBar, private zone: NgZone) {

    this.agencia_storage = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    if (this.agencia_storage === 'Loc') {
      this.agencia_storage = 'Maq. Rodri'
    }

    this.verificarInternet();
    this.getTipoCambioHeader(dataTransform);
    this.getTipoCambioHoyDia();
    this.getAlmacenParamUsuario();
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

  private updateOnlineStatus(status: boolean) {
    this.zone.run(() => {
      this.onlineStatus.next(status);
    });
  }

  get isOnline(): Observable<boolean> {
    return this.onlineStatus.asObservable();
  }

  loadDataSession() {
    this.usuario_logueado = this.api.dato_local_storage;
    this.session = JSON.parse(this.usuario_logueado);
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
              panelClass: ['coorporativo-snackbar', 'login-snackbar'],
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

  getAlmacenParamUsuario() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
    return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          console.log('data', this.almacn_parame_usuario);

          //this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          //this.cod_descuento_modal_codigo = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  verificarInternet() {
    this.spinner.show();

    if (navigator.onLine) {
      this.statusInternet = true;
      console.log('Tienes conexión a Internet');
    } else {
      this.statusInternet = false;
      console.log('No tienes conexión a Internet');
    }

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  ip_vpn: any;
  verificarIP_VPN() {
    return this.api.getSimple("https://api.ipify.org?format=json").subscribe({
      next: (datav) => {
        this.ip_vpn = datav.ip;
        console.log(this.ip_vpn);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {

      }
    });
  }
}