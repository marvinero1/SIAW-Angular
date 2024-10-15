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

  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;

  constructor(public dialog: MatDialog, private api: ApiService, private datePipe: DatePipe, public nombre_ventana_service: NombreVentanaService,
    private servicioFacturas: CatalogoFacturasService, private almacenservice: ServicioalmacenService, public router: Router,
    public servicioCatalogoNotasRemision: CatalogoNotasRemisionService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private formaPagoService:FormaPagoService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

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

    //this.openFormasDePago();
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
          this.toastr.info("DOSIFICADO ✅");
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
          this.toastr.warning("OCURRIO ALGO INESPERADO 😧");

          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }
  
  generarFacturaNRPOST(valProfDespachoFormP, valFechaRemiHoyFormP, valFactContadoFormP, valTipoCamFormP){
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
                    console.warn('PASO LA VALIDACION LOLA', result);
                    this.valFechaRemiHoyForm = true;
                    // this.valProfDespachoForm = false;
                    // this.valFactContadoForm = false;
                    // this.valTipoCamForm = false;                    
                    
                    this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
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
                    // console.warn('PASO LA VALIDACION LOLA', result);
                    // this.valFechaRemiHoyForm = false;
                    // this.valProfDespachoForm = false;
                    this.valFactContadoForm = true;
                    // this.valTipoCamForm = false;
                    
                    this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
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
                    // console.warn('PASO LA VALIDACION LOLA', result);
                    // this.valFechaRemiHoyForm = false;
                    // this.valProfDespachoForm = false;
                    // this.valFactContadoForm = false;
                    this.valTipoCamForm = true;
                    
                    this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
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
                    // console.warn('PASO LA VALIDACION LOLA', result);
                    // this.valFechaRemiHoyForm = false;
                    this.valProfDespachoForm = true;
                    // this.valFactContadoForm = false;
                    // this.valTipoCamForm = false;
                    
                    this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
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
          this.toastr.success("FACTURA GENERADA ✅");
          this.totalFacturaFooter = datav.facturas.totfactura;
          this.cabecera_respuesta = datav.facturas.cabecera; // []
          this.detalle_respuesta = datav.facturas.detalle; // []
          this.lista_respuesta = datav.facturas.lista; // []
          }
          setTimeout(() => {
            // this.spinner.hide();
          }, 500);
        },

        error: (err) => {
          console.log(err);
          // this.toastr.error('');
          // this.complementopf = false;
          // this.disableSelectComplemetarProforma = false;
          setTimeout(() => {
            // this.spinner.hide();
          }, 500);
        },
        complete: () => {

        }
      });
  }

  nombre_XML:any;
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
        next: (datav) => {
          console.log("🚀 ~ FacturaNotaRemisionComponent ~ grabarFactura ~ datav:", datav);
          this.eventosLogs = datav.eventosLog;
          this.eventosLogs = this.eventosLogs.map(log => ({ label: log }));
          console.log("🚀 ~ FacturaNotaRemisionComponent ~ grabarFactura ~ this.eventosLogs:", this.eventosLogs)
          this.nombre_XML = datav.nomArchivoXML;

          if(datav.msgAlertas){
            this.openConfirmacionDialog(datav.msgAlertas);
          }

          if(datav.imprime){
            this.modalDetalleObservaciones(datav.resp, datav.cadena + "  Codigo Factura: " +datav.codFactura);

            // si sale imprimir = true, se consume las rutas getDataFactura, enviarFacturaEmail
            this.getDataFacturaParaArmar(datav.codFactura);

            // si sale imprimir = true, se consume las rutas getDataFactura, enviarFacturaEmail
            this.enviarFacturaEmail(datav.codFactura, datav.nomArchivoXML);

            this.toastr.success(datav.resp);
            //this.toastr.success("FACTURA GRABADA CON EXITO ✅");
          }else{
            this.modalDetalleObservaciones(datav.resp, datav.cadena + "  Codigo Factura: " +datav.codFactura);
          }
        },

        error: (err: any) => {
          //this.toastr.warning("OCURRIO ALGO AL GRABAR LA FACTURA");
          console.log(err, errorMessage);
        },
        complete: () => {
          //window.location.reload();
         }
      });
  }

  getDataFacturaParaArmar(codigo_factura:any){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDataFactura/";
    return this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataFactura/' + this.userConn + "/" + codigo_factura + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
         console.log("🚀 ~ FacturaNotaRemisionComponent ~ getDataFacturaParaArmar ~ datav:", datav)
          this.valor_string_QR = datav.cadena_QR;
          this.modalPDFFactura(datav);
        },

        error: (err: any) => {
          this.toastr.warning("NO SE PUDO TRAER INFORMACION DE LA FACTURA😧");

          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }


  enviarFacturaEmail(codigo_factura:any, nombre_XML:any){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDataFactura/";
    return this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataFactura/' + this.userConn + "/" + codigo_factura + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
         console.log("🚀 ~ FacturaNotaRemisionComponent ~ getDataFacturaParaArmar ~ datav:", datav)
         

        },

        error: (err: any) => {
          this.toastr.warning("NO SE PUDO TRAER INFORMACION DE LA FACTURA😧");

          console.log(err, errorMessage);
        },
        complete: () => { }
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
    const dialogRef = this.dialog.open(ModalFormaPagoComponent, {
      width: '450px',
      height: 'auto',
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  modalDetalleObservaciones(obs, obsDetalle) {
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

  modalPDFFactura(data) {
    this.dialog.open(FacturaTemplateComponent, {
      width: 'auto',
      height: 'auto',
      data:{
        valor_PDF: data,
      }
    });
  }

  servicio
}
