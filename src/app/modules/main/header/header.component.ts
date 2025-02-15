import { AppState } from '@/store/state';
import { ToggleControlSidebar, ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ApiService } from '@services/api.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DatePipe, Location } from '@angular/common';
import { LogService } from '@services/log-service.service';
const BASE_CLASSES = 'main-header navbar navbar-expand navbar-warning';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui: Observable<UiState>;
  public searchForm: UntypedFormGroup;

  public tipo_cambio_dolar: any;
  public fecha_actual = new Date();
  public log_ruta = [];
  private log: any = [];

  isNavbarVisible = true;

  userConn: any;
  data: any = "";
  usuarioLogueado: any;
  private intervalId: any; // Variable para almacenar el ID del intervalo

  public ventana = "login"
  public detalle = "login-user";

  @Input() usuario: string;
  @Input() servidor: string;
  @Input() agencia: string;

  location: any;
  log_rutax: any;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<AppState>, private api: ApiService, public router: Router, public log_module: LogService,
    private _location: Location, private datePipe: DatePipe) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.onToggleMenuSidebar();
  }

  ngOnInit() {
    this.getHoraFechaServidorBckEnd(this.userConn)
    this.onToggleMenuSidebar();

    // IMPRIMIR DATOS DE CABECERA
    this.api.obtenerUsuarioLogueado();

    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
    });
    this.searchForm = new UntypedFormGroup({
      search: new UntypedFormControl(null)
    });

    this.getAllLogHistorialRutas();

    // Configura el intervalo para que se ejecute cada 5 minutos (300000 ms)
    this.intervalId = setInterval(() => {
      if (this.userConn != null) {
        this.getHoraFechaServidorBckEnd(this.userConn);
      } 
    }, 60000); // 600000 ms = 1 - minutos 120000 = 2 min
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruya para evitar fugas de memoria
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Intervalo limpiado al destruir el componente.');
    }

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goBack(): void {
    this._location.back();
  }

  guardarRutaLOG(nombre, ruta) {
    this.log_module.guardarVentana(nombre, '/');
    this.router.navigate([ruta]);
  }

  onToggleMenuSidebar() {
    this.store.dispatch(new ToggleSidebarMenu());
  }

  onToggleControlSidebar() {
    this.store.dispatch(new ToggleControlSidebar());
  }

  toggleNavbar() {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

  getHoraFechaServidorBckEnd(user_conn) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + user_conn)
       .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
           console.log("Hora Fecha Servidor cada minuto: ", datav);
          // this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          // this.hora_fecha_server = datav.horaServidor;
          // console.log(this.fecha_actual, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {  }
      })
  }

  getAllLogHistorialRutas() {
    let errorMessage: string;
    let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/logs/selog/getselogfecha/  --Vista LOG/Angular";
    return this.api.getAll('/seg_adm/logs/selog/getselogfecha/' + this.userConn + "/" + dataTransform)
      .subscribe({
        next: (datav) => {
          this.log = datav;
          this.log_ruta = this.log.filter((person) => person.tipo == 'ruta');
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  rutaPATH(ruta) {
    this.router.navigate([ruta]);
  }
}