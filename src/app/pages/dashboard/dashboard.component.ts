import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  public usuarios: any;
  public tipo_cambio$ = [];
  public moneda$ = [];
  public tamanio_tipo_cambio: number;
  public tamanio_moneda: any = [];

  public vents_vendedor: any = [];
  public resultado_proformas_filtrado: any = [];
  public rol: string;

  public ventana = "Dashboard";

  constructor(private api: ApiService, private datePipe: DatePipe, public dialog: MatDialog,
    private spinner: NgxSpinnerService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.mandarNombre();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getRolUserParaVentana();
  }

  getRolUserParaVentana() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/mant/adusuario/";
    return this.api.getAll('/seg_adm/mant/adusuario/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.rol = datav.codrol;
          console.log(this.rol);
          //aca toda la logica segun el rol
          switch (this.rol) {
            case 'ADM_GERENC_CORP':
              this.getVentasUsuarioGerencia();
              break;
            case 'ADM_GERENC_CORP':
              this.getVentasUsuarioGerencia();
              break;
            case 'DPD':
              this.getVentasUsuarioGerencia();
              break;

            // aca solo salen las proformas tranferidas del vendedor que hizo login
            case 'VTA_EJEC_VENTAS':
              this.getVentasUsuarioPorVendedor();
              break;

            default:
              break;
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  getVentasUsuarioPorVendedor() {
    //trae todas las proformas aprobadas del vendedor que inicio sesion
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/DetallePFAprobadasWF/";
    return this.api.create('/venta/transac/veproforma/DetallePFAprobadasWF/' + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado, [])
      .subscribe({
        next: (datav) => {
          //TODOS
          this.vents_vendedor = datav;
          console.log("Info Ventas: ", this.vents_vendedor);

          //SOLO DEL VENDEDOR
          // const result = this.vents_vendedor.filter((element) => element.Usuarioreg === this.usuarioLogueado);
          this.resultado_proformas_filtrado = this.vents_vendedor.filter((element) => element.Usuarioreg === this.usuarioLogueado);
          console.log("Array Filtrado: ", this.resultado_proformas_filtrado);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getVentasUsuarioGerencia() {
    console.log("entra a gerencias");
    //trae todas las proformas aprobadas
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/DetallePFAprobadasWF/";
    return this.api.create('/venta/transac/veproforma/DetallePFAprobadasWF/' + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado, [])
      .subscribe({
        next: (datav) => {
          //TODOS
          this.resultado_proformas_filtrado = datav;
          console.log("Info Ventas Gerencia: ", this.resultado_proformas_filtrado);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
