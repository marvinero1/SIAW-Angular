import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { CatalogoNotasRemisionComponent } from '../nota-remision/catalogo-notas-remision/catalogo-notas-remision.component';
import { CatalogoFacturasComponent } from '../facturas/catalogo-facturas/catalogo-facturas.component';
import { CatalogoFacturasService } from '../facturas/catalogo-facturas/servicio-catalogo-facturas/catalogo-facturas.service';
import { CatalogoNotasRemisionService } from '../nota-remision/servicio-catalogo-notas-remision/catalogo-notas-remision.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { firstValueFrom } from 'rxjs';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalDetalleObserValidacionComponent } from '../../modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { FormaPagoService } from './modal-forma-pago/services-forma-pago/forma-pago.service';
import { ModalFormaPagoComponent } from './modal-forma-pago/modal-forma-pago.component';
import { FacturaTemplateComponent } from '../facturas/factura-template/factura-template.component';

import * as QRCode from 'qrcode';
import pdfMake from "pdfmake/build/pdfmake";
import { VentanaValidacionesComponent } from '../../ventana-validaciones/ventana-validaciones.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-factura-nota-remision',
  templateUrl: './factura-nota-remision.component.html',
  styleUrls: ['./factura-nota-remision.component.scss']
})
export class FacturaNotaRemisionComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler5(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "input_numero_id_nota_remision":
        // this.getClientByID(this.codigo_cliente);
        this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
        //   break;
        // case "input_search":
        //   this.transferirProforma();
        //   break;
      }
    }
  };

  public nombre_ventana: string = "prgfacturarNR_cufd.vb";
  public ventana: string = "Facturacion FEL";
  public detalle = "Facturacion FEL";
  public tipo = "transaccion-fact_fel-POST";

  almacn_parame_usuario: any = [];
  eventosLogs:any=[];
  selectedItems!: any[];

  CUFD: any;
  num_caja:any;
  cod_control: string;
  codigo_control_get:any;
  codtipo_comprobante_get:any;
  nrolugar_get:any;
  tipo_get:any;

  
  hora_fecha_server: any = [];
  fecha_actual: any;
  fecha_actual_format: any;

  almacn_parame_usuario_almacen: any;
  cod_precio_venta_modal_codigo: any;
  cod_descuento_modal: any;
  
  id_proforma_numero_id: any;
  id_factura_catalogo: any;
  descrip_factura_catalogo: any;
  descrip_proforma_numero_id: any;
  numero_id_nota_remision: any;
  

  valProfDespachoForm:boolean = false;
  valFechaRemiHoyForm:boolean = false;
  valFactContadoForm:boolean = false;
  valTipoCamForm:boolean = false;

  public moneda_get_catalogo: any;
  public moneda_get_fuction: any = [];

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  displayedColumns: string[] = ['nroitem', 'subtotal', 'descuentos','recargos', 'montoiva', 'monto', 'total'];

  totalFacturaFooter:any;
  cabecera_respuesta:any=[];
  detalle_respuesta:any=[];
  lista_respuesta:any=[];

  detalle_get:any=[];
  lista_get:any=[];

  nombre_cliente:any;
  nit_cliente:any;
  complemento_tipodocid_cliente:any;
  condicionIVA_cliente:any;
  fecha_cliente:any;

  numero_cheque_forma_pago:any;
  id_cuenta_forma_pago:any;
  cod_tipo_pago_forma_pago:any;
  num_cuenta_formas_pago:any;
  banco_cheque_formas_pago:any;

  subtotal_cabecera:any;
  descuentos_cabecera:any;
  recargos_cabecera:any;
  total_cabecera:any; 
  
  dtpfecha_limite_get:any;
  codigo_nota_remision:any;

  valor_string_QR:string;

  //PDF
  //cabecera
  codfactura_web:any;
  codmoneda:any;
  complemento_ci:any;
  descuentos:any;
  leyenda_ley:any;
  nomcliente:any;
  cuf:any;
  id:any = "";
  numeroid:any;
  nrofactura:any;
  fecha:any;
  hora:string;

  //segundaColumna
  codptovta:any;
  direccion:any;
  fax:any;
  lugarEmision:any;
  sucursal:any;
  telefono:any;
  lugarFechaHora:any;

  //FOOTER
  qrCodeImage: string = ''; // Aquí guardaremos la imagen del QR generada

  public data_impresion: any = [];
  public data_cabecera_footer_proforma: any = [];
  public data_detalle_proforma: any = [];
  public data_detalle_etiqueta: any = [];

  QR_value_string:string;
  total_literal:string;
  leyenda:string;
  // FIN PDF

  nombre_XML:any;
  codigo_factura:any;

  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;

  constructor(public dialog: MatDialog, private api: ApiService, private datePipe: DatePipe, public nombre_ventana_service: NombreVentanaService,
    private servicioFacturas: CatalogoFacturasService, private almacenservice: ServicioalmacenService, public router: Router,
    public servicioCatalogoNotasRemision: CatalogoNotasRemisionService, private messageService: MessageService, private spinner: NgxSpinnerService,
    private formaPagoService:FormaPagoService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    if (this.agencia_logueado === 'Loc') {
      this.agencia_logueado = '311'
    }
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacn_parame_usuario_almacen = data.almacen.codigo;
    });

    this.servicioFacturas.disparadorDeIDFacturas.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.id_factura_catalogo = data.factura.id;
      this.descrip_factura_catalogo = data.factura.descripcion;
    });

    this.servicioCatalogoNotasRemision.disparadorDeIDNotaRemision.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.id_proforma_numero_id = data.proforma.id;
      this.descrip_proforma_numero_id = data.proforma.descripcion;
    });

    //modalClientesParaSeleccionarClienteReal
      this.formaPagoService.disparadorDeInfoFormaPago.subscribe(data => {
        console.log("Recibiendo Data Formas de Pago: ", data);
        this.id_cuenta_forma_pago = data[0].IngresoEfectivo;
        this.cod_tipo_pago_forma_pago = data[0].TipoPago;
        this.num_cuenta_formas_pago = data[0].NrodeCuenta;
        this.banco_cheque_formas_pago = data[0].BancoCheque;

        this.numero_cheque_forma_pago = data[0].NumCheque;
        
        console.log(this.id_cuenta_forma_pago, this.cod_tipo_pago_forma_pago, 
          this.num_cuenta_formas_pago, this.banco_cheque_formas_pago)

          // ACA VIENE DESPUES DE CERRAR EL MODAL
          this.grabarFactura();
      });
    //
    this.fecha_actual_format = this.datePipe.transform(this.fecha_actual, 'dd-MM-yyyy');

    this.getParamUsuario();
    this.mandarNombre();
    this.getHoraFechaServidorBckEnd();
    this.getAlmacenParamUsuario();
    this.getAllmoneda();
    this.getNotaRemision();
    this.getCatalogoFacturas();
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          this.hora_fecha_server = datav.horaServidor;

          console.log(this.fecha_actual, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getAllmoneda() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get_fuction = datav;
          console.log(this.moneda_get_fuction);
          const encontrado = this.moneda_get_fuction.some((moneda) => moneda.codigo === 'BS');

          if (encontrado) {
            console.log("HAY BS")
            this.moneda_get_catalogo = "BS";
            console.log(encontrado, this.moneda_get_catalogo);
            //this.getMonedaTipoCambio(this.moneda_get_catalogo);
          }
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

          //this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          this.cod_descuento_modal = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getParamUsuario() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veremision/getParametrosIniciales/";
    return this.api.getAll('/venta/transac/veremision/getParametrosIniciales/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log('data', datav);
          // this.almacn_parame_usuario_almacen = datav.id;
          // this.id_proforma_numero_id = datav[0].id;
          // this.descrip_proforma_numero_id = datav[0].descripcion;
          // this.tdc = datav.codtarifadefect;
          // this.cod_descuento_modal_codigo = datav.coddescuentodefect;
          // this.cod_vendedor_cliente_modal = datav.codvendedor;

          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.moneda_get_catalogo = datav.codmoneda;
          this.cod_precio_venta_modal_codigo = datav.codtarifadefect;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getNotaRemision() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/venumeracion/catalogo/";

    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "4")
      .subscribe({
        next: (datav) => {
          // console.log("🚀 ~ FacturaNotaRemisionComponent ~ getNotaRemision ~ datav:", datav)

          this.id_proforma_numero_id = datav[0].id;
          this.descrip_proforma_numero_id = datav[0].descripcion;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getCatalogoFacturas() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/venumeracion/catalogo/";

    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "1")
      .subscribe({
        next: (datav) => {
          // console.log("🚀 ~ FacturaNotaRemisionComponent ~ getCatalogoFacturas ~ datav:", datav)
          this.id_factura_catalogo = datav[0].id;
          this.descrip_factura_catalogo = datav[0].descripcion;

        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  generarFactura() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDosificacionCaja/";
    return this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDosificacionCaja/' + this.userConn + "/" + this.fecha_actual + "/" + this.almacn_parame_usuario_almacen)
      .subscribe({
        next: (datav) => {
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'DOSIFICADO ✅' });
          console.log("🚀 ~ FacturaNotaRemisionComponent ~ generarFactura ~ datav:", datav);

          this.cod_control = datav.codigo_control;
          this.CUFD = datav.cufd;
          this.num_caja = datav.nrocaja;
          this.codigo_control_get = datav.codigo_control;
          //datav.tipo;
          this.codtipo_comprobante_get= datav.codtipo_comprobante;
          //codtipo_comprobantedescripcion
          this.dtpfecha_limite_get = datav.dtpfecha_limite;
          //nrocaja
          this.nrolugar_get = datav.nrolugar;
          //resp
          this.tipo_get = datav.tipo;
        },

        error: (err: any) => {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'OCURRIO ALGO INESPERADO 😧' });
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }
  
  generarFacturaNRPOST(valProfDespachoFormP, valFechaRemiHoyFormP, valFactContadoFormP, valTipoCamFormP){
    if (this.num_caja === undefined || this.num_caja === null) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "GENERE CUFD, CON EL BOTON DE CAJA FACTURA",
        }
      });
      return;
    }

    let array_body = {
      idNR: this.id_proforma_numero_id,
      nroIdNR: this.numero_id_nota_remision === undefined ? 0: this.numero_id_nota_remision,
      codEmpresa: this.BD_storage,
      cufd: this.CUFD,
      usuario: this.usuarioLogueado,
      nrocaja: this.num_caja,

      // preguntar de donde salen estos booleans
      valProfDespachos: valProfDespachoFormP,
      valFechaRemiHoy: valFechaRemiHoyFormP,
      valFactContado: valFactContadoFormP,
      valTipoCam: valTipoCamFormP
    };
    console.warn(array_body);

    return this.api.create("/venta/transac/prgfacturarNR_cufd/generarFacturasNR/" + this.userConn, array_body)
      .subscribe({
        next: async (datav) => {
          console.log(datav);
          
          // cuando todo se verifico y paso la data llega aca y se empieza a pintar xd
          // datav.
          this.nombre_cliente = datav.facturas?.cabecera.nomcliente;
          this.nit_cliente = datav.facturas?.cabecera.nit;
          this.complemento_tipodocid_cliente = datav.facturas?.cabecera.complemento_ci;
          this.condicionIVA_cliente = datav.facturas?.condicion;
          this.codigo_nota_remision = datav.facturas?.cabecera.codigo;
          this.cod_tipo_pago_forma_pago = datav.facturas?.cabecera.tipopago;
          
          // fecha del servidor no del lo q me trae
          this.fecha_cliente = datav.facturas?.cabecera.fecha;

          // data totalesFooter
          this.subtotal_cabecera = datav.facturas?.cabecera.subtotal;
          this.descuentos_cabecera = datav.facturas?.cabecera.descuentos;
          this.recargos_cabecera = datav.facturas?.cabecera.recargos;
          this.total_cabecera = datav.facturas?.cabecera.total;

          this.detalle_get = datav.facturas?.detalle;
          this.lista_get = datav.facturas?.lista;

          if(!datav.valido){
            await this.openConfirmacionDialog(datav.resp);
            // si codigo de servicio es igual a:
            // -1 tipo de cambio
            // 29 es notaremision con fecha pasada
            // 33 validacionDespachos
            // 89 tipoVenta Contado
            switch (datav.objContra.servicio) {
              case 29:
                if(this.valFechaRemiHoyForm === false){
                  console.log("NO VALIDADO ENTRA A VALIDAR");
                  const validacionvalFechaRemiHoy = this.dialog.open(PermisosEspecialesParametrosComponent, {
                    width: 'auto',
                    height: 'auto',
                    data: {
                      dataA: datav.objContra.datos_a,
                      dataB: datav.objContra.datos_b,
                     // dataPermiso: datav.objContra.datos_documento,
                     dataPermiso: "FACTURAR NOTA DE REMISION DE FECHA PASADA",
                     dataCodigoPermiso: datav.objContra.servicio,
                    },
                  });
      
                  validacionvalFechaRemiHoy.afterClosed().subscribe((result: Boolean) => {
                    if(result){
                      console.warn('PASO LA VALIDACION LOLA', result);
                      this.valFechaRemiHoyForm = true;
                      // this.valProfDespachoForm = false;
                      // this.valFactContadoForm = false;
                      // this.valTipoCamForm = false;                    
                    
                      this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
                    }
                  });
                }
                break;
              case 89:
                if(this.valFactContadoForm === false){
                  console.log("NO VALIDADO ENTRA A VALIDAR");
                  const validacionvalTipoVenta = this.dialog.open(PermisosEspecialesParametrosComponent, {
                    width: 'auto',
                    height: 'auto',
                    data: {
                      dataA: datav.objContra.datos_a,
                      dataB: datav.objContra.datos_b,
                     // dataPermiso: datav.objContra.datos_documento,
                     dataPermiso: "PERMITIR EMITIR FACTURA VENTA CONTADO", 
                     dataCodigoPermiso: datav.objContra.servicio,
                    },
                  });
  
                  validacionvalTipoVenta.afterClosed().subscribe((result: Boolean) => {
                    if(result){
                      // console.warn('PASO LA VALIDACION LOLA', result);
                      // this.valFechaRemiHoyForm = false;
                      // this.valProfDespachoForm = false;
                      this.valFactContadoForm = true;
                      // this.valTipoCamForm = false;
                    
                      this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
                    }
                  });
                }
                break;
              case -1:
                if(this.valTipoCamForm === false){
                  console.log("NO VALIDADO ENTRA A VALIDAR");
                  const validacionvalTipoCambio = this.dialog.open(PermisosEspecialesParametrosComponent, {
                    width: 'auto',
                    height: 'auto',
                    data: {
                      dataA: datav.objContra.datos_a,
                      dataB: datav.objContra.datos_b,
                     // dataPermiso: datav.objContra.datos_documento,
                     dataPermiso: "", 
                     dataCodigoPermiso: datav.objContra.servicio,
                    },
                  });
      
                  validacionvalTipoCambio.afterClosed().subscribe((result: Boolean) => {
                    if(result){
                      // console.warn('PASO LA VALIDACION LOLA', result);
                      // this.valFechaRemiHoyForm = false;
                      // this.valProfDespachoForm = false;
                      // this.valFactContadoForm = false;
                      this.valTipoCamForm = true;
                      
                      this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
                    }
                  });
                }
                break;
              case 33:
                if(this.valProfDespachoForm === false){
                  console.log("NO VALIDADO ENTRA A VALIDAR");
                  const validacionvalDespacho = this.dialog.open(PermisosEspecialesParametrosComponent, {
                    width: 'auto',
                    height: 'auto',
                    data: {
                      dataA: datav.objContra.datos_a,
                      dataB: datav.objContra.datos_b,
                     // dataPermiso: datav.objContra.datos_documento,
                     dataPermiso: "FACTURAR NOTA DE REMISION NO REG EN DESPACHOS", 
                     dataCodigoPermiso: datav.objContra.servicio,
                    },
                  });
      
                  validacionvalDespacho.afterClosed().subscribe((result: Boolean) => {
                    if(result){
                      // console.warn('PASO LA VALIDACION LOLA', result);
                      // this.valFechaRemiHoyForm = false;
                      this.valProfDespachoForm = true;
                      
                      this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
                    }                  
                  });
                }
                break;
              default:
                break;
            }
            setTimeout(() => {
              this.spinner.hide();
            }, 500);
            return;
          }else{
            //aca ya es cuando la resp es VALIDO = TRUE
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'FACTURA GENERADA ✅' });
          this.totalFacturaFooter = datav.facturas.totfactura;
          this.cabecera_respuesta = datav.facturas.cabecera; // []
          this.detalle_respuesta = datav.facturas.detalle; // []
          this.lista_respuesta = datav.facturas.lista; // []
          }

          setTimeout(() => {
          }, 500);
        },

        error: (err) => {
          console.log(err);
          setTimeout(() => {
          }, 500);
        },
        complete: () => { }
      });
  }

  //SECCION DONDE SE OBTIENE PDF Y SE DIBUJA
  async getDataFacturaParaArmar(cadena, codigo_factura:any){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDataFactura/";
    this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataFactura/' + this.userConn + "/" + codigo_factura + "/" + this.BD_storage)
      .subscribe({
        next: async (datav) => {
         console.log("🚀 ~ FacturaNotaRemisionComponent ~ getDataFacturaParaArmar ~ datav:", datav)
          this.valor_string_QR = datav.cadena_QR;
          //armamos el PDF, se crea, descarga el archivo y se lo envia por email

          if(datav){
            try {
              await this.openConfirmacionDialog(cadena);
              await this.modalPDFFactura(datav);
              
              // ACA SE GENERA EL PDF CON SU ARCHIVO BLOB PARA QUE SE ENVIE POR CORREO ELECTRONICO
              this.descargarPDF(datav);
            } catch (error) {
              console.error("Ocurrió un error:", error);
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Hubo un problema en el proceso' });
            }
          }else{
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO PASO LA DATA O NO LLEGO' });
          }
        },

        error: (err: any) => {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO SE PUDO TRAER INFORMACION DE LA FACTURA😧' });
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
  
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
  
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
  
      img.onerror = error => {
        reject(error);
      };
  
      img.src = url;
    });
  }

  // Función para generar el código QR en base64
  generateQRCodeBase64(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(data, { errorCorrectionLevel: 'M', scale:5, width:85}, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);  // 'url' contiene la imagen en base64
        }
      });
    });
  }

  async descargarPDF(data_pdf){
    console.log("🚀 ~ FacturaNotaRemisionComponent ~ descargarPDF ~ data:", data_pdf)
    this.data_cabecera_footer_proforma = data_pdf.cabecera;
    this.QR_value_string = data_pdf?.cadena_QR;
    this.total_literal = data_pdf?.imp_totalliteral;
    this.leyenda = data_pdf?.leyendaSIN;

    this.id = data_pdf?.cabecera.id;
    this.numeroid = data_pdf?.cabecera.numeroid;
    this.codfactura_web = data_pdf?.cabecera.codfactura_web;
    this.codmoneda = data_pdf?.cabecera.codmoneda;
    this.complemento_ci = data_pdf?.cabecera.complemento_ci;
    this.cuf = data_pdf?.cabecera.cuf;
    this.nrofactura = data_pdf?.cabecera.nrofactura;
    this.fecha =  this.datePipe.transform(data_pdf?.cabecera.fecha, "dd/MM/yyyy");
    this.hora = data_pdf?.cabecera.horareg;

    this.descuentos = data_pdf?.cabecera.descuentos;
    this.subtotal = data_pdf?.cabecera.subtotal;
    this.total = data_pdf?.cabecera.total;

    //fecha
    this.leyenda_ley = data_pdf?.cabecera.leyenda;
    this.nit_cliente = data_pdf?.cabecera.nit;
    this.nomcliente = data_pdf?.cabecera.nomcliente;

    //segundaColumna
    this.codptovta = data_pdf?.paramEmp.codptovta;
    this.direccion = data_pdf?.paramEmp.direccion;
    this.fax =  data_pdf?.paramEmp.fax;
    this.lugarEmision = data_pdf?.paramEmp.lugarEmision;
    this.sucursal = data_pdf?.paramEmp.sucursal;
    this.telefono = data_pdf?.paramEmp.telefono;

    this.lugarFechaHora = data_pdf?.paramEmp.lugarFechaHora
    //data.dtveproforma1 DETALLE
    this.data_detalle_proforma = data_pdf.detalle;

    // Agregar el número de orden a los objetos de datos
    data_pdf.detalle.forEach((element, index) => {
      element.nroitem = index + 1;
      element.orden = index + 1;
    });

    try {
      const imageUrl = 'assets/img/logo.png'; // Ruta de tu imagen
      const base64Image = await this.getBase64ImageFromURL(imageUrl);
      // Asegúrate de que el QR ya está generado en qrCodeImage
      const base64QR = await this.generateQRCodeBase64(this.QR_value_string);
      const id = this.id;
      const numeroid = this.numeroid;

      const docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [12, 128, 140, 24],
        info: { title: "FACTURA NOTAS DE REMISION - PERTEC"},
        header: {
          columns: [
            // Columna 1 (Imagen)
            {
              stack: [
                { image: base64Image,  width: 76, height: 76, margin: [13, 12, 9, 5]},
                { text: "Lugar y Fecha:", alignment: 'left', fontSize: 8, margin: [10, 2, 10, 0], bold: true, font: 'Tahoma' },
                { text: "Nom/Razon Social: ", alignment: 'left', fontSize: 8, margin: [10, 0, 0, 0], bold: true, font: 'Tahoma' },
              ],
              margin: [12, 5, 0, 0], // Margen ajustado
              width: 'auto', // Auto ajuste de tamaño
            },
            // Columna 2 (Texto)
            {
              stack: [
                { text: "PERTEC S.R.L", alignment: 'center', fontSize: 9, bold: true, font: 'BookMan', margin:[0, 0, 4, 0]},
                { text: "CASA MATRIZ", alignment: 'center', fontSize: 6, bold: true, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: "Gral. Achá N° 330", alignment: 'center', fontSize: 6, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: "Tels: 4259660 - 4250800 - Fax: "+ this.fax, alignment: 'center', fontSize: 6, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: "Cochabamba - Bolivia", alignment: 'center', fontSize: 6, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: this.sucursal, alignment: 'center', fontSize: 6, bold: true, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: this.codptovta, alignment: 'center', fontSize: 6, bold: true, font: 'Arial' },
                { text: this.direccion, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: this.telefono, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: this.lugarEmision, alignment: 'center', fontSize: 6, margin:[0, 0, 0, 8], font: 'Arial' },

                { text: " " + this.lugarFechaHora, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                { text: " " + this.nomcliente, alignment: 'left', fontSize: 8, colSpan: 6, font: 'Tahoma' },
              ],
              margin: [0, 12, 12, 15], // Margen ajustado
              width: 'auto', // Auto ajuste de tamaño
            },
            // Columna 3 (Texto)
            {
              stack: [{
                text: "FACTURA",
                alignment: 'center',
                margin: [2, 40, 5, 0], // Ajuste de margen superior
                fontSize: 11,
                font: 'BookMan',
                bold: true 
              },
              {
                text: "CON DERECHO A CREDITO FISCAL",
                alignment: 'center',
                margin: [0, 0, 0, 0],
                fontSize: 8,
                font: 'BookMan',
                bold: true 
              },
            ]
            },
            // Columna 4 (Texto)
            {
              stack: [
                { text: [ { text: 'NIT: ', bold: true, alignment: 'right', fontSize: 7, font: 'Tahoma'},  // 'NIT:' en negrita
                          { text: '1023109029', bold: true, alignment: 'left', font: 'Tahoma' }  // Número sin negrita
                        ], fontSize: 7, margin:[0, 12, 52, 0]},

                { text: [{text:"Factura Nro: ", bold: true, alignment: 'right', fontSize: 7, font: 'Tahoma'},
                          {text:"00000"+ this.nrofactura, bold: true, alignment: 'left', font: 'Tahoma'}], fontSize: 7, 
                          margin:[0, 0, 63, 0]},

                { table: {
                  widths: [65, 70], // Ajusta las columnas
                  body: [
                    [
                      {
                        text: "Cód. Autorización:",
                        bold: true,
                        alignment: 'right',
                        fontSize: 7,
                        font: 'Tahoma',
                        margin: [0, 0, 0, 0]
                      },
                      {
                        text: this.insertarSaltosDeLinea(this.cuf), 
                        bold: true,
                        alignment: 'left',
                        characterSpacing: 0,
                        fontSize: 7,
                        font: 'Tahoma',
                        margin: [0, 0, 0, 25]
                      }
                    ]
                  ]
                },
                layout: 'noBorders', // Elimina los bordes si no los necesitas
              },

                { text: [{text:"Nit/Ci/Cex: ", bold: true, alignment: 'right'},
                   { text:this.nit_cliente + this.complemento_ci, bold: false}], fontSize: 8, font: 'Tahoma',
                    margin:[0, 0, 56, 0]},
                { text: [{text:"Código Cliente: ", bold: true, alignment: 'right', font: 'Tahoma'}, 
                  { text: this.nit_cliente, bold: false, font: 'Tahoma'}], fontSize: 8, margin:[0, 0, 48, 0]},
              ],
              margin: [10, 10, 10, 0], // Margen ajustado
            },
          ],
          margin: [0, 4, 2, 0], // Margen del header
        },
  
        content: [
          // Línea encima de la cabecera
          {
            canvas: [{
              type: 'line', x1: 12, y1: 0, x2: 575, y2: 0, lineWidth: 1 
            }],
            margin: [0, 0, 0, 0], // Espacio entre la línea superior y la tabla
          },

          // Tabla con cabecera y contenido
          {
            table: {
              headerRows: 1,
              widths: [18, 56, 140, 56, 48, 48, 48, 58, 64],
              
              body: [
                  [
                    { text: '#', style: 'tableHeader', alignment: 'left', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma'},
                    { text: 'CODIGO PRODUCTO', style: 'tableHeader', alignment: 'center', fontSize: 8, bold: true, font: 'Tahoma' },
                    { text: 'DESCRIPCION', colSpan: 2, style: 'tableHeader', alignment: 'center', fontSize: 8, noWrap: false, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                    {}, // Columna vacía para ajustar con el colSpan
                    { text: 'UNIDAD DE MEDIDA', style: 'tableHeader', alignment: 'center', fontSize: 8, bold: true, font: 'Tahoma' },
                    { text: 'CANTIDAD', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                    { text: 'PRECIO UNITARIO', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, font: 'Tahoma' },
                    { text: 'DESCUENTO', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                    { text: 'SUBTOTAL'+ "("+this.codmoneda+")", style: 'tableHeader', alignment: 'right', fontSize: 8,  bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  ],

                  ...this.data_detalle_proforma.map(items => [
                    { text: items.nroitem, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                    { text: items.coditem, alignment: 'center', fontSize: 8, font: 'Tahoma' },
                    { text: this.cortarStringSiEsLargo(items.descripcion), alignment: 'left', fontSize: 8, font: 'Tahoma' },
                    { text: items.medida, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                    { text: items.udm, alignment: 'center', fontSize: 8, font: 'Tahoma' },
                    { text: this.formatNumberTotalSubTOTALES(items.cantidad), alignment: 'right', fontSize: 8, font: 'Tahoma' },
                    { text: items.precioneto, alignment: 'right', fontSize: 8, font: 'Tahoma' },
                    { text: items.preciodesc, alignment: 'right', fontSize: 8, font: 'Tahoma'},
                    { text: this.formatNumberTotalSub(items.total), alignment: 'right', fontSize: 8, font: 'Tahoma' }
                  ]),

                  [{ text: '___________________________________________________________________________________', colSpan: 9, margin: [0, 0, 0, 0] }, {}, {}, {}, {}, {}, {}, {}, {}],

                  [{ text: this.total_literal, characterSpacing: 0, margin: [10, 0, 0, 0], bold:true, fontSize: 8, colSpan: 6, font: 'Tahoma' },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },             
                  { text: 'Sub Total'+"("+this.codmoneda+"): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma'},
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: this.subtotal, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                  [{ text: '________________________________________________________', margin: [0, 0, 0, 0], colSpan: 6, },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: 'Descuentos'+"("+this.codmoneda+"): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma'},
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: this.descuentos, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                  [{ text: '', characterSpacing: 0, margin: [10, 0, 0, 0], bold:true, colSpan: 6 },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },              
                  { text: 'Total'+"("+this.codmoneda+"): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], 
                    colSpan: 2, font: 'Tahoma'},
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },             
                  { text: this.total, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                  [{ text: [{text:"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS, EL USO ILICITO DE ESTA SERA SANCIONADO PENALMENTE DE ACUERDO A LA LEY \n", 
                    bold:true, fontSize:8, alignment: 'center', font: 'Tahoma' },
                    { text: this.leyenda_ley + "\n", bold:false, fontSize:6, alignment: 'center', font: 'Tahoma' },
                    {text: this.leyenda + "\n", bold:false, fontSize:6, alignment: 'center', font: 'Tahoma' },
                    {text:"Esta factura se encuentra tambien disponible en el siguiente enlace", bold:false, fontSize:6, font: 'Tahoma' }], characterSpacing: 0, margin: [10, 0, 0, 0], colSpan: 5, alignment: 'center'},
                  
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: 'Importe Base Credito Fiscal'+"("+this.codmoneda+"): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma'}, 
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }, 
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },             
                  { text: this.total, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                  [ { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { image: base64QR, colSpan: 3, alignment: 'center', margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                  { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }],

                  [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0], },
                    { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                    { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                    { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                    { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                    { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                    { text: 'Código WEB: ' + this.codfactura_web, alignment: 'center', fontSize:7, margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma' },
                    { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                    { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }],
                ],
            },
            margin: [12, 0, 10, 0], // Ajusta el espacio alrededor de la tabla
            layout: {
              // 'headerLineOnly',
              headerLineOnly: true,
              hLineWidth: function (i, node) {
                // Dibuja una línea solo debajo del encabezado
                return (i === 1) ? 1 : 0;
              },
              vLineWidth: function (i, node) {
                // Sin líneas verticales
                return 0;
              },
              hLineColor: function (i, node) {
                // Color de la línea horizontal
                return (i === 1) ? 'black' : 'white';
              },
              paddingLeft: function(i, node) { return 1.5; },
              paddingRight: function(i, node) { return 1.5; },
              paddingTop: function(i, node) { return 2.5; },
              paddingBottom: function(i, node) { return 1.5; }
            },
          },
        //   [{ table: {
        //     body: [
        //       [
        //         {
        //           text: [
        //             { text: "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS, EL USO ILICITO DE ESTA SERA SANCIONADO PENALMENTE DE ACUERDO A LA LEY", bold: true, fontSize: 8 },
        //             { text: "\nLey N 453 EL proveedor debera entrega el producto en las modalidades y terminos ofertados y terminos acordados o convenidos", bold: false, fontSize: 6 },
        //             { text: "\nEste Documento es la representacion grafica de un documento en Fisico Digital emitido en la modalidad de facturacion en linea", bold: false, fontSize: 6 },
        //             { text: "\nEsta factura se encuentra tambien disponible en el siguiente enlace", bold: false, fontSize: 6 }
        //           ],
        //           characterSpacing: 0,
        //           margin: [10, 10, 0, 0],
        //           colSpan: 5,
        //           alignment: 'center'
        //         },
        //         {}, {}, {}, {}  // Celdas vacías para aplicar el colSpan
        //       ],
        //       [
        //         {}, {}, {}, {}, // Más celdas vacías
        //         {
        //          image: base64QR,
        //         }
        //       ]
        //     ]
        //   }
        // }]
          // {
          //   canvas: [{ 
          //     type: 'line', x1: 12, y1: 0, x2: 585, y2: 0, lineWidth: 1 
          //   }],
          //   margin: [0, 0, 0, 0] // Espacio entre la línea superior y la tabla
          // },          
        ],

        footer: function (currentPage, pageCount) {
          return {
            columns: [             
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount +" - "+ id + "-" + numeroid,
                alignment: 'center',
                margin: [4, 0, 10, 4],
                fontSize: 7,
                font: 'Arial',
              }
            ]
          };
        },

        styles: {
          header: {
            fontSize: 15,
          },
          content: {
            margin:[0, 0, 0, 0],
          }
        },
        
        defaultStyle: {
          fontSize: 12,
          font: 'Arial',
        },
      };
  
      const archivo_pdf = pdfMake.createPdf(docDefinition);

      archivo_pdf.getBlob((pdfBlob: Blob) => {
        this.enviarFacturaEmail(pdfBlob);  // Llamamos a la función con el Blob
      });
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
    }
  }
  //FIN SECCION DONDE SE OBTIENE PDF Y SE DIBUJA

  grabarFactura(){
    let array_post={
      idfactura: this.id_factura_catalogo,
      nrocaja: this.num_caja,
      factnit: this.nit_cliente,
      condicion: this.condicionIVA_cliente,
      nrolugar: this.nrolugar_get,
      tipo: this.tipo_get,
      codtipo_comprobante: this.codtipo_comprobante_get,
      usuario: this.usuarioLogueado,
      codempresa: this.BD_storage,     

      cufd: this.CUFD,
      complemento_ci: this.complemento_tipodocid_cliente,
      dtpfecha_limite: this.dtpfecha_limite_get,
      codigo_control: this.codigo_control_get,
      factnomb: this.nombre_cliente,

      idcuenta: this.id_cuenta_forma_pago,
      codtipopago: this.cod_tipo_pago_forma_pago,
      codcuentab: this.num_cuenta_formas_pago,
      codbanco: this.banco_cheque_formas_pago,
      nrocheque: this.numero_cheque_forma_pago,

      detalle:this.detalle_get,
      dgvfacturas:this.lista_get,
    }

    console.warn("🚀 ~ FacturaNotaRemisionComponent ~ grabarFactura ~ array_post:", array_post);
    console.warn("🚀 ~ FacturaNotaRemisionComponent ~ grabarFactura ~ acodigoNotaRemision:", this.codigo_nota_remision);
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/grabarFacturasNR/";
    return this.api.create('/venta/transac/prgfacturarNR_cufd/grabarFacturasNR/' + this.userConn + "/" + this.codigo_nota_remision, array_post)
      .subscribe({
        next: async (datav) => {
          console.log("🚀 ~ FacturaNotaRemisionComponent ~ grabarFactura ~ datav:", datav);
          this.eventosLogs = datav.eventosLog;
          this.eventosLogs = this.eventosLogs.map(log => ({ label: log }));
          this.nombre_XML = datav.nomArchivoXML;
          this.codigo_factura = datav.codFactura;

          console.log("🚀 ~ FacturaNotaRemisionComponent ~ grabarFactura ~ this.eventosLogs:", this.eventosLogs)
          this.nombre_XML = datav.nomArchivoXML;

          if(datav.msgAlertas.length > 0){
            this.openConfirmacionDialog(datav.msgAlertas);
          }
          
          if (datav.imprime) {
            // Espera a que termine de armar la factura
            this.getDataFacturaParaArmar(datav.resp + "\n" + datav.cadena + "\n" +"Codigo Factura: " + datav.codFactura, datav.codFactura);
         
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });
          }
          else{
            this.openConfirmacionDialog(datav.resp + "\n" + datav.cadena + "  Codigo Factura: " +datav.codFactura);
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      });
  }

  // Función para enviar el PDF
  enviarFacturaEmail(pdfBlob: Blob) {
    console.log("🚀 ~ FacturaNotaRemisionComponent ~ enviarFacturaEmail ~ pdfBlob:", pdfBlob);

    // Crear FormData y agregar el archivo
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, `FACTURA-NOTA-REMISION-PERTEC.pdf`);

    console.log(formData.get('pdfFile'));
    console.log(formData);

    let errorMessage = "Error al enviar la factura por email.";
    
    // Realizar la petición POST usando formData
    this.api.create(
      `/venta/transac/prgfacturarNR_cufd/enviarFacturaEmail/${this.userConn}/${this.BD_storage}/${this.usuarioLogueado}/${this.codigo_factura}/${this.nombre_XML}`,
      formData
    ).subscribe({
      next: (datav) => {
        console.warn("🚀 Se envió la data para el email:", datav);
      },
      error: (err) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'No se envió el email' });
        console.error(err, errorMessage);
      },
      complete: () => {
        console.log("Envio completado");
      }
    });
  }

  verificarConexionSIN(){
    let errorMessage = "Error al enviar la factura por email.";
    // Realizar la petición POST usando formData
    this.api.getAll(`/venta/transac/prgfacturarNR_cufd/getVerifComunicacionSIN/${this.userConn}/${this.agencia_logueado}`
    ).subscribe({
      next: (datav) => {
        console.warn("🚀 Verificacion con el SIN: ", datav);
        if(datav.resp === "Verificacion conexion con el SIN exitosa"){
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'CONEXION EXITOSA CON EL SIN ' });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY CONEXION CON EL SIN' });
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'OCURRIO UN PROBLEMA AL VERIFICAR' });
        console.error(err, errorMessage);
      },
      complete: () => {  }
    });
  }


















  


  openConfirmacionDialog(message: string): Promise<boolean> {
    //btn aceptar
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  openFormasDePago() {
    console.warn(this.cod_tipo_pago_forma_pago);
    const dialogRef = this.dialog.open(ModalFormaPagoComponent, {
      width: '450px',
      height: 'auto',
      disableClose: true,
      data:{ tipo_pago:this.cod_tipo_pago_forma_pago}
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  async modalDetalleObservaciones(obs, obsDetalle): Promise<void> {
    this.dialog.open(ModalDetalleObserValidacionComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        obs_titulo: obs,
        obs_contenido: obsDetalle,
      },
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  modalCatalogoNotasDeRemision(): void {
    this.dialog.open(CatalogoNotasRemisionComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalCatalogoFacturas(): void {
    this.dialog.open(CatalogoFacturasComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  async modalPDFFactura(data: any): Promise<any> {
    const dialogRef = this.dialog.open(FacturaTemplateComponent, {
      width: 'auto',
      height: 'auto',
      data: { valor_PDF: data },
    });
  
    // Espera hasta que el modal se cierre y devuelve el resultado
    return firstValueFrom(dialogRef.afterClosed());
  }
  
  insertarSaltosDeLinea(texto: string, limite: number = 21): string {
    let resultado = '';
    for (let i = 0; i < texto.length; i += limite) {
      resultado += texto.substring(i, i + limite);
    }
    // console.log(resultado);
    return resultado.trim(); // Quita el salto de línea final si no lo deseas
  }
  
  cortarStringSiEsLargo(texto: string): string {
    if (texto.length >= 27) {
      return texto.slice(0, 27);  // Corta a los primeros 28 caracteres
    }
    return texto;  // Retorna el texto original si tiene menos de 28 caracteres
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(formattedNumber);
  }
  
}
