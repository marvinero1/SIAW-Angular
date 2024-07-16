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

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = "31isaias";
    // this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;   
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/logs/selog/getselogfecha/  --Vista LOG/Angular";
    return this.api.getAll('/seg_adm/mant/adusuario/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.rol = datav.codrol;
          console.log(this.rol);

        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //aca toda la logica segun el rol

          if (this.rol === "ADM_GERENC_CORP" && "ADM_ASI_OPE_COM") {
            this.getVentasUsuarioGerencia();
          }

          if (this.rol === "VTA_EJEC_VENTAS") {
            this.getVentasUsuarioPorVendedor();
          }
        }
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
          this.resultado_proformas_filtrado = this.vents_vendedor.filter((element) => element.Usuarioreg === '31isaias');
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
