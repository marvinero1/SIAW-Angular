import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { MessageService } from 'primeng/api';
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
  fecha_transform:any;

  public ventana = "Dashboard";
  data_graficar: any;
  options_grafica: any;

  fecha_actual: any;
  hora_fecha_server: any;

  constructor(private api: ApiService, private datePipe: DatePipe, public dialog: MatDialog,  private messageService: MessageService,
    private spinner: NgxSpinnerService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.mandarNombre();
    this.getHoraFechaServidorBckEnd();
    // this.toatsQA();

    const fecha = new Date();
    this.fecha_transform = this.datePipe.transform(fecha, "yyyy-MM-dd");
  }

  ngOnInit(): void { 
    this.getRolUserParaVentana();
    this.graficarVentasSIAWvsSIA();

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  
    // this.getDataGrafica();
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          
          this.fecha_actual = this.datePipe.transform(datav.fecha, "yyyy-MM-dd");
          this.hora_fecha_server = datav.horaServidor;
          console.log(this.fecha_actual, this.hora_fecha_server, datav.fecha);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getRolUserParaVentana() {
    let usuarioLoguead1o = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET, en la ruta /seg_adm/mant/adusuario/";
    return this.api.getAll('/seg_adm/mant/adusuario/' + this.userConn + "/" + usuarioLoguead1o)
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
          // console.log("Info Ventas Gerencia: ", this.resultado_proformas_filtrado);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDataGrafica(){
    let agencia_logueadoa = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;

    //trae todas las proformas aprobadas
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/DetallePFAprobadasWF/";
    // return this.api.getAll('/venta/usoSIAW/ventasbyVendedorSIAW_SIA/' + this.userConn + "/" +  this.fecha_transform + "/" + this.agencia_logueado )
    return this.api.getAll('/venta/usoSIAW/ventasbyVendedorSIAW_SIA/' + this.userConn + "/" +"2024-10-10"+ "/" + agencia_logueadoa )
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ DashboardComponent ~ getDataGrafica ~ datav:", datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }


  // toatsQA(){
  //   this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'Bienvenido! 🎉' })
  // }



























  graficarVentasSIAWvsSIA() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data_graficar = {
      labels: ['V31101', 'V31102', 'V31103', 'V31104', 'V31201', 'V31202', 'V31203'],
      datasets: [
        {
          label: 'SIA',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'SIAW',
          backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
          borderColor: documentStyle.getPropertyValue('--yellow-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options_grafica = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: true
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: true
          }
        }

      }
    };
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
