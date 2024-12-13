import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalVendedorComponent } from '../../modal-vendedor/modal-vendedor.component';
import { MonedaCatalogoComponent } from '@components/mantenimiento/administracion/moneda/moneda-catalogo/moneda-catalogo/moneda-catalogo.component';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { ModalClienteComponent } from '../../modal-cliente/modal-cliente.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { ModalClienteDireccionComponent } from '../../modal-cliente-direccion/modal-cliente-direccion.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { ModalIvaComponent } from '../../modal-iva/modal-iva.component';
import { VentanaValidacionesComponent } from '../../ventana-validaciones/ventana-validaciones.component';
import { ModalRecargosComponent } from '../../modal-recargos/modal-recargos.component';
import { ItemDetalle } from '@services/modelos/objetos';
import { ModalItemsComponent } from '../../modal-items/modal-items.component';
import { MatrizItemsComponent } from '../../matriz-items/matriz-items.component';
import { MatrizItemsClasicaComponent } from '../../matriz-items-clasica/matriz-items-clasica.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { MonedaServicioService } from '@components/mantenimiento/administracion/moneda/servicio-moneda/moneda-servicio.service';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { ServicioclienteService } from '../../serviciocliente/serviciocliente.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { SaldoItemMatrizService } from '../../matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ModalSaldosComponent } from '../../matriz-items/modal-saldos/modal-saldos.component';
import { CatalogoFacturasComponent } from '../facturas/catalogo-facturas/catalogo-facturas.component';
import { CatalogoFacturasService } from '../facturas/catalogo-facturas/servicio-catalogo-facturas/catalogo-facturas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalSubTotalMostradorTiendasComponent } from './modalSubTotalMostradorTiendas/modalSubTotalMostradorTiendas.component';
import { TranferirMostradorTiendasComponent } from './tranferirMostradorTiendas/tranferirMostradorTiendas.component';
import { ServicioTransfeAProformaService } from '../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { ModalDescuentosTiendaComponent } from './modal-descuentos-tienda/modal-descuentos-tienda.component';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDetalleObserValidacionComponent } from '../../modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { CargarExcelComponent } from '../../cargar-excel/cargar-excel.component';

import pdfFonts from "../../../../../../assets/vfs_fonts.js";
import { fonts } from '../../../../../config/pdfFonts';

import * as XLSX from 'xlsx';
import * as QRCode from 'qrcode';

import pdfMake from "pdfmake/build/pdfmake";
import { saveAs } from 'file-saver';
import { FacturaTemplateComponent } from '../facturas/factura-template/factura-template.component';
import { BuscadorAvanzadoAnticiposComponent } from '@components/uso-general/buscador-avanzado-anticipos/buscador-avanzado-anticipos.component';
import { BuscadorAvanzadoService } from '@components/uso-general/servicio-buscador-general/buscador-avanzado.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts;

@Component({
  selector: 'app-facturacion-mostrador-tiendas',
  templateUrl: './facturacion-mostrador-tiendas.component.html',
  styleUrls: ['./facturacion-mostrador-tiendas.component.scss']
})
export class FacturacionMostradorTiendasComponent implements OnInit {

  public nombre_ventana: string = "docvefacturamos_cufd.vb";
  public ventana: string = "Facturacion Mostrador FEL";
  public detalle = "Doc.fact_mostrador Facturacion Electronica";
  public tipo = "transaccion-docvefacturamos_cufd-POST";

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "inputCatalogoAlmacen":
          this.modalAlmacen();
          break;
        case "inputCatalogoVendedor":
          this.modalVendedor();
          break;
        case "inputCatalogoPrecioVenta":
          this.modalPrecioVentaDetalle();
          break;
        case "inputCatalogoDesctEspecial":
          this.modalDescuentoEspecial();
          break;
        case "inputCatalogoCliente":
          this.modalCatalogoClientes();
          //this.enterCliente();
          break;
        case "inputCatalogoPrecioVentaDetalle":
          this.modalPrecioVentaDetalle();
          break;
        case "inputMoneda":
          this.modalCatalogoMoneda();
          break;
        case "id_factura_input":
          this.modalTipoID();
          break;
          
        case "":
          this.modalCatalogoProductos();
          break;
      }
    }
  };

  @HostListener("document:keydown.enter", []) unloadHandler5(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "inputCatalogoCliente":
          this.mandarCodCliente(this.codigo_cliente);
          break;

        case "input_matriz":
          this.empaqueChangeMatrix('', 0);
          break;

        case "inputClaveSecretaVendedor":
          this.getCodigoVendedor(this.codigo_secreto_vendedor);
          break;
      }
    }
  };

  FormularioData: FormGroup;
  public submitted = false;
  public codigo_cliente: string;

  cliente:any=[];
  documento_identidad: any = [];
  ids_complementar_proforma: any = [];
  array_items_carrito_y_f4_catalogo: any = [];

  dataform: any = '';
  num_idd: any;
  num_id: any;

  // primera barra de arriba
  CUFD: any;
  nrocaja:any;
  cod_control: string;
  codigo_control_get:any;
  codtipo_comprobante_get:any;
  dtpfecha_limite_get:any;
  nrolugar_get:any;
  tipo_get:any;

  // parametros del constructor
  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  //Datos Cliente
  public nombre_cliente: string;
  public nombre_comercial_cliente: string;
  public razon_social: any;
  public nombre_comercial_razon_social: string;
  public nombre_factura: string;
  public tipo_doc_cliente: any;
  public nit_cliente: string;
  public email_cliente: string;
  public email: string;
  public whatsapp_cliente: string;
  public moneda: string;
  public moneda_get_fuction: any = [];
  public tipo_cliente: string = "";
  public parsed: string;
  public longitud_cliente: string;
  public latitud_cliente: string;
  public complemento_ci: string
  public cod_vendedor_cliente: string;
  public codigo_cliente_catalogo_real: string;
  public cod_id_tipo_modal: any = [];
  public venta_cliente_oficina: boolean = false;
  public cliente_habilitado_get: any;
  public condicicion_cliente:any="";

  // Datos TOTALES de footer
  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;
  public total_X_PU: boolean = false;
  public tablaIva: any = [];

  // saldos empaques
  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  public item_obtenido: any = [];
  public codigo_item_catalogo: any = [];
  public data_almacen_local: any = [];
  public empaquesItem: any = [];
  public id_tipo: any = [];
  public almacenes_saldos: any = [];

  public porcen_item: string;
  public cantidad_item_matriz: number;
  public saldoItem: number;
  public empaque_view = false;
  public item:any;
  public empaque_item_codigo: string;
  public empaque_item_descripcion: string;
  public cantidad: string;
  public empaque_descripcion_concat: string;
  // fin saldos empaques

  valor_nit: any;
  fletepor: any;
  transporte:any;
  direccion:any;
  tipo_cambio_moneda_catalogo:any;

  products!: ItemDetalle[];
  selectedProducts: ItemDetalle[] = [];

  //primeraColumna
  hora_fecha_server: any = [];
  almacen_get: any = [];
  almacn_parame_usuario: any = [];
  id_facturas: any = [];
  usuario_creado_save: any = [];
  codigo_secreto_vendedor:number;
  codigo_vendedor:any;
  id_factura:any;
  cta_ingreso:any;
  forma_pago:any;
  forma_pago_descripcion:any;
  documento_nro:any;
  nroticket:string;

  public moneda_get_catalogo: any;
  public contra_entrega = false;
  public almacn_parame_usuario_almacen: any;
  public fecha_actual: any;
  public moneda_base: any = "BS";

  //segundaColumna
  public tarifa_get_unico: any = [];
  public cod_precio_venta_modal: any = [];
  public descuentos_get: any = [];
  public cod_descuento_modal: any = 0;
  public cod_precio_venta_modal_codigo: number;
  public cliente_casual: boolean;

  private debounceTimer: any;
  private unsubscribe$ = new Subject<void>();

  //cuartaColumna
  email_save:any=[];

  //totabilizar
  array_de_descuentos_ya_agregados:any=[];
  recargo_de_recargos:any=[];
  totabilizar_post:any=[];
  item_seleccionados_catalogo_matriz_codigo:any;

  //VALIDACIONES
  validacion_solo_validos: any = [];
  validacion_no_validos: any = [];
  toggleValidacionesAll: boolean = false;
  toggleValidos: boolean = false;
  toggleNoValidos: boolean = false;

  array_original_de_validaciones_NO_VALIDAS: any = [];
  array_original_de_validaciones_NO_VALIDAS_RESUELTAS: any = [];

  array_original_de_validaciones_copied: any = [];
  array_original_de_validaciones_validadas_OK: any = [];
  array_original_de_validaciones_validadas_OK_mostrar: any = [];

  public validacion_post: any = [];

  public valor_formulario_copied_map_all: any = {};
  public tabla_anticipos: any;
  public etiqueta_get_modal_etiqueta: any[] = [];

  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  dataSourceLimiteMaximoVentas = new MatTableDataSource();
  dataSourceWithPageSize_LimiteMaximoVentas = new MatTableDataSource();

  dataSource_validacion = new MatTableDataSource();
  dataSourceWithPageSize_validacion = new MatTableDataSource();

  // NEGATIVOS
  public validacion_post_negativos: any = [];
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];
  
  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;
  // FIN NEGATIVOS

  // MAX VENTAS
  public validacion_post_max_ventas: any = [];
  validacion_post_max_venta_filtrados_si_sobrepasa: any = [];
  validacion_post_max_venta_filtrados_no_sobrepasa: any = [];

  toggleTodosMaximoVentas: boolean = false;
  toggleMaximoVentaSobrepasan: boolean = false;
  toggleMaximoVentasNoSobrepasan: boolean = false;
  selectedRowIndex: number = -1; // Inicialmente ninguna celda está seleccionada
  // FIN MAX VENTAS

  // TAB OBSERVACIONES
  eventosLogs:any=[];
  // FIN TAB OBSERVACIONES

  // TAB COMPLEMENTARIAS
  id_tipo_para_complementar:any;

  // Desct. Promociones
  public desct_nivel_actual: any = "ACTUAL";
  public tarifaPrincipal_value:any;
  public tipo_desct_nivel:any;
  public valor_desct_nivel:any=[];


  // TABS DEL DETALLE PROFORMA
    displayedColumns = ['orden', 'item', 'descripcion', 'medida', 'unidad', 'iva', 'empaque', 'pedido',
      'cantidad', 'sld', 'tp', 'de', 'pul', 'niv', 'porcentaje', 'pd', 'pu', 'total'];
  
    displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
      'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
      'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];
  
    displayedColumnsLimiteMaximoVentas = ['codigo', 'descripcion', 'cantidad_pf_anterior', 'cantidad', 'saldo',
      'porcen_venta', 'cod_desct_esp', 'saldo', 'porcen_maximo', 'cantidad_max_venta', 'empaque_precio', 'obs']
  
    displayedColumns_validacion = ['codControl', 'descripcion', 'valido', 'cod_servicio', 'desct_servicio', 'datoA',
      'datoB', 'clave_servicio', 'resolver', 'detalle_observacion', 'validar'];
    //FIN TABS DEL DETALLE PROFORMA
  //FIN VALIDACIONES

  // Anticipos Contado
  catalogo_anticipos:any=[];
  id_catalogo_anticipos:any;
  numero_id_anticipo:any;
  descrip_id_anticipo:string;
  num_id_anticipo_get_buscador:any;
  monto_anticipo:any;
  // Fin Anticipos Contado

  //varios
  public habilitar_desct_sgn_solicitud: boolean = false;
  tipopago:number;
  proforma_transferida:any=[];
  item_seleccionados_catalogo_matriz_sin_procesar: any = [];
  // valor_string_QR:string;
  nombre_XML:any;
  codigo_factura:any;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(private api: ApiService, private dialog: MatDialog, private _formBuilder: FormBuilder, 
    private datePipe: DatePipe, private spinner: NgxSpinnerService, private log_module: LogService,
    private saldoItemServices: SaldoItemMatrizService, private serviciMoneda: MonedaServicioService,
    private servicioPrecioVenta: ServicioprecioventaService,private servicioDesctEspecial: DescuentoService,
    private servicioCliente: ServicioclienteService, private itemservice: ItemServiceService,private router:Router,
    private servicioTransfeProformaCotizacion: ServicioTransfeAProformaService, private _snackBar: MatSnackBar,
    public nombre_ventana_service: NombreVentanaService, public servicioCatalogoFacturas: CatalogoFacturasService,
    private messageService: MessageService, private almacenservice: ServicioalmacenService, public servicioBuscadorAvanzado: BuscadorAvanzadoService) {    

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.getAlmacenParamUsuario();
    this.getHoraFechaServidorBckEnd();
    //this.getParametrosIniciales();

    this.FormularioData = this.createForm();
    this.tipopago = 0;
  }

  ngOnInit() {
    this.getParamUsuario();
    this.getIDFacturas();
    this.getAlmacen();
    this.getTipoDocumentoIdentidadProforma();
    this.getIDScomplementarProforma();
    this.getTarifa();
    this.getDescuentos();
    this.mandarNombre();
    this.getCatalogoAnticipos();
    this.getTipoDescNivel();
    // this.getAllmoneda();

    // Id Tipo
    this.servicioCatalogoFacturas.disparadorDeIDFacturas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID Tipo Factura: ", data.factura);

      this.id_tipo_para_complementar = data.factura.id;
      this.id_factura = data.factura.id;
     
      //si se cambia de cliente, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacn_parame_usuario_almacen = data.almacen.codigo;

      //si se cambia de almacen, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //

    //Clientes
    this.servicioCliente.disparadorDeClientes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.codigo_cliente = data.cliente.codigo;

      this.getClientByID(data.cliente.codigo);

      //si se cambia de cliente, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //
      
    //Monedas
    this.serviciMoneda.disparadorDeMonedas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Moneda: ", data);
      this.moneda_get_catalogo = data.moneda.codigo;
      this.tipo_cambio_moneda_catalogo = data.tipo_cambio;

      //si se cambia la moneda, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
    });
    // fin_precio_venta

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Descuento: ", data);
      this.cod_descuento_modal = data.descuento;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
    });
    // findescuentos

    //modalClientesDireccion
    this.servicioCliente.disparadorDeDireccionesClientes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Direccion Cliente: ", data);
      this.direccion = data.direccion;
      this.latitud_cliente = data.latitud_direccion;
      this.longitud_cliente = data.longitud_direccion;
      console.log(this.direccion);
    });
    //

    //Item
    this.itemservice.disparadorDeItems.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data.item;
      this.cantidad_item_matriz = data.cantidad;
      
      this.getEmpaqueItem(this.codigo_item_catalogo);
    });
    //

    //Item Sin Procesar DEL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsSeleccionadosSinProcesar.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      //console.log("Recibiendo Item Sin Procesar: ", data);
      this.item_seleccionados_catalogo_matriz_sin_procesar = data;
      this.totabilizar();

      // this.total = 0.00;
      // this.subtotal = 0.00;
      // this.recargos = 0.00;
      // this.des_extra = 0.00;
      // this.iva = 0.00;
    });
    //

    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data_carrito => {
      console.log("Recibiendo Item de Carrito Compra: ", data_carrito);
      console.log("ARRAY COMPLETO DE MATRIZ Y F4: ", this.array_items_carrito_y_f4_catalogo);

      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      } else {
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
         this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      }

      // Agregar el número de orden a los objetos de datos
      const startIndex = this.array_items_carrito_y_f4_catalogo.length - data_carrito.length;

      for (let i = startIndex; i < this.array_items_carrito_y_f4_catalogo.length; i++) {
        const element = this.array_items_carrito_y_f4_catalogo[i];
        element.orden = i + 1;
        if (element.empaque === null) {
          element.empaque = 0;
        }
      }      

      return this.array_items_carrito_y_f4_catalogo;
    });
    //

    //CATALOGO F4 ITEMS
    //ItemElejidoCatalogoF4Procesados
    this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Item Procesados De Catalogo F4: ", data);
      //this.item_seleccionados_catalogo_matriz = data;
      console.log("🚀 ~ ProformaComponent ~ this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe ~ data:", data)

      if (data.length === 0) {
        this.array_items_carrito_y_f4_catalogo.push(...data);
      } else {
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(data);
        // this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
      }

      console.log("ARRAY COMPLETO DE MATRIZ Y F4: ", JSON.stringify(this.array_items_carrito_y_f4_catalogo));
      // siempre sera uno
      // this.orden_creciente = 1;
      // Agregar el número de orden a los objetos de datos
      this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
        element.nroitem = index + 1;
        element.orden = index + 1;
      });

      return this.array_items_carrito_y_f4_catalogo;
    });
    //

    // Servicio de Anticipo Contado Buscador De Anticipos
    this.servicioBuscadorAvanzado.disparadorDeAnticipoSeleccionado.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ this.servicioBuscadorAvanzado.disparadorDeAnticipoSeleccionado.pipe ~ data:", data)
      this.id_catalogo_anticipos = data.id_anticipo
      this.num_id_anticipo_get_buscador = data.num_id_anticipo;
      this.monto_anticipo = data.monto_rest;
    });
    //

    //Proforma Transferida
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Proforma Transferida: ", data.proforma_transferir);
      this.proforma_transferida = data.proforma_transferir;

      this.num_idd = data.proforma_transferir.cabecera.ids_proforma;
      this.num_id = data.proforma_transferir.cabecera.nro_id_proforma;

      this.imprimir_proforma_tranferida(this.proforma_transferida);
    });
    //

    //Factura Transferida
    this.servicioTransfeProformaCotizacion.disparadorDeFacturaTransferir.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Proforma Transferida: ", data);
      this.proforma_transferida = data.proforma_transferir;

      this.imprimir_proforma_tranferida(this.proforma_transferida);
    });
    //

    // Desct. Extras Modal
    this.servicioDesctEspecial.disparadorDeDescuentosMostradorTiendas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Desct. Extras del Modal: ", data);
      this.total = data.resultado_validacion.total;
      this.subtotal = data.resultado_validacion.subtotal;
      this.peso = data.resultado_validacion.peso;
      this.des_extra = data.resultado_validacion.descuento;

      // ESTA LINEA NO BORRAR NI COMENTAR 
      this.array_de_descuentos_ya_agregados = this.getNombreDeDescuentos(data.resultado_validacion.tablaDescuentos);
    });
    // findescuentos

    //SALDOS ITEM PIE DE PAGINA
    this.saldoItemServices.disparadorDeSaldoAlm1.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_1 = data.saldo1;
    });

    this.saldoItemServices.disparadorDeSaldoAlm2.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_2 = data.saldo2;
    });

    this.saldoItemServices.disparadorDeSaldoAlm3.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_3 = data.saldo3;
    });

    this.saldoItemServices.disparadorDeSaldoAlm4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_4 = data.saldo4;
    });

    this.saldoItemServices.disparadorDeSaldoAlm5.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_5 = data.saldo5;
    });
    //FIN SALDOS ITEM PIE DE PAGINA

    //Detalle de item q se importaron de un Excel
    this.itemservice.disparadorDeDetalleImportarExcel.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Detalle de la importacion de Excel: ", data.detalle);
      // Actualizar la fuente de datos del MatTableDataSource después de modificar el array
      this.array_items_carrito_y_f4_catalogo = data.detalle;
      this.array_items_carrito_y_f4_catalogo.map((element) => ({
        ...element,
        empaque: element.empaque === undefined ? 0 : element.empaque,
      }));
      
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
    });
    //

    //this.getDataFacturaParaArmar('', 673950);
  }

  getAlmacenParamUsuario() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
    return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          console.log('data', this.almacn_parame_usuario);
          this.agencia_logueado = datav.codalmacen;

          //this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          //this.cod_descuento_modal_codigo = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getParametrosIniciales() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/principal/getParamIniciales/";
    return this.api.getAll('/principal/getParamIniciales/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.agencia_logueado = datav.codAlmacenUsr;
          this.BD_storage = datav.codempresa;

          console.log('data', this.agencia_logueado);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  getIDFacturas() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/venumeracion/catalogo/";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "1")
      .subscribe({
        next: (datav) => {
          this.id_facturas = datav;
          //this.id_factura = datav[0].id;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen_get = datav;
          // console.log(this.almacen_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.almacen_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // console.log(datav);

          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          this.hora_fecha_server = datav.horaServidor;

          // console.log(this.fecha_actual, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getTarifa() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          // console.log("Precio Venta: ", datav );
          // this.cod_precio_venta_modal_codigo = datav[0].codigo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 1;
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  getDescuentos() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedescuento/catalogo/";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          // console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ getDescuentos ~ descuentos_get:", this.descuentos_get)
          this.cod_descuento_modal = datav[0].codigo;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveDescuentoEspecial(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
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
          this.nrocaja = datav.nrocaja;
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
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY CUFD GENERADO PARA HOY DIA ❌ 🗓️' });
          console.error(err, errorMessage);
        },
        complete: () => { }
      });
  }

  getPorcentajeVentaItem(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inmatriz/infoItemRes/";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + this.agencia_logueado + "/" + item + "/" +
      this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal + "/" + this.codigo_cliente_catalogo_real)
      .subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
          console.log('item seleccionado: ', this.item_obtenido);
          this.porcen_item = this.item_obtenido.porcen_maximo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getParamUsuario() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/docvefacturamos_cufd/getParametrosIniciales/";
    return this.api.getAll('/venta/transac/docvefacturamos_cufd/getParametrosIniciales/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log('data', datav);
          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_descuento_modal = datav.coddescuentodefect;
          this.moneda_get_catalogo = datav.codmoneda;
          this.cod_precio_venta_modal_codigo = datav.codtarifadefect;

          this.forma_pago = datav.codtipopago;
          this.forma_pago_descripcion = datav.codtipopagodescripcion;
          this.fecha_actual = this.datePipe.transform(datav.fecha, 'yyyy-MM-dd');
          this.id_factura = datav.id;
          this.cta_ingreso = datav.idcuenta;
          this.documento_nro = datav.numeroid;
          this.tipo_cambio_moneda_catalogo = datav.tdc;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getCodigoVendedor(codigo_secreto_vendedor) {
    // console.warn(this.codigo_secreto_vendedor);
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/docvefacturamos_cufd/getCodVendedorbyPass/";
    return this.api.getAll('/venta/transac/docvefacturamos_cufd/getCodVendedorbyPass/' + this.userConn + "/" + codigo_secreto_vendedor)
      .subscribe({
        next: (datav) => {
          // console.log('data', datav);
          this.codigo_vendedor = datav.codvendedor;
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'VENDEDOR ENCONTRADO ✅' });
          this.codigo_secreto_vendedor = undefined;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'VENDEDOR NO ENCONTRADO ❌' });
        },
        complete: () => { }
      })
  }

  getCatalogoAnticipos() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -ctsxcob/mant/cotipoanticipo/catalogo/";
    return this.api.getAll('/ctsxcob/mant/cotipoanticipo/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          console.log('Catalogo Anticipos: ', datav);
          this.catalogo_anticipos = datav;
          this.id_catalogo_anticipos = datav.id
          this.descrip_id_anticipo = datav.descripcion
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  codigo_proforma_tranferencia:any;
  imprimir_proforma_tranferida(proforma) {
    console.log(proforma);
    // this.id_tipo_view_get_codigo = this.id_tipo_view_get_codigo;
    // this.id_proforma_numero_id = this.id_proforma_numero_id;
    // this.fecha_actual = proforma.cabecera.fecha;
    // this.tipopago = proforma.cabecera.tipopago;
    // this.medio_transporte = proforma.cabecera.nombre_transporte;
    // this.tipoentrega = proforma.cabecera.tipoentrega;
    // this.central_ubicacion = proforma.cabecera.central;
    // this.obs = proforma.cabecera.obs;
    // this.ubicacion_central = proforma.cabecera.ubicacion;
    // this.preparacion = proforma.cabecera.preparacion;
    // this.codigo_cliente = proforma.cabecera.codcliente_real;
    // this.fecha_actual = this.fecha_actual;
    // this.almacn_parame_usuario = proforma.cabecera.codalmacen;
    // this.venta_cliente_oficina = proforma.cabecera.venta_cliente_oficina;
    // this.nombre_comercial_cliente = proforma.cabecera.nombre_comercial;
    // this.nombre_factura = proforma.cabecera.nombre_fact;
    // this.razon_social = proforma.cabecera.nomcliente;
    // this.nombre_comercial_razon_social = proforma.cabecera.nomcliente;
    // this.tipo_doc_cliente = proforma.cabecera.tipo_docid;
    // this.cliente_casual = proforma.cabecera.casual;
    // this.peso = proforma.cabecera.peso;
    // this.codigo_cliente_catalogo_real = proforma.cabecera.codcliente_real
    // this.cod_vendedor_cliente = proforma.cabecera.codvendedor;
    // this.venta_cliente_oficina = proforma.cabecera.venta_cliente_oficina;
    // this.tipo_cliente = proforma.cabecera.tipo === undefined ? " " : " ";
    // this.whatsapp_cliente = proforma.cabecera.celular;
    // this.latitud_cliente = proforma.cabecera.latitud_entrega;
    // this.longitud_cliente = proforma.cabecera.longitud_entrega;
    // this.whatsapp_cliente = "0";

    
    this.almacn_parame_usuario_almacen = proforma.cabecera.codalmacen;

    this.codigo_cliente = proforma.cabecera.codcliente;
    this.getClientByID(proforma.cabecera.codcliente);
    this.moneda_get_catalogo = proforma.cabecera.codmoneda;
    this.complemento_ci = proforma.cabecera.complemento_ci;
    this.direccion = proforma.cabecera.direccion;
    this.email_cliente = proforma.cabecera.email === "" ? "facturasventas@pertec.com.bo" : proforma.cabecera.email;
    this.fletepor = proforma.cabecera.fletepor;
    this.nit_cliente = proforma.cabecera.nit;
    this.nombre_cliente = proforma.cabecera.nomcliente;
    this.razon_social = proforma.cabecera.nomcliente;
    this.tipo_cambio_moneda_catalogo = proforma.cabecera.tdc;
    this.tipopago = proforma.cabecera.tipopago;
    this.transporte = proforma.cabecera.transporte;
    this.desct_nivel_actual = proforma.cabecera.niveles_descuento;

    this.codigo_proforma_tranferencia = proforma.cabecera.codigo;

    this.subtotal = proforma.cabecera.subtotal;
    this.recargos = proforma.cabecera.recargos;
    this.des_extra = proforma.cabecera.descuentos;
    this.iva = proforma.cabecera.iva;
    this.total = proforma.cabecera.total;

 
    this.array_de_descuentos_ya_agregados = proforma.descuentos;
    this.array_items_carrito_y_f4_catalogo = proforma.detalle;
  } 

  getClientByID(codigo) {
    console.log(codigo);
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vecliente/";
    return this.api.getAll('/venta/mant/vecliente/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          console.log('data', this.cliente);

          this.codigo_cliente = this.cliente.cliente.codigo;
          this.codigo_cliente_catalogo_real = this.cliente.cliente.codigo;
          this.nombre_comercial_cliente = this.cliente.cliente.nombre_comercial;
          this.nombre_factura = this.cliente.cliente.nombre_fact;
          this.razon_social = this.cliente.cliente.razonsocial;
          this.complemento_ci = this.cliente.cliente.complemento_ci
          this.nombre_comercial_razon_social = this.nombre_comercial_cliente;
          
          if(this.cliente.cliente.codigo.startsWith('SN')){
            this.tipo_doc_cliente = undefined;
          }else{
            this.tipo_doc_cliente = this.cliente.cliente.tipo_docid;
          }
          
          this.nit_cliente = this.cliente.cliente.nit_fact;
          this.email_cliente = this.cliente.vivienda.email === "" ? "facturasventas@pertec.com.bo" : this.cliente.vivienda.email;
          this.cliente_casual = this.cliente.cliente.casual;
          this.cliente_habilitado_get = this.cliente.cliente.habilitado;
          // this.nombre_cliente_catalogo_real = this.cliente.cliente.razonsocial;

          this.cod_vendedor_cliente = this.cliente.cliente.codvendedor;
          this.moneda = this.cliente.cliente.moneda;
          this.venta_cliente_oficina = this.cliente.cliente.venta_cliente_oficina;
          this.tipo_cliente = this.cliente.cliente.tipo;

          this.getDireccionCentral(codigo);

          this.direccion = this.cliente.vivienda.direccion;
          this.whatsapp_cliente = this.cliente.vivienda.celular;
          this.latitud_cliente = this.cliente.vivienda.latitud;
          this.longitud_cliente = this.cliente.vivienda.longitud;
          this.condicicion_cliente = this.cliente.cliente.condicion;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Usuario Inexiste! ⚠️' });
        },
        complete: () => {

        }
      })
  }

  getDireccionCentral(cod_cliente) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vetienda/catalogo/";
    return this.api.getAll('/venta/mant/vetienda/catalogo/' + this.userConn + "/" + cod_cliente)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          this.direccion = datav[0].direccion;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTipoDocumentoIdentidadProforma() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTipoDocIdent/";
    return this.api.getAll('/venta/transac/veproforma/getTipoDocIdent/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.documento_identidad = datav;
          console.log(this.documento_identidad);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  getNombreDeDescuentos(array_descuentos) {
    let arry = array_descuentos === undefined ? []:array_descuentos;
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion POST -/venta/transac/veproforma/getDescripDescExtra/";
    return this.api.create('/venta/transac/veproforma/getDescripDescExtra/' + this.userConn, arry)
      .subscribe({
        next: (datav) => {
          // console.log(datav)
          this.array_de_descuentos_ya_agregados = datav.tabladescuentos;
          this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
            ...element,
            descripcion: element?.descrip,
            descrip: element?.descrip
          }));
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIDScomplementarProforma() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + 2)
      .subscribe({
        next: (datav) => {
          this.ids_complementar_proforma = datav;
          // console.log('data', this.ids_complementar_proforma);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDiasControl(item) {
    // this.abrirTabPorLabelFooter("Ultimas Ventas Item 23 Dias");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDiasControl/";
    return this.api.getAll('/venta/transac/veproforma/getDiasControl/' + this.userConn + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          // this.ultimasVentas23Dias(item, datav.diascontrol)
        },

        error: (err: any) => {
          console.log(err, errorMessage);

        },
        complete: () => { }
      })
  }

  detalleProformaCarritoTOExcel() {
    console.log(this.array_items_carrito_y_f4_catalogo);
    // console.log([this.array_items_carrito_y_f4_catalogo].length);
    //aca mapear el array del carrito para que solo esten con las columnas necesarias
    const nombre_archivo = this.id_factura + "_" + this.documento_nro;

    const dialogRefExcel = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿ Desea Exportar El Detalle Del Documento a Excel ?" },
      disableClose: true,
    });


    dialogRefExcel.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // Convertir los datos a una hoja de cálculo
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.array_items_carrito_y_f4_catalogo);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        // Generar el archivo Excel
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Guardar el archivo
        this.saveAsExcelFile(excelBuffer, nombre_archivo);
      } else {
        console.log("El usuario hizo clic en Cancelar.");
      }
    });
  }

  // CARGA EXCEL
  cargarDataExcel() {
    //funcion para traer data de excel abierto dando los datos pestania, celdas
    this.dialog.open(CargarExcelComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const cod_clien = this.codigo_cliente;
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Formato: YYYYMMDDTHHMMSS
    const fullFileName = `${timestamp}_${fileName}_${cod_clien}.xlsx`;

    saveAs(data, fullFileName);
  }
  //FIN Exportar a EXCEL

  limpiar(){
    const dialogRefLimpiara = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ ESTA SEGUR@ DE LIMPIAR LA FACTURA ?" },
      disableClose: true,
    });

    dialogRefLimpiara.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.codigo_secreto_vendedor = undefined;
        this.nroticket = undefined;
    
        this.codigo_cliente = "";
        this.codigo_cliente_catalogo_real = "";
        this.nombre_comercial_cliente = "";
        this.nombre_factura = "";
        this.razon_social = "";
        this.complemento_ci = ""; 
        this.nombre_comercial_razon_social = "";
        
        this.nit_cliente = "facturasventas@pertec.com.bo";
        this.email_cliente = "";
        this.cliente_casual = false;
        this.cliente_habilitado_get = "";
        this.transporte = "";
        // this.nombre_cliente_catalogo_real = this.cliente.cliente.razonsocial;
    
        this.cod_vendedor_cliente = "";
        this.moneda = "";
        this.venta_cliente_oficina = false;
        this.tipo_cliente = "";
    
        this.direccion = "";
        this.whatsapp_cliente = "0";
        this.latitud_cliente = "";
        this.longitud_cliente = "";
        this.condicicion_cliente = "";
        this.transporte = "";
        this.fletepor= "";
        this.direccion = "";
    
        this.num_idd = "";
        this.num_id = "";
    
        this.peso = 0.00;
        this.total = 0.00;
        this.subtotal = 0.00;
        this.des_extra = 0.00;
        this.recargos = 0.00;
    
        this.recargo_de_recargos = [];
        this.array_de_descuentos_ya_agregados = [];
        this.array_items_carrito_y_f4_catalogo = [];
        this.validacion_post = [];
        this.validacion_post_negativos = [];
        this.validacion_post_max_ventas = [];
        
        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'FACTURACION TIENDAS LIMPIO' });
      }
    });
  }

  empaquesCerradosValidacion() {
    this.spinner.show()
    let mesagge: string;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesCerradosVerifica/";
    return this.api.create('/venta/transac/veproforma/empaquesCerradosVerifica/' + this.userConn + "/" + this.codigo_cliente, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          if (datav.cumple === true) {
            mesagge = "CUMPLE";
          } else {
            mesagge = "NO CUMPLE";
          }

          this.modalDetalleObservaciones(datav.reg, mesagge);
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EMPAQUES CERRADOS PROCESANDO ⚙️' });

          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.nroitem = index + 1;
            element.orden = index + 1;
          });

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      })
  }

  empaquesMinimosPrecioValidacion() {
    let mesagge: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesMinimosVerifica/";
    return this.api.create('/venta/transac/veproforma/empaquesMinimosVerifica/' + this.userConn + "/" + this.codigo_cliente + "/" + this.agencia_logueado, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          if (datav.cumple === true) {
            mesagge = "CUMPLE";
          } else {
            mesagge = "NO CUMPLE";
          }

          this.modalDetalleObservaciones(datav.reg, mesagge);
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EMPAQUES MINIMO PROCESANDO ⚙️' });
          
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.nroitem = index + 1;
            element.orden = index + 1;
          });

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
  }

































  get f() {
    return this.FormularioData.controls;
  }

  createForm(): FormGroup {
    let fecha_actual = this.fecha_actual;

    return this._formBuilder.group({
      //data de la primera fila
      nrocaja: [this.dataform.nrocaja, Validators.compose([Validators.required])],
      CUFD: this.dataform.CUFD,
      nroautorizacion: "0",
      codigo_control:this.dataform.codigo_control_get,
      dtpfecha_limite:this.dataform.dtpfecha_limite_get,
      nrolugar:this.dataform.nrolugar_get,

      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: this.dataform.numeroid,
      fechareg: [fecha_actual],
      horareg: this.dataform.horareg,
      hora: this.dataform.hora,
      usuarioreg: this.usuarioLogueado,
      horaaut: this.dataform.horaaut,
      hora_inicial: this.dataform.hora_inicial,
      
      nroticket:this.dataform.nroticket,

      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      fecha: [this.fecha_actual],
      fecha_inicial: [this.dataform.fecha_inicial],
      celular: this.dataform.celular,
      email: [this.dataform.email, Validators.compose([Validators.required])],

      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: this.dataform.descuentos,
      tipopago: [this.dataform.tipopago === 1 ? 1 : 0, Validators.required],
      transporte: [this.dataform.transporte === "" ? "":this.dataform.transporte, Validators.compose([Validators.required])],
      nombre_transporte: "",
      tipo_docid: [this.dataform.tipo_docid, Validators.compose([Validators.required])],
      preparacion: [""],
      tipoentrega: [""],
      fletepor: [this.dataform.fletepor == "" ? "":this.dataform.fletepor, Validators.compose([Validators.required])],

      obs: [""],
      obs2: [""],
      odc: [""],
      ubicacion: [""],
      direccion: [this.dataform.direccion],
      peso: Number(this.peso),
      latitud_entrega: "",
      longitud_entrega: "",

      codbanco: "",
      idcuenta: this.cta_ingreso,
      idfc: this.dataform.idfc === undefined ? "":this.dataform.idfc,
      nroidfc: this.dataform.numeroidfc === undefined ? "":this.dataform.numeroidfc,
      fechalimite: this.datePipe.transform(this.dataform.fechalimite, "yyyy-MM-dd"),   
     
      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],
      fechaaut: ["1900-01-01"],
      fecha_confirmada: ["1900-01-01"],
      hora_confirmada: ["00:00"],
      usuarioaut: [""],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],
      desclinea_segun_solicitud: false, //Descuentos de Linea de Solicitud
      vta_cliente_en_oficina: false,
      tipo_venta: ["0"],

      contra_entrega: this.contra_entrega,
      estado_contra_entrega: [""],

      pago_contado_anticipado: [this.dataform.pago_contado_anticipado === null ? false : this.dataform.pago_contado_anticipado], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      //complementar input
      idFC_complementaria: this.dataform.idfc === undefined ? " " : this.dataform.idfc, //aca es para complemento de proforma
      nroidFC_complementaria: this.dataform.numeroidfc === undefined ? 0 : this.dataform.numeroidfc,

  
      idsoldesctos: "0", // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [0], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024
      tipo_complementopf: [this.dataform.tipo_complementopf], //aca es para complemento de proforma

      // fechaaut_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // subtotal_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // moneda_total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario

      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento

      // no hay mas en esta seccion xD
      subtotal: [this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos], //TOTALES
      des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.dataform.iva], //TOTALES
      total: [this.dataform.total], //TOTALES
      porceniva: [0],

      // nueva data
      codigo_secreto_vendedor: this.dataform.codigo_secreto_vendedor,
      forma_pago:this.dataform.forma_pago,
      cta_ingreso:this.dataform.cta_ingreso,
      documento_nro:this.dataform.documento_nro,

      //anticipos
      idanticipo:this.dataform.idanticipo === undefined ? "" : this.dataform.idanticipo,
      numeroidanticipo: this.dataform.numeroidanticipo === undefined ? "" : this.dataform.numeroidanticipo,
      monto_anticipo: this.dataform.monto_anticipo === undefined ? "" : this.dataform.monto_anticipo,


      // solicitudUrgente
      idpf_solurgente: this.dataform.idpf_solurgente === undefined ? "0" : this.dataform.idpf_solurgente,
      noridpf_solurgente: this. dataform.noridpf_solurgente === undefined ? "0" : this.dataform.noridpf_solurgente,

    });
  }

  // BTN grabar
  async submitData() {
    let total_proforma_concat: any = [];
    // Asegúrate de que las variables estén definidas antes de aplicar el filtro

    if (this.validacion_post && this.validacion_post_negativos) {
      let array_validacion_existe_aun_no_validos = this.validacion_post.filter(element => element.Valido === "NO");
      let array_negativos_aun_existe = this.validacion_post_negativos.filter(element => element.obs === 'Genera Negativo');
    } else {
      console.error('validacion_post o validacion_post_negativos están vacios o todo correcto');
    }

    if (this.total === 0.00) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL TOTAL NO PUEDE SER 0, PARA GRABAR' });
      setTimeout(() => {
        this.spinner.hide();
      }, 50);
    }

    if (this.api.statusInternet === false) {
      const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
        width: '450px',
        height: 'auto',
        data: { mensaje_dialog: "¿ NO TIENE CONEXION A INTERNET ? ⚠️, ESTA PROFORMA SE EXPORTARA EN UN EXCEL, PARA QUE POSTERIORMENTE CONTINUES DANDO CURSO AL PEDIDO" },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          this.detalleProformaCarritoTOExcel();
        }
      });
    }

    const transformedArray = this.validacion_post?.map((validaciones) => ({
      ...validaciones,
      codproforma: 0,
      codservicio: parseInt(validaciones.CodServicio),
      nroitems: parseInt(validaciones.NroItems) || 0,
      subtotal: parseFloat(validaciones.Subtotal) || 0,
      descuentos: parseFloat(validaciones.Descuentos) || 0,
      recargos: parseFloat(validaciones.Recargos) || 0,
      clave_servicio: validaciones.ClaveServicio,
    }));

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
      ...item,
      cantaut: item.cantidad,
      totalaut: item.total,
      obs: item.obs,
      nroitem: item.nroitem,
      id: 0,
    }));

    this.submitted = true;
    let data = [this.FormularioData.value].map((element)=>({
      ...element,
      codcliente_real: this.codigo_cliente,
      numeroid: this.documento_nro,
      documento_nro:this.documento_nro,
      // codcliente_real: this.codigo_cliente_catalogo_real,
      descuentos: this.des_extra,
      transporte:this.transporte === undefined ? "":this.transporte,
      fletepor:this.fletepor === undefined ? "":this.fletepor,
      // idpf_complemento: this.idpf_complemento_view === undefined ? " " : this.idpf_complemento_view, // complemento de complementar proforma
      // nroidpf_complemento: this.input_complemento_view === undefined ? 0 : this.input_complemento_view, // complemento de complementar proforma
      // tipo_complementopf: this.tipo_complementopf_input === undefined ? 3 : this.tipo_complementopf_input,
      // tipo_complementopf: this.tipo_complementopf_input,
      idsoldesctos: "0",
      nrolugar:this.nrolugar_get,
      idcuenta: this.cta_ingreso,
      idfc: this.id_tipo_para_complementar === undefined ? "":this.id_tipo_para_complementar,

      //anticipos
      idanticipo:this.id_catalogo_anticipos === undefined ? "" : this.id_catalogo_anticipos,
      numeroidanticipo: this.num_id_anticipo_get_buscador === undefined ? 0 : this.num_id_anticipo_get_buscador,
      monto_anticipo: this.monto_anticipo === undefined ? 0 : this.monto_anticipo,

      codproforma: this.codigo_proforma_tranferencia === undefined ? 0:this.codigo_proforma_tranferencia,
    }));

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      descripcion: element?.descrip,
      descrip: element?.descrip,
      id: 0,
    }));

    total_proforma_concat = {
      nrocaja: this.nrocaja,
      nrolugar: this.nrolugar_get,
      tipo: this.tipo_get,
      usuario: this.usuarioLogueado,
      cufd: this.CUFD,
      dtpfecha_limite: this.dtpfecha_limite_get.toString(),
      codigo_control: this.cod_control,

      codempresa: this.BD_storage,
      codtipopago: this.forma_pago,
      codtipo_comprobante: this.codtipo_comprobante_get,
      
      codbanco: "",
      nrocheque: "",
      codcuentab: "",
      idcuenta: this.cta_ingreso,
      condicion: this.condicicion_cliente,
      idfactura: this.id_factura,
      factnit: this.nit_cliente,

      complemento_ci: this.complemento_ci,
      factnomb: this.razon_social,

      ids_proforma: this.num_idd === undefined ? "":this.num_idd,
      nro_id_proforma: this.num_id === undefined ? 0:this.num_id,

      niveles_descuento: this.desct_nivel_actual,
      
      cabecera: data[0],
      detalle:this.array_items_carrito_y_f4_catalogo,
      dgvfacturas:[],
      detalleDescuentos_fact: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, // array de desct extra del totalizador
      detalleItemsProf_fact: this.array_items_carrito_y_f4_catalogo,
      detalleRecargos_fact: this.recargo_de_recargos === undefined ? [] : this.recargo_de_recargos, //array de recargos,
      detalleControles_fact:this.validacion_post
    };
    
    this.spinner.show();
    console.log("🚀ESTE ARRAY SE ENVIA AL GRABAR: submitData total_proforma_concat:", total_proforma_concat);
    const url = `/venta/transac/docvefacturamos_cufd/grabarFacturaTienda/${this.userConn}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;
    this.api.create(url, total_proforma_concat).subscribe({
      next: async (datav) => {
        console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ this.api.create ~ datav:", datav);
        this.log_module.guardarLog(this.ventana, "Creacion" + this.totabilizar_post.codProf, "POST", this.id_factura, this.documento_nro);
        this.totabilizar_post = datav;
        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: datav.resp + "✅" });
        //aca los mensajes
        this.openConfirmacionDialog(datav?.cadena[0] === undefined ? "":datav?.cadena[0] +
                                    datav?.cadena[1] === undefined ? "":datav?.cadena[1] + 
                                    datav?.cadena[2] === undefined ? "":datav?.cadena[2] +
                                    datav?.cadena[3] === undefined ? "":datav?.cadena[3] +
                                    datav?.cadena[4] === undefined ? "":datav?.cadena[4]);

        if(datav.msgAlertas.length > 0){
          await this.openConfirmacionDialog(datav.msgAlertas);
          window.location.reload();
        }

        this.eventosLogs = datav.eventosLog;
        this.eventosLogs = this.eventosLogs.map(log => ({ label: log }));
        this.nombre_XML = datav.nomArchivoXML;
        this.codigo_factura = datav.codFactura;

        if(datav.imprime === true){
          // Mandar a Imprimir
          this.mandarAImprimir(datav.codFactura);

          // Mandar Correo
          this.getDataFacturaParaArmar(datav.resp + "\n" + datav.cadena + "\n" +"Codigo Factura: " + datav.codFactura, datav.codFactura);

          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRESION EXITOSA' });
        }else{
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO SE IMPRIMIO, SALIO FALSE EN IMPRIMIR XD' });
        }

        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE GRABO, OCURRIO UN PROBLEMA AL GRABAR !' });
        //this.detalleProformaCarritoTOExcel();
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! PROFORMA GRABADA CON EXITO !' });
      }
    });
  }

  mandarAImprimir(cod_factura){
    const url = `/venta/transac/docvefacturamos_cufd/imprimirFactura/${this.userConn}/${cod_factura}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.getAll(url).subscribe({
      next: (datav) => {
        console.warn("🚀 IMPRIMIENDO...", datav);
      },

      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE GRABO, OCURRIO UN PROBLEMA AL GRABAR !' });
        //this.detalleProformaCarritoTOExcel();
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {}
    });
  }

  async validar() {
    this.totabilizar();

    if (this.nrocaja === undefined){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'LA CAJA NO PUEDE SER 0' });
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
      return;
    };

    if (this.total === 0) {
      this.totabilizar();
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
      return;
    };

    if(this.codigo_vendedor === undefined){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'FALTA CODIGO VENDEDOR' });
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
      return;
    }

    // ACA TRAE TODAS LAS VALIDACIONES QUE SE REALIZAN EN EL BACKEND
    // VACIO - TODOS LOS CONTROLES
    let valor_formulario = [this.FormularioData.value];
    valor_formulario.map((element: any) => {
      if (this.tipopago === 1) {
        element.contra_entrega = false;
        element.estado_contra_entrega = "";
      }

      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: this.razon_social?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente?.toString() || '',
        nomcliente_real: this.razon_social?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        noridanticipo: element.numeroidanticipo?.toString() || '',
        nrocaja:this.nrocaja?.toString(),
        fecha_actual:this.fecha_actual,
        nroticket:this.nroticket,

        desclinea_segun_solicitud: false,
        pago_con_anticipo: false,
        vta_cliente_en_oficina: false,

        contra_entrega: element.contra_entrega === true ? "SI" : "NO",
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "" : element.estado_contra_entrega,

        // footer
        nombre_transporte: "",
        transporte: element.transporte === undefined ? "" : element.transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        latitud: "",
        longitud: "",
        ubicacion: "",
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        // fon footer

        // datos del complemento mayotista - dimediado
        idpf_complemento: element.idpf_complemento,
        nroidpf_complemento: element.nroidpf_complemento?.toString(),
        // fin datos del complemento mayotista - dimediado
        
        tipo_complemento: '0',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        monto_anticipo: element.monto_anticipo,
        nrofactura: "0",
        tipo_cliente: this.tipo_cliente,
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago === 0 ? "CONTADO" : "CREDITO",
        nroidsol_nivel: "0",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "0",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,

        // solicitudesUrgentes
        idpf_solurgente: element.idpf_solurgente === undefined ? "":element.idpf_solurgente,
        noridpf_solurgente: element.noridpf_solurgente?.toString() === undefined ? "0" : element.noridpf_solurgente?.toString(),

        fechalimite_dosificacion: this.datePipe.transform(this.dtpfecha_limite_get, "yyyy-MM-dd"),       
        niveles_descuento: element.niveles_descuento,
        preparacion: "",

        tipo_caja: this.tipo_get,
        nroautorizacion: "",
        idsol_nivel: "",
        version_codcontrol: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
  
        codempresa: this.BD_storage,
        codtipopago: this.tipopago,
      }
    });

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      codcobranza_contado: element.codcobranza_contado === null ? 0 : element.codcobranza_contado,
      codcobranza: element.codcobranza === null ? 0 : element.codcobranza,
      codanticipo: element.codanticipo === null ? 0 : element.codanticipo,
      descripcion: element.descrip,
    }));

    // console.log("Valor Formulario Mapeado: ", this.valor_formulario_copied_map_all);
    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
      detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? []:this.array_de_descuentos_ya_agregados,
      detalleEtiqueta: this.etiqueta_get_modal_etiqueta,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      detalleRecargos: this.recargo_de_recargos,
      detalleControles: this.validacion_post.length > 1 ? this.validacion_post : [],
    };
    console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ validar ~ proforma_validar:", proforma_validar)

    this.submitted = true;
    this.spinner.show();
    this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION EN CURSO ⚙️' });
    const url = `/venta/transac/docvefacturamos_cufd/validarFacturaTienda/${this.userConn}/vacio/factura/validar/${this.BD_storage}/${this.usuarioLogueado}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

    this.api.create(url, proforma_validar).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (datav) => {
        this.validacion_post = datav;
        console.log("INFO VALIDACIONES:", datav);
        let validaciones_valido_NO;
        let validaciones_negativos;
        let validacion_max_venta_sobrepasan;

        this.abrirTabPorLabel("Resultado de Validacion");
        this.dataSource_validacion = new MatTableDataSource(this.validacion_post);

        this.toggleValidacionesAll = true;
        this.toggleValidos = false;
        this.toggleNoValidos = false;

        datav.forEach(element => {
          if(element.Codigo === 60){
            this.validacion_post_negativos = element.Dtnegativos;
            this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
          }

          if(element.Codigo === 58){
            this.validacion_post_max_ventas = element.Dtnocumplen;
            this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
          }
        });

        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'VALIDACION EXITOSA ✅' });

        validaciones_valido_NO = this.validacion_post.filter((element) => {
          return element.Valido === "NO";
        });

        validaciones_negativos = this.validacion_post_negativos.filter((element) => {
          return element.obs === "Genera Negativo";
        });

        validacion_max_venta_sobrepasan = this.validacion_post_max_ventas.filter((element) => {
          return element.obs != "Cumple";
        });

        console.warn("Validaciones NO VALIDAS",validaciones_valido_NO.length, "Validaciones Negativas", validaciones_negativos.length, "Validaciones Maximas:", validacion_max_venta_sobrepasan.length)
        
        if(validaciones_valido_NO.length === 0 ){
          if(validaciones_negativos.length === 0 ){
              this.submitData();
          }else{
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'GENERA NEGATIVOS FAVOR REVISAR' });
          }
        }else{
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'AUN HAY VALIDACIONES QUE REVISAR' });
        }

        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },

      error: (err) => {
        console.log(err, errorMessage);

        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },

      complete: () => {
        this.abrirTabPorLabel("Resultado de Validacion");
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }
    });
  }

  soloValidar(){
    this.totabilizar();
    if (this.nrocaja === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'LA CAJA NO PUEDE SER 0' });
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
      return;
    };

    if (this.total === 0) {
      this.totabilizar();
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
      return;
    };

    if(this.codigo_vendedor === undefined){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'FALTA CODIGO VENDEDOR' });
      setTimeout(() => {
        this.spinner.hide();
      }, 500);
      return;
    }

    // ACA TRAE TODAS LAS VALIDACIONES QUE SE REALIZAN EN EL BACKEND
    // VACIO - TODOS LOS CONTROLES
    let valor_formulario = [this.FormularioData.value];
    valor_formulario.map((element: any) => {
      if (this.tipopago === 1) {
        element.contra_entrega = false;
        element.estado_contra_entrega = "";
      }

      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: this.razon_social?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente?.toString() || '',
        nomcliente_real: this.razon_social?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        noridanticipo: element.numeroidanticipo?.toString() || '',
        nrocaja:this.nrocaja?.toString(),
        fecha_actual:this.fecha_actual,
        nroticket:this.nroticket,

        desclinea_segun_solicitud: false,
        pago_con_anticipo: false,
        vta_cliente_en_oficina: false,

        contra_entrega: element.contra_entrega === true ? "SI" : "NO",
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "" : element.estado_contra_entrega,

        // footer
        nombre_transporte: "",
        transporte: element.transporte === undefined ? "" : element.transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        latitud: "",
        longitud: "",
        ubicacion: "",
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        // fon footer

        // datos del complemento mayotista - dimediado
        idpf_complemento: element.idpf_complemento,
        nroidpf_complemento: element.nroidpf_complemento?.toString(),
        // fin datos del complemento mayotista - dimediado
        
        tipo_complemento: '0',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        monto_anticipo: element.monto_anticipo,
        nrofactura: "0",
        tipo_cliente: this.tipo_cliente,
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago === 0 ? "CONTADO" : "CREDITO",
        nroidsol_nivel: "0",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "0",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,

        // solicitudesUrgentes
        idpf_solurgente: element.idpf_solurgente === undefined ? "":element.idpf_solurgente,
        noridpf_solurgente: element.noridpf_solurgente?.toString() === undefined ? "0" : element.noridpf_solurgente?.toString(),

        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),       
        niveles_descuento: element.niveles_descuento,
        preparacion: "",

        tipo_caja: this.tipo_get,
        nroautorizacion: "",
        idsol_nivel: "",
        version_codcontrol: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
  
        codempresa: this.BD_storage,
        codtipopago: this.tipopago,
      }
    });

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      codcobranza_contado: element.codcobranza_contado === null ? 0 : element.codcobranza_contado,
      codcobranza: element.codcobranza === null ? 0 : element.codcobranza,
      codanticipo: element.codanticipo === null ? 0 : element.codanticipo,
      descripcion: element.descrip,
    }));

    // console.log("Valor Formulario Mapeado: ", this.valor_formulario_copied_map_all);
    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
      detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? []:this.array_de_descuentos_ya_agregados,
      detalleEtiqueta: this.etiqueta_get_modal_etiqueta,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      detalleRecargos: this.recargo_de_recargos,
      detalleControles: this.validacion_post.length > 1 ? this.validacion_post : [],
    };
    console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ validar ~ proforma_validar:", proforma_validar)

    this.submitted = true;
    this.spinner.show();

    this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION EN CURSO ⚙️' });
    const url = `/venta/transac/docvefacturamos_cufd/validarFacturaTienda/${this.userConn}/vacio/factura/validar/${this.BD_storage}/${this.usuarioLogueado}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

    this.api.create(url, proforma_validar).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (datav) => {
        this.validacion_post = datav;
        console.log("INFO VALIDACIONES:", datav);
        let validaciones_valido_NO;
        let validaciones_negativos;
        let validacion_max_venta_sobrepasan;

        this.abrirTabPorLabel("Resultado de Validacion");
        this.dataSource_validacion = new MatTableDataSource(this.validacion_post);

        this.toggleValidacionesAll = true;
        this.toggleValidos = false;
        this.toggleNoValidos = false;

        datav.forEach(element => {
          if(element.Codigo === 60){
            this.validacion_post_negativos = element.Dtnegativos;
            this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
          }

          if(element.Codigo === 58){
            this.validacion_post_max_ventas = element.Dtnocumplen;
            this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
          }
        });

        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION EXITOSA ✅' });
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },

      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ NO SE VALIDÓ, OCURRIÓ UN PROBLEMA !' });
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },

      complete: () => {
        this.abrirTabPorLabel("Resultado de Validacion");
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }
    });
  }

  //SECCION DONDE SE OBTIENE PDF Y SE DIBUJA
  getDataFacturaParaArmar(cadena, codigo_factura:any){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDataFactura/";
    this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataFactura/' + this.userConn + "/" + codigo_factura + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ FacturaNotaRemisionComponent ~ getDataFacturaParaArmar ~ datav:", datav)
          // this.valor_string_QR = datav.cadena_QR;
          // armamos el PDF, se crea, descarga el archivo y se lo envia por email

          if(datav){
            try {
              // ACA SE GENERA EL PDF CON SU ARCHIVO BLOB PARA QUE SE ENVIE POR CORREO ELECTRONICO
              this.descargarPDF(datav);
              
              //await this.openConfirmacionDialog(cadena);
              //await this.modalPDFFactura(datav);
            } catch (error) {
              console.error("Ocurrió un error:", error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema en el proceso' });
            }
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO PASO LA DATA O NO LLEGO' });
          }
        },

        error: (err: any) => {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO SE PUDO TRAER INFORMACION DE LA FACTURA😧' });
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  async getBase64ImageFromURL(url) {
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
  async generateQRCodeBase64(data: string): Promise<string> {
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
    console.log("🚀 ~ FacturaNotaRemisionComponent ~ descargarPDF ~ data:", data_pdf, data_pdf.cabecera);

    // Agregar el número de orden a los objetos de datos
    data_pdf?.detalle.forEach((element, index) => {
      element.nroitem = index + 1;
      element.orden = index + 1;
    });

    try {
      const imageUrl = 'assets/img/logo.png'; // Ruta de tu imagen
      const base64Image = await this.getBase64ImageFromURL(imageUrl);
      // Asegúrate de que el QR ya está generado en qrCodeImage
      const base64QR = await this.generateQRCodeBase64(data_pdf.cadena_QR);

      const id = data_pdf?.cabecera.id;
      const numeroid = data_pdf?.cabecera.numeroid;

      const docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [12, 128, 140, 24],
        info: { title: "FACTURA - PERTEC - PRUEBAS" },
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
                { text: "Tels: 4259660 - 4250800 - Fax: "+ data_pdf.paramEmp.fax, alignment: 'center', fontSize: 6, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: "Cochabamba - Bolivia", alignment: 'center', fontSize: 6, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: data_pdf.paramEmp.sucursal, alignment: 'center', fontSize: 6, bold: true, font: 'Arial', margin:[0, 2, 2, 0] },
                { text: data_pdf.paramEmp.codptovta, alignment: 'center', fontSize: 6, bold: true, font: 'Arial' },
                { text: data_pdf.paramEmp.direccion, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: data_pdf.paramEmp.telefono, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: data_pdf.paramEmp.lugarEmision, alignment: 'center', fontSize: 6, margin:[0, 0, 0, 8], font: 'Arial' },

                { text: " " + data_pdf.paramEmp.lugarFechaHora, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                { text: " " + data_pdf.cabecera.nomcliente, alignment: 'left', fontSize: 8, colSpan: 6, font: 'Tahoma' },
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
                          {text:"00000"+ data_pdf.cabecera.nrofactura, bold: true, alignment: 'left', font: 'Tahoma'}], fontSize: 7, 
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
                        text: this.insertarSaltosDeLinea(data_pdf.cabecera.cuf), 
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
                   { text:data_pdf.cabecera.nit + this.complemento_ci, bold: false}], fontSize: 8, font: 'Tahoma',
                    margin:[0, 0, 56, 0]},
                { text: [{text:"Código Cliente: ", bold: true, alignment: 'right', font: 'Tahoma'}, 
                  { text: data_pdf.cabecera.nit, bold: false, font: 'Tahoma'}], fontSize: 8, margin:[0, 0, 48, 0]},
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
                  { text: 'SUBTOTAL'+ "("+data_pdf.cabecera.codmoneda+")", style: 'tableHeader', alignment: 'right', fontSize: 8,  bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                ],

                ...data_pdf.detalle.map(items => [
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

                [{ text: data_pdf.imp_totalliteral, characterSpacing: 0, margin: [10, 0, 0, 0], bold:true, fontSize: 8, colSpan: 6, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },             
                { text: 'Sub Total'+"(BS): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma'},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: this.subtotal, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '________________________________________________________', margin: [0, 0, 0, 0], colSpan: 6, },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Descuentos'+"(BS): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma'},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: data_pdf.cabecera.descuentos, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '', characterSpacing: 0, margin: [10, 0, 0, 0], bold:true, colSpan: 6 },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },              
                { text: 'Total'+"(BS): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], 
                  colSpan: 2, font: 'Tahoma'},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },             
                { text: data_pdf.cabecera.total, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: [{text:"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS, EL USO ILICITO DE ESTA SERA SANCIONADO PENALMENTE DE ACUERDO A LA LEY \n", 
                  bold:true, fontSize:8, alignment: 'center', font: 'Tahoma' },
                  { text: data_pdf.leyendaSIN + "\n", bold:false, fontSize:6, alignment: 'center', font: 'Tahoma' },
                  {text: data_pdf.cabecera.leyenda + "\n", bold:false, fontSize:6, alignment: 'center', font: 'Tahoma' },
                  {text:"Esta factura se encuentra tambien disponible en el siguiente enlace", bold:false, fontSize:6, font: 'Tahoma' }], characterSpacing: 0, margin: [10, 0, 0, 0], colSpan: 5, alignment: 'center'},
                
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Importe Base Credito Fiscal'+"(BS): ", bold: true, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma'}, 
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }, 
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },             
                { text: data_pdf.cabecera.total, characterSpacing: 0, fontSize:8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

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
                  { text: 'Código WEB: ' + data_pdf.cabecera.codfactura_web, alignment: 'center', fontSize:7, margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma' },
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
            //font: 'Courier',
            margin:[0, 0, 0, 0],
          }
        },
        defaultStyle: {
          fontSize: 12,
          font: 'Arial',
        },
      };
  
      const archivo_pdf = pdfMake.createPdf(docDefinition);
      
      // Llama a la función de envío de email con el Blob del PDF
      archivo_pdf.getBlob((pdfBlob: Blob) => {
        this.enviarFacturaEmail(pdfBlob);  // Llamada a la función con el Blob
      });
      
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
    }
  }
  //FIN SECCION DONDE SE OBTIENE PDF Y SE DIBUJA

  // Función para enviar el PDF
  enviarFacturaEmail(pdfBlob: Blob) {
    console.log("🚀 ~ FacturaNotaRemisionComponent ~ enviarFacturaEmail ~ pdfBlob:", pdfBlob);

    // Crear FormData y agregar el archivo
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, `FACTURA-PERTEC.pdf`);

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
        console.error(err, errorMessage);
      },
      complete: () => {
        console.log("Envio completado");
      }
    });
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










































  mandarCodCliente(cod_cliente) {
    this.total = 0.00;
    this.subtotal = 0.00;

    this.getClientByID(cod_cliente);
  }

  verificarNit() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/transac/prgfacturarNR_cufd/getVerifComunicacionSIN/";
    return this.api.getAll('/venta/transac/veproforma/validarNITenSIN/' + this.userConn +"/"+ this.BD_storage+"/"+this.usuarioLogueado+"/"+this.agencia_logueado+"/"+this.nit_cliente+"/"+this.tipo_doc_cliente)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          if(datav.nit_es_valido === "VALIDO"){
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.nit_es_valido });
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: datav.nit_es_valido });
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  onPaste(event: any) {
    event.preventDefault();
    // También puedes mostrar un mensaje al usuario indicando que el pegado está bloqueado
    alert("EVENTO BLOQUEADO, NO PEGAR");
  }

  setEmailDefault() {
    this.email_cliente = "facturasventas@pertec.com.bo";
  }

  guardarNombreCliente() {
    let cliente_nuevo: any = [];
    let detalle: string = "Nombre Cliente";

    cliente_nuevo = {
      codSN: this.codigo_cliente,
      nomcliente_casual: this.razon_social,
      nit_cliente_casual: this.nit_cliente?.toString(),
      tipo_doc_cliente_casual: this.tipo_doc_cliente?.toString(),
      email_cliente_casual: this.email_cliente === undefined ? this.email : this.email_cliente,
      celular_cliente_casual: this.whatsapp_cliente === undefined ? " " : this.whatsapp_cliente,
      codalmacen: this.agencia_logueado,
      codvendedor: this.cod_vendedor_cliente,
      usuarioreg: this.usuarioLogueado,
    };
    console.log(cliente_nuevo);

    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/crearCliente/";
    return this.api.create('/venta/transac/veproforma/crearCliente/' + this.userConn, cliente_nuevo)
      .subscribe({
        next: (datav) => {
          this.usuario_creado_save = datav;
          console.log(this.usuario_creado_save);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! CLIENTE GUARDADO !' });
          this.log_module.guardarLog(this.ventana, "Creacion" + detalle, "POST", this.razon_social, this.nit_cliente);

          this.modalCatalogoClienteCreado(datav.codcliente);
          this.mandarCodCliente(datav.codcliente);
          this._snackBar.open('!CLIENTE GUARDADO!', '🙍‍♂️', {
            duration: 2000,
           panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }

  guardarCorreo() {
    console.log(this.email_cliente);
    console.log(this.codigo_cliente);

    let data = {
      codcliente: this.codigo_cliente,
      email: this.email_cliente
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: -/venta/transac/veproforma/actualizarCorreoCliente/ --Update";
    return this.api.update('/venta/transac/veproforma/actualizarCorreoCliente/' + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(this.ventana, this.detalle, "PUT", "", "");
          this.email_save = datav;
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '!CORREO GUARDADO 📧!' });
          this.log_module.guardarLog(this.ventana, "Creacion", "POST", "ACTUALIZAR CORREO TIENDA", this.email_cliente);

          this._snackBar.open('!CORREO GUARDADO!', '📧', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {

        }
      })
  }

  transferirProforma() {
    console.log(this.num_idd, this.num_id);

    this.spinner.show()
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/obtProfxModif/";

    return this.api.getAll('/venta/modif/docmodifveproforma/obtProfxModif/' + this.userConn + "/" + this.num_idd + "/" + this.num_id + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TRANSFERENCIA EXITOSA !' });

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! TRANSFERENCIA FALLO ! ❌ ' });
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }

  // eventos de seleccion en la tabla
  onRowSelect(event: any) {
    console.log('Row Selected:', event.data);
    this.updateSelectedProducts();
  }

  onRowSelectForDelete() {
    console.log('Array de Items para eliminar: ', this.selectedProducts);

    // Filtrar el array para eliminar los elementos que están en el array de elementos seleccionados
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return !this.selectedProducts.some(selectedItem =>
        selectedItem.orden === item.orden && selectedItem.coditem === item.coditem);
    });

    // Actualizar el número de orden de los objetos de datos restantes
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

    // Actualizar el origen de datos del MatTableDataSource
    //this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

    // Limpiar el array de productos seleccionados
    this.selectedProducts = [];
  }

  onRowUnselect(event: any) {
    console.log('Row Unselected:', event.data);
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    console.log('Selected Products:', this.selectedProducts);

    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);
    }
  }
  // fin eventos de seleccion en la tabla

  itemDataAll(codigo) {
    this.getSaldoEmpaquePesoAlmacenLocal(codigo);
    this.getEmpaqueItem(codigo);
    this.getSaldoItemSeleccionadoDetalle(codigo);
    this.getAlmacenesSaldos();
    this.getSaldoItem(codigo);
    this.getPorcentajeVentaItem(codigo);

    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";

    this.total = 0.00;
    this.subtotal = 0.00;
    this.iva = 0.00;
    this.des_extra = 0.00;
    this.recargos = 0.00;
  }

  getSaldoEmpaquePesoAlmacenLocal(item) {
    console.log(this.agencia_logueado);
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/pesoEmpaqueSaldo/";
    return this.api.getAll('/inventario/mant/inmatriz/pesoEmpaqueSaldo/' + this.userConn + "/" + this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal + "/" + item + "/" + this.agencia_logueado + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          this.data_almacen_local = datav;
          console.log(this.data_almacen_local);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getEmpaqueItem(item){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .subscribe({
        next: (datav) => {
          this.empaquesItem = datav;
          console.log(this.empaquesItem);
          this.empaque_view = true;
          this.item = item;

          this.empaque_item_codigo = this.empaquesItem.codigo;
          this.empaque_item_descripcion = this.empaquesItem.descripcion;
          this.cantidad = this.empaquesItem.cantidad;

          this.empaque_descripcion_concat = item + "(" + this.empaque_item_codigo + ")" + this.empaque_item_descripcion + "-" + this.cantidad + " | ";
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getSaldoItemSeleccionadoDetalle(item) {
    console.log(item);
    console.log(this.agencia_logueado);
    this.item_seleccionados_catalogo_matriz_codigo = item;

    let agencia_concat = "AG" + this.agencia_logueado;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', this.id_tipo);

          // this.letraSaldos = this.id_tipo[0].resp;
          // this.saldo_variable = this.id_tipo[2];

          // this.dataSource = new MatTableDataSource(this.id_tipo[1]);
          // this.dataSource.paginator = this.paginator;
          // this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          // // LETRA
          // this.id_tipo[1].forEach(element => {
          //   if (element.descripcion === 'Total Saldo') {
          //     this.saldoLocal = element.valor;
          //   }
          // });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacenesSaldos() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCodAlmSlds/";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          console.log("Almacenes: ", this.almacenes_saldos);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.agencia_logueado;
    let array_send={
    agencia:agencia_concat,
    codalmacen: this.agencia_logueado,
    coditem: item,
    codempresa: this.BD_storage,
    usuario: this.usuarioLogueado,
    
    idProforma: this.id_factura?.toString() === undefined ? " ":this.id_factura?.toString(),
    nroIdProforma: this.documento_nro
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.create('/venta/transac/veproforma/getsaldoDetalleSP/' + this.userConn, array_send)
      .subscribe({
        next: (datav) => {
        console.log('data', datav);
        this.id_tipo = datav;
        this.saldoItem = datav.totalSaldo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          
        },
        complete: () => { console.log(this.saldoItem); }
      })
  }

  aplicarPrecioVenta(value) {
    this.total = 0;
    this.subtotal = 0;

    const dialogRefTOTALIZAR = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ DESEA TOTALIZAR LOS ITEM DEL PEDIDO ?, ESTA ACCION PUEDE TOMAR UN TIEMPO" },
      disableClose: true,
    });

    dialogRefTOTALIZAR.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // console.log("LE DIO AL SI hay QUE MAPEAR EL DETALLE CON EL DESCT Y DESPUES HAY Q TOTALIZAR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          codtarifa:value
        }));
    
        this.totabilizar();
      } else {
        // console.log("LE DIO AL NO, NO HAY Q TOTALIZAR, SOLO PINTAR EL NUEVO VALOR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          codtarifa:value
        }));
      }
      return this.array_items_carrito_y_f4_catalogo;
    });
  }

  aplicarDesctEspc(value) {
    this.total = 0.00;
    this.subtotal = 0.00;

    const dialogRefITEM = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ DESEA TOTALIZAR LOS ITEM DEL DETALLE ?, ESTA ACCION PUEDE TOMAR UN TIEMPO" },
      disableClose: true,
    });

    dialogRefITEM.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // console.log("LE DIO AL SI HAY Q TOTALIZAR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          coddescuento:value
        }));
        this.totabilizar();
      } else {
        // console.log("LE DIO AL NO, NO HAY Q TOTALIZAR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          coddescuento:value
        }));
      }
      return this.array_items_carrito_y_f4_catalogo;
    });
  }

  totabilizar() {
    let total_proforma_concat: any = [];

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO HAY ITEMS EN EL DETALLE DE PROFORMA' });
    };

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      empaque: element.empaque === undefined ? 0 : element.empaque,
    }));

    total_proforma_concat = {
      detalleItems: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      descuentosTabla: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, //array de descuentos
      recargosTabla: this.recargo_de_recargos === undefined ? [] : this.recargo_de_recargos, //array de recargos
    };

    console.log("🚀 ~ ProformaComponent ~ totabilizar ~ total_proforma_concat:", total_proforma_concat)
  
    this.spinner.show();
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/docvefacturamos_cufd/totabilizarFact/";
    return this.api.create("/venta/transac/docvefacturamos_cufd/totabilizarFact/" + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado + "/" + this.moneda_get_catalogo+"/"+this.codigo_cliente+"/"+this.almacn_parame_usuario_almacen+"/"+ this.nit_cliente, total_proforma_concat)
      .subscribe({
        next: (datav) => {
          this.totabilizar_post = datav;
          console.log("TOTABILIZAR llegando del backend: ", this.totabilizar_post);
          this.array_de_descuentos_ya_agregados = this.getNombreDeDescuentos(datav.tabla_descuentos);
          //aca se pinta los items con la info q llega del backend
          this.array_items_carrito_y_f4_catalogo = datav.tabla_detalle;

          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TOTALIZADO EXITOSAMENTE !' });
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE TOTALIZO !' });

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          // this.mandarEntregar();
          this.total = this.totabilizar_post.totales?.total;
          this.subtotal = this.totabilizar_post.totales?.subtotal;
          this.recargos = this.totabilizar_post.totales?.recargos;
          this.des_extra = this.totabilizar_post.totales?.descuentos;
          this.iva = this.totabilizar_post.totales?.iva;
          this.peso = Number(this.totabilizar_post.totales?.peso);

          
          this.tablaIva = this.totabilizar_post.tabla_iva;
          
          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.nroitem = index + 1;
            element.orden = index + 1;
          });
        }
      })
  }

  validarProformaSoloMaximoVenta() {
    let validacion_post_max_ventas = [this.FormularioData.value];

    validacion_post_max_ventas.map((element: any) => {
      if (this.tipopago === 1) {
        element.contra_entrega = false;
        element.estado_contra_entrega = "";
      }

      return validacion_post_max_ventas = {
        ...element,
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: this.razon_social?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente?.toString() || '',
        nomcliente_real: this.razon_social?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        noridanticipo: element.numeroidanticipo?.toString() || '',
        nrocaja:this.nrocaja?.toString(),
        fecha_actual:this.fecha_actual,
        nroticket:this.nroticket,

        desclinea_segun_solicitud: false,
        pago_con_anticipo: false,
        vta_cliente_en_oficina: false,

        contra_entrega: element.contra_entrega === true ? "SI" : "NO",
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "" : element.estado_contra_entrega,

        // footer
        nombre_transporte: "",
        transporte: element.transporte === undefined ? "" : element.transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        latitud: "",
        longitud: "",
        ubicacion: "",
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        // fon footer

        // datos del complemento mayotista - dimediado
        idpf_complemento: element.idpf_complemento,
        nroidpf_complemento: element.nroidpf_complemento?.toString(),
        // fin datos del complemento mayotista - dimediado
        
        tipo_complemento: '0',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        monto_anticipo: element.monto_anticipo,
        nrofactura: "0",
        tipo_cliente: this.tipo_cliente,
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago === 0 ? "CONTADO" : "CREDITO",
        nroidsol_nivel: "0",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "0",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,

        // solicitudesUrgentes
        idpf_solurgente: element.idpf_solurgente === undefined ? "":element.idpf_solurgente,
        noridpf_solurgente: element.noridpf_solurgente?.toString() === undefined ? "0" : element.noridpf_solurgente?.toString(),

        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),       
        niveles_descuento: "",
        preparacion: "",

        tipo_caja: this.tipo_get,
        nroautorizacion: "",
        idsol_nivel: "",
        version_codcontrol: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
  
        codempresa: this.BD_storage,
        codtipopago: this.tipopago,
      }
    });

    // boolean que verifica que el formulario este con sus data llenada
    this.submitted = true;

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element)=>({
      ...element,
      empaque: element.empaque === null ? 0:element.empaque,
    }))

    // if (this.FormularioData.valid) {
      console.log("DATOS VALIDADOS");
      this.spinner.show();
      // console.log("Valor Formulario Mapeado: ", this.validacion_post_max_ventas);
      let proforma_validar = {
        datosDocVta: validacion_post_max_ventas,
        detalleAnticipos: [],
        detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? []:this.array_de_descuentos_ya_agregados,
        detalleEtiqueta: this.etiqueta_get_modal_etiqueta,
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
        detalleRecargos: [],
        detalleControles: this.validacion_post.length > 1 ? this.validacion_post : []
      }

      // console.log(proforma_validar);
      const url = `/venta/transac/docvefacturamos_cufd/validarFacturaTienda/${this.userConn}/00058/factura/validar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

      this.api.create(url, proforma_validar).subscribe({
        next: (datav) => {
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION CORRECTA MAX. VENTAS ✅' });
          this.validacion_post_max_ventas = datav[0].Dtnocumplen;
          // console.log(this.validacion_post_max_ventas);

          this.toggleTodosMaximoVentas = true;
          this.toggleMaximoVentaSobrepasan = false;
          this.toggleMaximoVentasNoSobrepasan = false;

          this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        error: (err) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE VALIDO MAX VENTAS, OCURRIO UN PROBLEMA !' });
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          this.abrirTabPorLabel("Limites Venta Maxima");
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
  }

  validarProformaSoloNegativos() {
    let valor_formulario_negativos
    // console.clear();
    // 00060 - VALIDAR SALDOS NEGATIVOS
    let valor_formulario = [this.FormularioData.value];

    valor_formulario.map((element: any) => {
      if (this.tipopago === 1) {
        element.contra_entrega = false;
        element.estado_contra_entrega = "";
      }

      return valor_formulario_negativos = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: this.razon_social?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente?.toString() || '',
        nomcliente_real: this.razon_social?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        noridanticipo: element.numeroidanticipo?.toString() || '',
        nrocaja:this.nrocaja?.toString(),
        fecha_actual:this.fecha_actual,
        nroticket:this.nroticket,

        desclinea_segun_solicitud: false,
        pago_con_anticipo: false,
        vta_cliente_en_oficina: false,

        contra_entrega: element.contra_entrega === true ? "SI" : "NO",
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "" : element.estado_contra_entrega,

        // footer
        nombre_transporte: "",
        transporte: element.transporte === undefined ? "" : element.transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        latitud: "",
        longitud: "",
        ubicacion: "",
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        // fon footer

        // datos del complemento mayotista - dimediado
        idpf_complemento: element.idpf_complemento,
        nroidpf_complemento: element.nroidpf_complemento?.toString(),
        // fin datos del complemento mayotista - dimediado
        
        tipo_complemento: '0',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        monto_anticipo: 0,
        nrofactura: "0",
        tipo_cliente: this.tipo_cliente,
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago === 0 ? "CONTADO" : "CREDITO",
        nroidsol_nivel: "0",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "0",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,
        
        // solicitudesUrgentes
        idpf_solurgente: element.idpf_solurgente === undefined ? 0 : element.idpf_solurgente,
        noridpf_solurgente: element.noridpf_solurgente?.toString(),

        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        niveles_descuento: element.niveles_descuento,
        preparacion: "",        
        tipo_caja: this.tipo_get,
        nroautorizacion: "",
        idsol_nivel: "",
        version_codcontrol: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
  
        codempresa: this.BD_storage,
        codtipopago: this.tipopago,
      }
    });

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element)=>({
      ...element,
      descripcion: element.descrip,
    }))

    // boolean que verifica que el formulario este con sus data llenada
    this.submitted = true;
    // if (this.FormularioData.valid) {
      this.spinner.show();
      // console.log("DATOS VALIDADOS");
      // console.log("Valor Formulario Mapeado: ", valor_formulario_negativos);

      let proforma_validar = {
        datosDocVta: valor_formulario_negativos,
        detalleAnticipos: [],
        detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? []:this.array_de_descuentos_ya_agregados,
        detalleEtiqueta: this.etiqueta_get_modal_etiqueta,
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
        detalleRecargos: [],
        detalleControles: this.validacion_post.length > 1 ? this.validacion_post : [], // ACA SE ENVIAN LAS VALIDACIONES LA PRIMERA VEZ VACIO LUEGO YA CON LA DATA
      }

      console.log(proforma_validar);
      const url = `/venta/transac/docvefacturamos_cufd/validarFacturaTienda/${this.userConn}/00060/factura/validar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;
      this.api.create(url, proforma_validar).subscribe({
        next: (datav) => {
          console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ this.api.create ~ datav:", datav);
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION CORRECTA DE NEGATIVOS ✅' });

          this.toggleTodosNegativos = true;
          this.toggleNegativos = false;
          this.togglePositivos = false;

          this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        error: (err) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE VALIDO NEGATIVOS, OCURRIO UN PROBLEMA !' });
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          this.abrirTabPorLabel("Saldos Negativos");
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
  }

  validarDeUno(validacion_seleccionada){
    console.warn("Hola lola", validacion_seleccionada);

    let valor_formulario = [this.FormularioData.value];
    valor_formulario.map((element: any) => {
      if (this.tipopago === 1) {
        element.contra_entrega = false;
        element.estado_contra_entrega = "";
      }

      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: this.razon_social?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente?.toString() || '',
        nomcliente_real: this.razon_social?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        noridanticipo: element.numeroidanticipo?.toString() || '',
        nrocaja:this.nrocaja?.toString(),
        fecha_actual:this.fecha_actual,
        nroticket:this.nroticket,

        desclinea_segun_solicitud: false,
        pago_con_anticipo: false,
        vta_cliente_en_oficina: false,

        contra_entrega: element.contra_entrega === true ? "SI" : "NO",
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "" : element.estado_contra_entrega,

        // footer
        nombre_transporte: "",
        transporte: element.transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        latitud: "",
        longitud: "",
        ubicacion: "",
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        // fon footer

        // datos del complemento mayotista - dimediado
        idpf_complemento: element.idpf_complemento,
        nroidpf_complemento: element.nroidpf_complemento?.toString(),
        // fin datos del complemento mayotista - dimediado
        
        tipo_complemento: '0',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        monto_anticipo: 0,
        nrofactura: "0",
        tipo_cliente: this.tipo_cliente,
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago === 0 ? "CONTADO" : "CREDITO",
        nroidsol_nivel: "0",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "0",
        desctoespecial: "0",
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
        totrecargos: 0,
        
        // solicitudesUrgentes
        idpf_solurgente: element.idpf_solurgente,
        noridpf_solurgente: element.noridpf_solurgente?.toString(),

        fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        niveles_descuento: element.niveles_descuento,
        preparacion: "",        
        tipo_caja: this.tipo_get,
        nroautorizacion: "",
        idsol_nivel: "",
        version_codcontrol: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
  
        codempresa: this.BD_storage,
        codtipopago: this.tipopago,
      }
    });

    this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element) => ({
      ...element,
      codcobranza_contado: element.codcobranza_contado === null ? 0 : element.codcobranza_contado,
      codcobranza: element.codcobranza === null ? 0 : element.codcobranza,
      codanticipo: element.codanticipo === null ? 0 : element.codanticipo,
      descripcion: element.descrip,
    }));

    // console.log("Valor Formulario Mapeado: ", this.valor_formulario_copied_map_all);
    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleAnticipos: this.tabla_anticipos === undefined ? [] : this.tabla_anticipos,
      detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? []:this.array_de_descuentos_ya_agregados,
      detalleEtiqueta: this.etiqueta_get_modal_etiqueta,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      detalleRecargos: this.recargo_de_recargos,
      detalleControles: [validacion_seleccionada],
    };
    console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ validar ~ proforma_validar:", proforma_validar)

    this.submitted = true;
    this.spinner.show();
    this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION EN CURSO ⚙️' });

    const url = `/venta/transac/docvefacturamos_cufd/validarFacturaTienda/${this.userConn}/vacio/factura/validar/${this.BD_storage}/${this.usuarioLogueado}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

    this.api.create(url, proforma_validar).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (datav) => {
        this.validacion_post = datav;
        console.log("INFO VALIDACIONES:", datav);

        this.abrirTabPorLabel("Resultado de Validacion");
        this.dataSource_validacion = new MatTableDataSource(this.validacion_post);

        this.toggleValidacionesAll = true;
        this.toggleValidos = false;
        this.toggleNoValidos = false;

        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION EXITOSA ✅' });
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },

      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ NO SE VALIDÓ, OCURRIÓ UN PROBLEMA !' });

        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      },

      complete: () => {
        this.abrirTabPorLabel("Resultado de Validacion");
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
      }
    });

















































  }

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    // console.log(tabs);
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  validacionesTodosFilterToggle() {
    this.toggleValidacionesAll = true;
    this.toggleValidos = false;
    this.toggleNoValidos = false;

    this.dataSource_validacion = new MatTableDataSource(this.validacion_post);
  }

  validacionesValidosFilterToggle() {
    this.toggleValidacionesAll = false;
    this.toggleValidos = true;
    this.toggleNoValidos = false;

    this.validacion_solo_validos = this.validacion_post.filter((element) => {
      return element.Valido === "SI";
    });

    this.dataSource_validacion = new MatTableDataSource(this.validacion_solo_validos);
  }

  validacionesNOValidosFilterToggle() {
    this.toggleValidacionesAll = false;
    this.toggleValidos = false;
    this.toggleNoValidos = true;

    this.validacion_no_validos = this.validacion_post.filter((element) => {
      return element.Valido === "NO";
    });

    this.dataSource_validacion = new MatTableDataSource(this.validacion_no_validos);
  }

  negativosTodosFilterToggle() {
    this.toggleTodosNegativos = true;
    this.toggleNegativos = false;
    this.togglePositivos = false;

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
  }

  negativosNegativosFilterToggle() {
    this.toggleTodosNegativos = false;
    this.toggleNegativos = true;
    this.togglePositivos = false;

    this.validacion_post_negativos_filtrados_solo_negativos = this.validacion_post_negativos.filter((element) => {
      return element.obs === "Genera Negativo";
    });

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos_filtrados_solo_negativos);
  }

  negativosPositivosFilterToggle() {
    this.toggleTodosNegativos = false;
    this.toggleNegativos = false;
    this.togglePositivos = true;

    this.validacion_post_negativos_filtrados_solo_positivos = this.validacion_post_negativos.filter((element) => {
      return element.obs === "Positivo";
    });

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos_filtrados_solo_positivos);
  }

  maximoVentasAllFilterToggle() {
    this.toggleTodosMaximoVentas = true;
    this.toggleMaximoVentaSobrepasan = false;
    this.toggleMaximoVentasNoSobrepasan = false;

    this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
  }

  maxmoVentasNOSobrepasanFilterToggle() {
    this.toggleTodosMaximoVentas = false;
    this.toggleMaximoVentaSobrepasan = false;
    this.toggleMaximoVentasNoSobrepasan = true;

    this.validacion_post_max_venta_filtrados_no_sobrepasa = this.validacion_post_max_ventas.filter((element) => {
      return element.obs === "Cumple";
    });

    this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_venta_filtrados_no_sobrepasa);
  }

  maxmoVentasSISobrepasanFilterToggle() {
    this.toggleTodosMaximoVentas = false;
    this.toggleMaximoVentaSobrepasan = true;
    this.toggleMaximoVentasNoSobrepasan = false;

    this.validacion_post_max_venta_filtrados_si_sobrepasa = this.validacion_post_max_ventas.filter((element) => {
      return element.obs != "Cumple";
    });

    this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_venta_filtrados_si_sobrepasa);
  }
  // FIN VALIDACION ALL



  resolverValidacionEnValidar(datoA, datoB, msj_validacion, cod_servicio, element) {
    //En este array ya estan filtrados las validaciones con observacion this.validacion_no_validos.
    console.log(element, this.validacion_no_validos);
    this.array_original_de_validaciones_copied = this.validacion_no_validos;
    const dialogRefEspeciales = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: '450px',
      height: 'auto',
      data: {
        dataA: datoA,
        dataB: datoB,
        dataPermiso: msj_validacion,
        dataCodigoPermiso: cod_servicio,
      },
    });

    dialogRefEspeciales.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        //let a = this.validacion_no_validos.filter(i => i.Codigo !== element.Codigo);

        // Verificar si el elemento ya está presente en el array
        const indice_NO_VALIDAS_RESUELTAS = this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.findIndex(item => item.Codigo === element.Codigo);

        // Si el índice es -1, significa que el elemento no está en el array y se puede agregar
        if (indice_NO_VALIDAS_RESUELTAS === -1) {
          // Agregar el elemento seleccionado al array de NO VALIDAS PERO YA RESUELTAS 
          this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.push(element);
        } else {
          // El elemento ya está presente en el array
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "EL Codigo" + element.Codigo + "ya se encuentra resuelto" });
          console.log('El elemento ya está presente en el array.');
        }
        // Filtrar los elementos de array1 que no están presentes en array2
        const elementosDiferentes = this.validacion_no_validos.filter(item1 => !this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.find(item2 => item1.Codigo === item2.Codigo));

        //UNA VEZ QUE ESTE APROBADO POR LA CONTRASEÑA, MAPEAR LA COPIA DEL ARRAY ORIGINAL
        //(ORIGINAL)this.validacion_post, (COPIA)array_original_de_validaciones_copied 
        //cambiando los valores de Valido NO a Valido SI y el valor de ClaveServicio a "AUTORIZADO" 
        //en caso que se cancele colocar "NO AUTORIZADO",
        //pero solo del elemento seleccionado no de cada item del array

        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.Codigo === element.Codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].ClaveServicio = "AUTORIZADO";
          nuevoArray[indice].Valido = "SI";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }

        this.dataSource_validacion = new MatTableDataSource(elementosDiferentes);

        console.log(this.array_original_de_validaciones_copied);
        console.log("Elemento Resuelto ya eliminado: ", elementosDiferentes);
        console.log("Array de donde se ah tenido que eliminar: ", this.validacion_no_validos);
        console.log("Array de donde se imprime solo las RESUELTAS: ", this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS);
       
        // al array de validacionesOriginal asignarle el array de validaciones q ya esta resueltas array_original_de_validaciones_NO_VALIDAS_RESUELTAS
        this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.forEach(validacionResuelta => {
          // Busca el elemento en el array original por el campo 'Codigo'
          const validacionOriginal = this.validacion_post.find(validacion => validacion.Codigo === validacionResuelta.Codigo);
        
          // Si encuentra una coincidencia, actualiza los datos
          if (validacionOriginal) {
            Object.assign(validacionOriginal, validacionResuelta);  // Mapea los campos del resuelto al original
            console.log("Validación original actualizada:", validacionOriginal); // Mostrar el elemento actualizado
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ CANCELADO !' });
        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.Codigo === element.Codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].ClaveServicio = "NO AUTORIZADO";
          nuevoArray[indice].Valido = "NO";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }
      }
    });
  }

  resolverValidacionEnValidarMensaje(element) {
    console.log(element);
    this.array_original_de_validaciones_copied = this.validacion_no_validos;

    const dialogRefaplicar = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: element.Observacion },
      disableClose: true,
    });

    dialogRefaplicar.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // Verificar si el elemento ya está presente en el array
        const indice_NO_VALIDAS_RESUELTAS = this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.findIndex(item => item.Codigo === element.Codigo);

        // Si el índice es -1, significa que el elemento no está en el array y se puede agregar
        if (indice_NO_VALIDAS_RESUELTAS === -1) {
          // Agregar el elemento seleccionado al array de NO VALIDAS PERO YA RESUELTAS 
          this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.push(element);
        } else {
          // El elemento ya está presente en el array
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "EL Codigo" + element.Codigo + "ya se encuentra resuelto" });
          console.log('El elemento ya está presente en el array.');
        }
        // Filtrar los elementos de array1 que no están presentes en array2
        const elementosDiferentes = this.validacion_no_validos.filter(item1 => !this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.find(item2 => item1.Codigo === item2.Codigo));

        //UNA VEZ QUE ESTE APROBADO POR LA CONTRASEÑA, MAPEAR LA COPIA DEL ARRAY ORIGINAL
        //(ORIGINAL)this.validacion_post, (COPIA)array_original_de_validaciones_copied 
        //cambiando los valores de Valido NO a Valido SI y el valor de ClaveServicio a "AUTORIZADO" 
        //en caso que se cancele colocar "NO AUTORIZADO",
        //pero solo del elemento seleccionado no de cada item del array

        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.Codigo === element.Codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].ClaveServicio = "AUTORIZADO";
          nuevoArray[indice].Valido = "SI";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }

        this.dataSource_validacion = new MatTableDataSource(elementosDiferentes);

        console.log(this.array_original_de_validaciones_copied);
        console.log("Elemento Resuelto ya eliminado: ", elementosDiferentes);
        console.log("Array de donde se ah tenido que eliminar: ", this.validacion_no_validos);
        console.log("Array de donde se imprime solo las RESUELTAS: ", this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS);
        
        // al array de validacionesOriginal asignarle el array de validaciones q ya esta resueltas array_original_de_validaciones_NO_VALIDAS_RESUELTAS
        this.array_original_de_validaciones_NO_VALIDAS_RESUELTAS.forEach(validacionResuelta => {
          // Busca el elemento en el array original por el campo 'Codigo'
          const validacionOriginal = this.validacion_post.find(validacion => validacion.Codigo === validacionResuelta.Codigo);
        
          // Si encuentra una coincidencia, actualiza los datos
          if (validacionOriginal) {
            Object.assign(validacionOriginal, validacionResuelta);  // Mapea los campos del resuelto al original
            console.log("Validación original actualizada:", validacionOriginal); // Mostrar el elemento actualizado
          }
        });
      } else {
        // Encontrar el índice del elemento seleccionado en el array original
        const indice = this.array_original_de_validaciones_copied.findIndex(item => item.Codigo === element.Codigo);
        if (indice !== -1) {
          // Crear una copia del array original
          const nuevoArray = [...this.array_original_de_validaciones_copied];
          // Reemplazar el elemento modificado en su posición original en el nuevo array
          //nuevoArray[indice] = element;
          nuevoArray[indice].ClaveServicio = "NO AUTORIZADO";
          nuevoArray[indice].Valido = "NO";
          // Actualizar el array original con el nuevo array que contiene el elemento modificado
          this.array_original_de_validaciones_copied = nuevoArray;
        }
      }
    });
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  eliminarItemTabla(orden, coditem) {
    console.log(orden, coditem, this.array_items_carrito_y_f4_catalogo);

    // Filtrar el array para eliminar el elemento con el número de orden dado y el código de ítem
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return item.orden !== orden || item.coditem !== coditem;
    });

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

    this.total = 0;
    this.subtotal = 0;

    // Actualizar el origen de datos del MatTableDataSource
    //this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
  }

  onInputChangeMatrix(products: any, value: any) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.empaqueChangeMatrix(products, value);
    }, 500); // 300 ms de retardo
  }

  empaqueChangeMatrix(element: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    console.log(element);
    var d_tipo_precio_desct: string;

    // if (this.precio === true) {
    //   d_tipo_precio_desct = "Precio";
    // } else {
    //   d_tipo_precio_desct = "Descuento"
    // }

    if (element.empaque === null) {
      element.empaque = 0;
    }

    // let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";
    // this.api.getAll('/venta/transac/veproforma/getCantItemsbyEmp/' + this.userConn + "/" + d_tipo_precio_desct + "/" + this.cod_precio_venta_modal_codigo + "/" + element.coditem + "/" + element.empaque)
    //   .subscribe({
    //     next: (datav) => {
    //       console.log(datav);

    //       // Actualizar la cantidad en el elemento correspondiente en tu array de datos
    //       element.empaque = Number(newValue);
    //       element.cantidad = Number(datav.total);
    //       element.cantidad_pedida = Number(datav.total);
    //     },
    //     error: (err: any) => {
    //       console.log(err, errorMessage);
    //     },
    //     complete: () => { }
    //   });
  }

  onInputChange(products: any, value: any) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.pedidoChangeMatrix(products, value);
    }, 2200); // 300 ms de retardo
  }

  pedidoChangeMatrix(element: any, newValue: number) {
    // SI SE USA
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0;
    this.des_extra = 0;
    this.recargos = 0;

    element.cantidad = element.cantidad_pedida;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";
    // let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    // this.total_desct_precio = true;

    // this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
    //   + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + element.coddescuento + "/" + element.cantidad_pedida +
    //   "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/false/" + this.moneda_get_catalogo + "/" + fecha)
    //   .subscribe({
    //     next: (datav) => {
    //       //this.almacenes_saldos = datav;
    //       console.log("Total al cambio de DE en el detalle: ", datav);
    //       // Actualizar la coddescuento en el element correspondiente en tu array de datos
    //       element.coddescuento = Number(datav.coddescuento);
    //       element.preciolista = Number(datav.preciolista);
    //       element.preciodesc = Number(datav.preciodesc);
    //       element.precioneto = Number(datav.precioneto);
    //     },

    //     error: (err: any) => {
    //       console.log(err, errorMessage);
    //     },
    //     complete: () => {
    //     }
    //   });
  }

  onInputChangecantidadChangeMatrix(products: any, value: any) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      // this.cantidadChangeMatrix(products, value);
    }, 500); // 300 ms de retardo
  }

  cantidadChangeMatrix(elemento: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    // let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    // this.total_desct_precio = false;
    this.total_X_PU = true;

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad_pedida +
      "/" + elemento.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + this.fecha_actual)
      .subscribe({
        next: (datav) => {
          //this.almacenes_saldos = datav;
          console.log("Total al cambio de DE en el detalle: ", datav);
          // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
          elemento.coddescuento = Number(datav.coddescuento);
          elemento.preciolista = Number(datav.preciolista);
          elemento.preciodesc = Number(datav.preciodesc);
          elemento.precioneto = Number(datav.precioneto);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      });
  }

  // PRECIO VENTA DETALLE
  TPChangeMatrix(element: any, newValue: number) {
    console.log(element);
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    element.codtarifa = Number(newValue);
    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    // console.log(this.dataSource.filteredData);
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
  }

  // Función que se llama cuando se hace clic en el input
  inputClickedPrecioVenta(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    console.log('Elemento seleccionado:', elemento);
    // this.elementoSeleccionadoPrecioVenta = elemento;

    // this.servicioPrecioVenta.disparadorDePrecioVentaDetalle.subscribe(data => {
    //   console.log("Recibiendo Descuento: ", data);
    //   this.elementoSeleccionadoPrecioVenta.codtarifa = data.precio_venta.codigo;
    // });
  }
  // FIN PRECIO VENTA DETALLE

  onLeaveDescuentoEspecialDetalle(event: any, element) {
    // console.log("Item seleccionado: ", element);
    // // YA NO SE USA

    // let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    // let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    // //desde aca verifica que lo q se ingreso al input sea data que existe en el array de descuentos descuentos_get
    // let entero = Number(this.elementoSeleccionadoDescuento.coddescuento);

    // // Verificar si el valor ingresado está presente en los objetos del array
    // const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);
    // if (!encontrado) {
    //   // Si el valor no está en el array, dejar el campo vacío
    //   event.target.value = 0;
    //   console.log("NO ENCONTRADO VALOR DE INPUT");
    //   this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
    //     + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + "0" + "/" + element.cantidad_pedida +
    //     "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
    //     .subscribe({
    //       next: (datav) => {
    //         //this.almacenes_saldos = datav;
    //         console.log("Total al cambio de DE en el detalle: ", datav);
    //         // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
    //         element.preciolista = Number(datav.preciolista);
    //         element.preciodesc = Number(datav.preciodesc);
    //         element.precioneto = Number(datav.precioneto);
    //         // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    //         console.log(this.dataSource.filteredData);

    //         //this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
    //       },

    //       error: (err: any) => {
    //         console.log(err, errorMessage);
    //       },
    //       complete: () => { }
    //     });
    // } else {
    //   event.target.value = entero;

    //   console.log('Elemento seleccionado:', element);
    //   this.elementoSeleccionadoDescuento = element;

    //   this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
    //     console.log("Recibiendo Precio de Venta: ", data);
    //     this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;

    //     this.total = 0;
    //     this.subtotal = 0;
    //     this.iva = 0
    //     this.des_extra = 0;
    //     this.recargos = 0;
    //   });

    //   //"api/venta/transac/veproforma/getItemMatriz_Anadir/DPD2_Loc_PE/PE/DPD2/35CH1H14/1/301/100/100/300800/0/311/FALSE/BS/2024-04-23"
    //   this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
    //     + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + element.coddescuento + "/" + element.cantidad_pedida +
    //     "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
    //     .subscribe({
    //       next: (datav) => {
    //         //this.almacenes_saldos = datav;
    //         console.log("Total al cambio de DE en el detalle: ", datav);
    //         // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
    //         element.preciolista = Number(datav.preciolista);
    //         element.preciodesc = Number(datav.preciodesc);
    //         element.precioneto = Number(datav.precioneto);
    //         // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    //         console.log(this.dataSource.filteredData);

    //         this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
    //         //this.simularTab();
    //       },

    //       error: (err: any) => {
    //         console.log(err, errorMessage);
    //         //this.simularTab();
    //       },
    //       complete: () => {
    //         //this.simularTab();
    //       }
    //     });
    // }
  }

  // DESCUENTO ESPECIAL DETALLE
  DEChangeMatrix(element: any, newValue: number) {
    // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
    element.coddescuento = Number(newValue);
    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    // console.log(this.dataSource.filteredData);
    // this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
  }

  inputClickedDescuento(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    console.log('Elemento seleccionado:', elemento);
    // this.elementoSeleccionadoDescuento = elemento;

    // this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
    //   console.log("Recibiendo Precio de Venta: ", data);
    //   this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;
    // });
  }
  //FIN DESCUENTO ESPECIAL DETALLE

  calcularTotalCantidadXPU(cantidad_pedida: number, precioneto: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && precioneto !== undefined) {
      if (this.total_X_PU === true) {
        console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ calcularTotalCantidadXPU ~ cantidad_pedida * precioneto:", cantidad_pedida * precioneto)
        return this.formatNumberTotalSub(cantidad_pedida * precioneto);
      } else {
        let cantidadPedida = cantidad_pedida;
        // Realizar cálculos solo si los valores no son undefined
        return this.formatNumberTotalSub(cantidad_pedida * precioneto);
      }
        
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  calcularTotalPedidoXPU(newValue: number, preciolista: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (newValue !== undefined && preciolista !== undefined) {
      // console.log(input);
      let pedido = newValue;
      // Realizar cálculos solo si los valores no son undefined
      //console.log(cantidadPedida, preciolista);
      return pedido * preciolista;
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(formattedNumber);
  }

  // MAT-TAB Desct.Promocion
  getPrecioMayorEnDetalle() {
    let array_cumple:any=[];
    array_cumple = [this.FormularioData.value].map((element)=>({
      ...element,
      cumple: element.cumple === 1 ? true:false
    }));
    console.log("🚀 ~ ProformaComponent ~ array_cumple=[this.FormularioData.value].map ~ array_cumple:", array_cumple)

    let array_post = {
      tabladetalle: this.array_items_carrito_y_f4_catalogo,
      dvta:  array_cumple[0],
    };

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          this.tarifaPrincipal_value = datav.codTarifa;

          console.log(this.tarifaPrincipal_value);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      })
  }

  getTipoDescNivel(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getTipoDescNivel/";
    return this.api.getAll('/venta/transac/veproforma/getTipoDescNivel/' + this.userConn)
      .subscribe({
        next: (datav) => {
        this.valor_desct_nivel = datav;
        console.log("🚀 ~ ProformaComponent ~ getTipoDescNivel ~ datav:", this.valor_desct_nivel)
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      })
  }

  aplicarDescuentoNivel(){
    // en tiendas no hay cliente real ni su descripcion que tendria q ser la razonsocial pero dicen que nop
    // 11-12-2024
    let array_descuentos_nivel = {
      cmbtipo_desc_nivel: this.tipo_desct_nivel === undefined ? "":this.tipo_desct_nivel,
      fechaProf: this.fecha_actual?.toString(),
      codtarifa_main: this.tarifaPrincipal_value,
      codcliente: this.codigo_cliente?.toString(),
      codcliente_real: this.codigo_cliente_catalogo_real?.toString(),
      codclientedescripcion: ""
    };
    console.log("🚀 ~ ProformaComponent ~ aplicarDescuentoNivel ~ array_descuentos_nivel:", array_descuentos_nivel)   

    let mesagge: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/aplicarDescuentoCliente/";
    return this.api.create('/venta/transac/veproforma/aplicarDescuentoCliente/' + this.userConn, array_descuentos_nivel)
      .subscribe({
        next: (datav) => {
          // console.log("Descuento de Nivel: ", datav);
          if(datav.resp){
            this.messageService.add({ severity: 'info', summary: 'Informacion', detail: datav.resp });
          }
          
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err, mesagge);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
  }
  // FIN MAT-TAB Desct.Promocion


































































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

  // CATALOGOS ITEMS
  modalMatrizProductos(): void {
    if (this.codigo_cliente === undefined || this.codigo_cliente === '' || this.razon_social === undefined || this.razon_social === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    if (this.almacn_parame_usuario === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE ALMACEN",
        }
      });
      return;
    }
    
    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        //esta info tarifa ya esta en la matriz xd
        tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        desc_linea_seg_solicitud: "false",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.cod_descuento_modal,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        precio_de_venta: this.cod_precio_venta_modal_codigo,

        id_proforma: this.id_factura,
        num_id_proforma:this.documento_nro,
      }
    });
  }
  
  modalMatrizClasica(): void {
    // Realizamos todas las validaciones
    if (this.moneda_get_catalogo === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE MONEDA",
        }
      });
      return; // Detenemos la ejecución de la función si la validación falla
    }

    if (this.codigo_cliente === undefined || this.codigo_cliente === '' || this.razon_social === undefined || this.razon_social === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    if (this.almacn_parame_usuario === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE ALMACEN",
        }
      });
      return;
    }

    console.log(this.agencia_logueado);
    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsClasicaComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        // esta info tarifa ya esta en la matriz xd
        // tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        // desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        desc_linea_seg_solicitud: "false",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.cod_descuento_modal,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        precio_de_venta: this.cod_precio_venta_modal_codigo,

        id_proforma: this.id_factura,
        num_id_proforma:this.documento_nro,
      }
    });
  }

  modalCatalogoProductos(): void {
    this.dialog.open(ModalItemsComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codalmacen: this.agencia_logueado,
        desc_linea_seg_solicitud: "false",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        descuento_nivel: this.cod_descuento_modal,
      },
    });
  }
  // FIN CATALOGOS ITEMS

  //SECCION DE TOTALES
  modalSubTotal() {
    this.dialog.open(ModalSubTotalMostradorTiendasComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        cod_almacen: this.agencia_logueado,
        cod_moneda: this.moneda_get_catalogo,
        items: this.array_items_carrito_y_f4_catalogo,
        fecha: this.fecha_actual
      },
    });
  }

  modalRecargos() {
    this.dialog.open(ModalRecargosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        // cabecera: this.FormularioData.value,
        // items: this.array_items_carrito_y_f4_catalogo,
        // recargos: this.recargo_de_recargos,
        // des_extra_del_total: this.des_extra,
        // cod_moneda: this.moneda_get_catalogo,
        // tamanio_recargos: a,
        // cliente_real: this.codigo_cliente_catalogo_reald
      },
    });
  }

  modalIva() {
    // console.log(this.tablaIva);
    this.dialog.open(ModalIvaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { 
        tablaIva: this.tablaIva
        },
    });
  }

  modalDescuentosTotales(): void {
    if (this.codigo_cliente === undefined || this.codigo_cliente === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE CLIENTE EN PROFORMA",
        }
      });
      return;
    }

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "NO HAY ITEM'S EN PROFORMA",
        }
      });
      return;
    }

    this.dialog.open(ModalDescuentosTiendaComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        cabecera: this.FormularioData.value,
        contra_entrega: this.contra_entrega,
        items: this.array_items_carrito_y_f4_catalogo,
        recargos_del_total: this.recargos,
        cod_moneda: this.moneda_get_catalogo,
        recargos_array: this.recargo_de_recargos,
        array_de_descuentos_ya_agregados_a_modal: this.array_de_descuentos_ya_agregados,
        codigo_cliente: this.codigo_cliente,
        nit:this.nit_cliente
      }
    });
  }

  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_almacen: cod_almacen,
        cod_item: this.item_seleccionados_catalogo_matriz_codigo,
        posicion_fija: posicion_fija,
        id_proforma: this.id_factura,
        numero_id: this.documento_nro
      },
    });
  }

  modalVendedor(): void {
    this.dialog.open(ModalVendedorComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana"
      }
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { almacen: "almacen" }
    });
  }

  modalCatalogoMoneda(): void {
    this.dialog.open(MonedaCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalPrecioVentaDetalle(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: true }
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      data: { detalle: false }
    });
  }

  modalCatalogoClienteCreado(codcliente): void {
    this.dialog.open(ModalClienteComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana_catalogo",
        codcliente:codcliente
      }
    });
  }

  modalCatalogoClientes(): void {
    this.dialog.open(ModalClienteComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana_catalogo"
      }
    });
  }

  modalClientesparaReferencia(): void {
    this.dialog.open(ModalClienteComponent, {
      width: '700px',
      height: 'auto',
      data: {
        cliente_referencia_proforma: true,
        ventana: "ventana_cliente_referencia"
      }
    });
  }

  modalClientesInfo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ModalClienteInfoComponent, {
      width: 'auto',
      height: '94vh',
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
      data: { codigo_cliente: this.codigo_cliente },
    });
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
  
  modalClientesDireccion(cod_cliente): void {
    this.dialog.open(ModalClienteDireccionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { cod_cliente: cod_cliente },
    });
  }

  modalTipoID(): void {
    this.dialog.open(CatalogoFacturasComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
  
  tranferirModal(): void {
    this.dialog.open(TranferirMostradorTiendasComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalBuscadorAnticipos(){
    this.dialog.open(BuscadorAvanzadoAnticiposComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  // modal con los botones SI / NO 
  openConfirmationDialog(message: string): Promise<boolean> {
    //btn si/no
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
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

  alMenu(){
    const dialogRefLimpiara = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ ESTA SEGUR@ DE SALIR AL MENU PRINCIPAL ?" },
      disableClose: true,
    });


    dialogRefLimpiara.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.router.navigateByUrl('');
      }
    });

  }
  
  // getAlmacenParamUsuario() {
  //   let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
  //   return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
  //     .subscribe({
  //       next: (datav) => {
  //         this.almacn_parame_usuario = datav;
  //         // console.log('data', this.almacn_parame_usuario);

  //         this.almacn_parame_usuario_almacen = datav.codalmacen;
  //         // this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
  //         // this.cod_descuento_modal = this.almacn_parame_usuario.coddescuento;
  //       },
  //       error: (err: any) => {
  //         console.log(err, errorMessage);
  //       },
  //       complete: () => {

  //       }
  //     })
  // }
  
  // getAllmoneda() {
  //   let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
  //   return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
  //     .subscribe({
  //       next: (datav) => {
  //         this.moneda_get_fuction = datav;
  //         // console.log(this.moneda_get_fuction);
  //         const encontrado = this.moneda_get_fuction.some((moneda) => moneda.codigo === 'BS');

  //         if (encontrado) {
  //           console.log("HAY BS")
  //           this.moneda_get_catalogo = "BS";
  //           console.log(encontrado, this.moneda_get_catalogo);
  //           this.getMonedaTipoCambio(this.moneda_get_catalogo);
  //         }
  //       },

  //       error: (err: any) => {
  //         console.log(err, errorMessage);
  //       },
  //       complete: () => { }
  //     })
  // }

  // getMonedaTipoCambio(moneda) {
  //   let moned = moneda;
  //   console.log(moneda);
  //   let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

  //   let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adtipocambio/getmonedaValor/";
  //   return this.api.getAll('/seg_adm/mant/adtipocambio/getmonedaValor/' + this.userConn + "/" + this.moneda_base + "/" + moned + "/" + this.fecha_actual)
  //     .subscribe({
  //       next: (datav) => {
  //         this.tipo_cambio_moneda_catalogo = datav;
  //         // console.log(this.tipo_cambio_moneda_catalogo);
  //         this.tipo_cambio_moneda_catalogo = this.tipo_cambio_moneda_catalogo.valor;
  //       },

  //       error: (err: any) => {
  //         console.log(err, errorMessage);
  //       },
  //       complete: () => { }
  //     })
  // }
}
