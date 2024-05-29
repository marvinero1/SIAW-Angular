import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { veCliente } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicioclienteService } from '../../serviciocliente/serviciocliente.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { ServicioalmacenService } from '../../../inventario/almacen/servicioalmacen/servicioalmacen.service';
import { VendedorService } from '../../serviciovendedor/vendedor.service';
import { TipoidService } from '../../serviciotipoid/tipoid.service';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { ModalIdtipoComponent } from '../../modal-idtipo/modal-idtipo.component';
import { ModalVendedorComponent } from '../../modal-vendedor/modal-vendedor.component';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { MatrizItemsComponent } from '../../matriz-items/matriz-items.component';
import { ModalItemsComponent } from '../../modal-items/modal-items.component';
import { ModalClienteComponent } from '../../modal-cliente/modal-cliente.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { ModalClienteDireccionComponent } from '../../modal-cliente-info/modal-cliente-direccion/modal-cliente-direccion.component';
import { ModalSaldosComponent } from '../../matriz-items/modal-saldos/modal-saldos.component';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { MonedaCatalogoComponent } from '@components/mantenimiento/administracion/moneda/moneda-catalogo/moneda-catalogo/moneda-catalogo.component';
import { MonedaServicioService } from '@components/mantenimiento/administracion/moneda/servicio-moneda/moneda-servicio.service';
import { SaldoItemMatrizService } from '../../matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { VerificarCreditoDisponibleComponent } from '../../verificar-credito-disponible/verificar-credito-disponible.component';
import { AnticiposProformaComponent } from '../../anticipos-proforma/anticipos-proforma.component';
import { ModalEtiquetaComponent } from '../../modal-etiqueta/modal-etiqueta.component';
import { ModalTransfeProformaComponent } from '../../modal-transfe-proforma/modal-transfe-proforma.component';
import { ServicioTransfeAProformaService } from '../../modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { ModalEstadoPagoClienteComponent } from '../../modal-estado-pago-cliente/modal-estado-pago-cliente.component';
import { ModalSubTotalComponent } from '../../modal-sub-total/modal-sub-total.component';
import { ModalRecargosComponent } from '../../modal-recargos/modal-recargos.component';
import { ModalDesctExtrasComponent } from '../../modal-desct-extras/modal-desct-extras.component';
import { RecargoToProformaService } from '../../modal-recargos/recargo-to-proforma-services/recargo-to-proforma.service';
import { VentanaValidacionesComponent } from '../../ventana-validaciones/ventana-validaciones.component';
import { ModalIvaComponent } from '../../modal-iva/modal-iva.component';
import { ModalDetalleObserValidacionComponent } from '../../modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { SubTotalService } from '../../modal-sub-total/sub-total-service/sub-total.service';
import { MatTabGroup } from '@angular/material/tabs';
import { EtiquetaService } from '../../modal-etiqueta/servicio-etiqueta/etiqueta.service';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { ModalDesctDepositoClienteComponent } from '../../modal-desct-deposito-cliente/modal-desct-deposito-cliente.component';
import { AnticipoProformaService } from '../../anticipos-proforma/servicio-anticipo-proforma/anticipo-proforma.service';
import { CargarExcelComponent } from '../../cargar-excel/cargar-excel.component';

import JSZip from 'jszip';
import * as xmljs from 'xml-js';
import { read, writeFileXLSX } from "xlsx";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-proforma',
  templateUrl: './proforma.component.html',
  styleUrls: ['./proforma.component.scss'],
})
export class ProformaComponent implements OnInit, AfterViewInit {

  public nombre_ventana: string = "docveproforma.vb";
  public ventana: string = "Proforma";
  public detalle = "Doc.Proforma";
  public tipo = "transaccion-docveproforma-POST";

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "inputCatalogoIdTipo":
          this.modalTipoID();
          break;
        case "inputCatalogoAlmacen":
          this.modalAlmacen();
          break;
        case "inputCatalogoVendedor":
          this.modalVendedor();
          break;
        case "inputCatalogoPrecioVenta":
          this.modalPrecioVenta();
          break;
        case "inputCatalogoDesctEspecial":
          this.modalDescuentoEspecial();
          break;
        case "inputCatalogoCliente":
          this.modalClientes();
          //this.enterCliente();
          break;
        case "inputCatalogoPrecioVentaDetalle":
          this.modalPrecioVentaDetalle();
          break;
        case "inputMoneda":
          this.modalCatalogoMoneda();
          break;
        case "inputCatalogoDescuentoEspecialDetalle":
          this.modalDescuentoEspecialDetalle();
          break;
        case "inputCatalogoDireccion":
          this.modalClientesDireccion(this.codigo_cliente_catalogo);
          break;

        // case "":
        //   this.modalCatalogoProductos();
        //   break;
      }
    }
  };

  @HostListener("document:keydown.F5", []) unloadHandler2(event: Event) {
    console.log("No se puede actualizar");
    event.preventDefault();
    this.toastr.warning('TECLA DESHABILITADA ⚠️');
  }

  @HostListener("document:keydown.F6", []) unloadHandler4(event: Event) {
    this.modalMatrizProductos();
  }

  @HostListener("document:keydown.enter", []) unloadHandler5(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "inputCatalogoCliente":
          this.mandarCodCliente(this.codigo_cliente);
          break;
      }
    }
  };

  @HostListener("document:keydown.F9", []) unloadHandler6(event: Event) {
    console.log("No se puede en proforma");
    event.preventDefault();
    this.toastr.warning('TECLA DESHABILITADA ⚠️');
  }

  @ViewChild("cod_cliente") myInputField: ElementRef;
  @ViewChild('inputCantidad') inputCantidad: ElementRef;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('tabGroupfooter') tabGroup1: MatTabGroup;

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';

  id_tipo_view_get_array: any = [];
  id_tipo_view_get_array_copied: any = [];
  id_tipo_view_get_first: any = [];
  id_tipo_view_get_first_codigo: any;
  id_tipo_view_get_codigo: string;
  id_proforma_numero_id: number;
  moneda_base: any;

  agencia_logueado: any;
  almacen_get: any = [];
  precio_venta_get_unico: any = [];
  precio_venta_unico_copied: any = [];
  cod_precio_venta_modal: any = [];
  cod_precio_venta_modal_first: any = [];
  cod_precio_venta_modal_codigo: number;


  cod_descuento_modal: any = [];
  cod_descuento_modal_codigo: number = 0;

  cod_descuento_total: any = [];

  descuentos_get: any = [];
  descuentos_get_copied: any = [];
  descuentos_get_unico: any;

  tarifa_get_unico: any = [];
  tarifa_get_unico_copied: any = [];
  cliente: any = [];
  moneda_get: any = [];
  vendedor_get: any = [];
  tarifa_get: any = [];
  descuento_get: any = [];
  precio_venta_get: any = [];
  documento_identidad: any = [];
  empaquesItem: any = [];
  email_save: any = [];
  almacenes_saldos: any = [];
  item_tabla: any = [];
  almacn_parame_usuario: any = [];
  arr: any[] = [];
  itemTabla: any = [];
  cliente_create: any = [];

  item_seleccionados_catalogo_matriz: any = [];
  item_seleccionados_catalogo_matriz_codigo: any;
  item_seleccionados_catalogo_matriz_copied = [];
  item_seleccionados_catalogo_matriz_false: any = [];
  item_seleccionados_catalogo_matriz_sin_procesar: any = [];
  item_seleccionados_catalogo_matriz_sin_procesar_catalogo: any = [];
  array_items_carrito_y_f4_catalogo: any = [];

  id_tipo: any = [];
  usuarioLogueado: any = [];
  usuario_creado_save: any = [];
  data_almacen_local: any = [];
  desct_linea_id_tipo: any = [];
  totabilizar_post: any = [];
  tablaIva: any = [];
  ids_complementar_proforma: any = [];
  array_venta_item_23_dias: any = [];

  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  ubicacion_central: any;
  direccion_central: any;
  userConn: any;
  BD_storage: any;
  orden_creciente: number = 1;
  fecha_actual_empaque: string;

  public cod_cliente_enter;
  public codigo_cliente: string;
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
  public es_contra_entrega: string;
  public latitud_cliente: string;
  public complemento_ci: string
  public cod_vendedor_cliente: string;
  public cod_vendedor_cliente_modal: string;
  public cod_id_tipo_modal_id: string;
  public codigo_cliente_catalogo_real: string;
  public cod_id_tipo_modal: any = [];
  public venta_cliente_oficina: boolean = false;

  public transporte: any;
  public medio_transporte: any;
  public fletepor: any;
  public tipoentrega: any;
  public saldoItem: number;
  public desct_nivel_actual: any = "ACTUAL";

  public codigo_vendedor_catalogo: string;
  public direccion_cen: string;
  public direccion_central_input: string;
  public direccion: string;
  public central_ubicacion: any = [];
  public obs: string;
  public empaque_item_codigo: string;
  public empaque_item_descripcion: string;
  public cantidad: string;
  public empaque_descripcion_concat: string;
  public selected: string = "Credito";
  public tipopago: any;
  public preparacion: any;
  public complementopf: any = 0;
  public disable_input_create: boolean;
  public isDisabled: boolean = true;
  public total_desct_precio: boolean = false;
  public anticipo_button: boolean;
  public cliente_casual: boolean;
  public total_X_PU: boolean = false;
  public disableSelect: any = new FormControl(false);
  public habilitar_desct_sgn_solicitud: boolean = false;
  public empaque_view = false;
  public submitted = false;
  public contra_entrega = false;

  public idpf_complemento_view: any;
  public nroidpf_complemento_view: any;
  public input_complemento_view: any;

  public moneda_get_catalogo: any;
  public moneda_get_array: any = [];
  public tipo_cambio_moneda_catalogo: any;

  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;

  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  veCliente: veCliente[] = [];
  array_ultimas_proformas: any = [];

  public codigo_cliente_catalogo: string;
  public codigo_cliente_catalogo_direccion: string;
  public cliente_catalogo_real: any = [];
  public nombre_cliente_catalogo_real: string;
  public vendedor_cliente_catalogo_real: string;
  public id_solicitud_desct: string;
  public numero_id_solicitud_desct: string;
  public etiqueta_get_modal_etiqueta: [] = [];

  public codigo_item_catalogo: any = [];
  public cantidad_item_matriz: number;
  public recargos_ya_en_array_tamanio: number;
  public URL_maps: string;

  public item_obtenido: any = [];
  porcen_item: string;
  valor_nit: any;


  // arraySacarTotal
  veproforma: any = [];
  veproforma1: any = [];
  veproforma_valida: any = [];
  veproforma_anticipo: any = [];
  vedesextraprof: any = [];
  verecargoprof: any = [];
  veproforma_iva: any = [];

  proforma_transferida: any = [];
  cotizacion_transferida: any = [];
  recargo_de_recargos: any = [];
  messages: any = [];
  array_de_descuentos_ya_agregados: any = [];

  valorPredeterminadoPreparacion = "NORMAL";
  valorPredeterminadoTipoPago = "CONTADO";
  selectedRowIndex: number = -1; // Inicialmente ninguna celda está seleccionada

  elementoSeleccionadoPrecioVenta: any;
  elementoSeleccionadoDescuento: any;

  monto_anticipo: number = 0;

  //VALIDACIONES TODOS, NEGATIVOS, MAXIMO VENTA
  public validacion_post: any = [];
  public valor_formulario: any = [];
  public validacion_post_negativos: any = [];
  public validacion_post_max_ventas: any = [];

  public valor_formulario_copied_map_all: any = {};
  public valor_formulario_negativos: any = {};
  public valor_formulario_max_venta: any = {};

  public negativos_validacion: any = [];
  public maximo_validacion: any = [];
  public tabla_anticipos: any = [];

  public tipo_complementopf_input: number = 0;

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

  //TABS DEL FOOTER PROFORMA
  displayedColumns_ultimas_proformas = ['id', 'numero_id', 'cod_cliente', 'cliente_real',
    'nombre_cliente', 'nit', 'fecha', 'total', 'item', 'aprobada', 'transferida']

  displayedColumns_venta_23_dias = ['item', 'codproforma', 'id', 'numero_id', 'cod_cliente', 'cod_cliente_real', 'nom_cliente',
    'nit', 'fecha', 'total', 'cantidad', 'moneda', 'aprobada', 'transferida'];

  displayedColumns_precios_desct = ['codproforma', 'id', 'numero_id', 'cod_cliente', 'cod_cliente_real', 'nom_cliente',
    'nit', 'fecha', 'total', 'item', 'cantidad', 'moneda', 'aprobada'];
  //TABS DEL FOOTER PROFORMA

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  dataSource_precios_desct = new MatTableDataSource();
  dataSourceWithPageSize_precios_desct = new MatTableDataSource();

  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  dataSourceLimiteMaximoVentas = new MatTableDataSource();
  dataSourceWithPageSize_LimiteMaximoVentas = new MatTableDataSource();

  dataSource_validacion = new MatTableDataSource();
  dataSourceWithPageSize_validacion = new MatTableDataSource();

  dataSourceUltimasProformas = new MatTableDataSource();
  dataSourceWithPageSize_UltimasProformas = new MatTableDataSource();

  dataSource__venta_23_dias = new MatTableDataSource();
  dataSourceWithPageSize__venta_23_dias = new MatTableDataSource();

  decimalPipe: any;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private almacenservice: ServicioalmacenService,
    private serviciovendedor: VendedorService, private servicioPrecioVenta: ServicioprecioventaService,
    private datePipe: DatePipe, private serviciMoneda: MonedaServicioService, private subtotal_service: SubTotalService,
    private _formBuilder: FormBuilder, private servicioDesctEspecial: DescuentoService, private serviciotipoid: TipoidService,
    private toastr: ToastrService, private spinner: NgxSpinnerService, private log_module: LogService, private saldoItemServices: SaldoItemMatrizService,
    private _snackBar: MatSnackBar, private servicioTransfeProformaCotizacion: ServicioTransfeAProformaService,
    private servicio_recargo_proforma: RecargoToProformaService, private servicioEtiqueta: EtiquetaService,
    private anticipo_servicio: AnticipoProformaService, public nombre_ventana_service: NombreVentanaService) {

    this.decimalPipe = new DecimalPipe('en-US');
    this.FormularioData = this.createForm();

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    console.log(this.BD_storage);

    this.api.getRolUserParaVentana(this.usuarioLogueado, this.nombre_ventana);
    this.mandarNombre();

    if (this.agencia_logueado === 'Loc') {
      this.agencia_logueado = '311'
    }

    this.disableSelect.value = false;
    console.log("Valor del Disabled:", this.disableSelect.value);
  }

  ngOnInit() {
    this.getDesctLineaIDTipo();
    this.tipopago = 1;
    this.transporte = "FLOTA";
    this.fletepor = "CLIENTE";

    //ID TIPO
    this.serviciotipoid.disparadorDeIDTipo.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.cod_id_tipo_modal = data.id_tipo;
      this.cod_id_tipo_modal_id = this.cod_id_tipo_modal.id;

      //si se cambia el tipoID, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      //this.almacn_parame_usuario = data.almacen.codigo;

      //si se cambia de almacen, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //

    //Vendedor
    this.serviciovendedor.disparadorDeVendedores.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_vendedor_cliente_modal = data.vendedor;

      //si se cambia de vendedor, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //finvendedor

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
      this.tipoentrega = "";
    });
    // fin_precio_venta

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.subscribe(data => {
      console.log("Recibiendo Descuento: ", data);
      this.cod_descuento_modal = data.descuento;
      this.cod_descuento_modal_codigo = this.cod_descuento_modal.codigo;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
      this.tipoentrega = "";
    });
    // findescuentos

    //Item
    this.itemservice.disparadorDeItems.subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data.item;
      this.cantidad_item_matriz = data.cantidad;
      //this.getEmpaqueItem(this.codigo_item_catalogo);
    });
    //

    //Item Sin Procesar DEL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsSeleccionadosSinProcesar.subscribe(data => {
      //console.log("Recibiendo Item Sin Procesar: ", data);
      this.item_seleccionados_catalogo_matriz_sin_procesar = data;
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //

    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.subscribe(data_carrito => {
      console.log("Recibiendo Item de Carrito Compra: ", data_carrito);
      console.log("ARRAY COMPLETO DE MATRIZ Y F4: ", this.array_items_carrito_y_f4_catalogo);

      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      } else {
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(data_carrito);
      }

      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);

      // Agregar el número de orden a los objetos de datos
      this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
        element.orden = index + 1;
      });

      // Actualizar la fuente de datos del MatTableDataSource después de modificar el array
      this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
    });
    //

    //CATALOGO F4 ITEMS
    //ItemElejidoCatalogoF4Procesados
    this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.subscribe(data => {
      console.log("Recibiendo Item Procesados De Catalogo F4: ", data);
      this.item_seleccionados_catalogo_matriz = data;

      if (this.item_seleccionados_catalogo_matriz.length > 0) {
        this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
      } else {
        this.array_items_carrito_y_f4_catalogo.push(this.item_seleccionados_catalogo_matriz);
      }

      console.log("ARRAY COMPLETO DE MATRIZ Y F4: " + this.array_items_carrito_y_f4_catalogo);

      //siempre sera uno
      this.orden_creciente = 1;

      // Agregar el número de orden a los objetos de datos
      this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
        element.orden = index + 1;
      });

      //ACA SE DIBUJA LA TABLA CON LA INFO DEL CARRITO DE COMPRAS YA CON LOS ITEM TRABAJADOS EN EL BACKEND
      this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
      this.inputCantidad.nativeElement.focus();
    });
    //

    //ItemSinProcesarCatalogoF4
    this.itemservice.disparadorDeItemsCatalogo.subscribe(data => {
      console.log("Recibiendo Item Sin Procesar de Catalogo F4: ", data);
      this.item_seleccionados_catalogo_matriz_sin_procesar_catalogo = data;

      this.ponerFocoEnInput();
    });
    //FIN CATALOGO F4 ITMES

    //trae el subtotal de la ventana modal subtotal
    this.subtotal_service.disparadorDeSubTotal.subscribe(data => {
      console.log("Recibiendo SubTotal del Modal SubTotal: ", data);
      this.subtotal = data.subtotal;
    });
    //fin del servicio de subtotal

    //Etiqueta
    this.servicioEtiqueta.disparadorDeEtiqueta.subscribe(data => {
      console.log("Recibiendo Etiqueta: ", data);
      this.etiqueta_get_modal_etiqueta = data.etiqueta;
    });
    //fin Etiqueta

    //ItemProcesarSubTotal
    this.itemservice.disparadorDeItemsSeleccionadosProcesadosdelSubTotal.subscribe(data => {
      console.log("Recibiendo Item Procesados del SubTotal: ", data.concat(this.item_seleccionados_catalogo_matriz_sin_procesar_catalogo));
      // this.item_seleccionados_catalogo_matriz = data.concat(this.item_seleccionados_catalogo_matriz_sin_procesar_catalogo);
      // this.dataSource = new MatTableDataSource(this.item_seleccionados_catalogo_matriz);

      // //concatenar el array de la matriz con el del catalogo, asi todos los pedidos llegan al mismo array
      // console.log(this.item_seleccionados_catalogo_matriz);//aca el item solito que se eligio en el catalogo
      // this.infoItemTotalSubTotal(this.item_seleccionados_catalogo_matriz_sin_procesar_catalogo);
    });
    //

    //Detalle de item q se importaron de un Excel
    this.itemservice.disparadorDeDetalleImportarExcel.subscribe(data => {
      console.log("Recibiendo Detalle de la importacion de Excel: ", data.detalle);
      this.array_items_carrito_y_f4_catalogo = data.detalle;
      // Actualizar la fuente de datos del MatTableDataSource después de modificar el array
      this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //

    //Clientes
    this.servicioCliente.disparadorDeClientes.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.codigo_cliente_catalogo = data.cliente.codigo;

      this.getClientByID(this.codigo_cliente_catalogo);
      this.getDireccionCentral(data.cliente.codigo);

      //si se cambia de cliente, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //

    //modalClientesDireccion
    this.servicioCliente.disparadorDeDireccionesClientes.subscribe(data => {
      console.log("Recibiendo Direccion Cliente: ", data);
      this.codigo_cliente_catalogo_direccion = data.direccion;
      console.log(this.codigo_cliente_catalogo_direccion);
    });
    //

    //modalClientesParaSeleccionarClienteReal
    this.servicioCliente.disparadorDeClienteReal.subscribe(data => {
      console.log("Recibiendo Direccion Cliente Real: ", data);
      this.cliente_catalogo_real = data.cliente;
      this.codigo_cliente_catalogo_real = data.cliente.codigo;
      this.nombre_cliente_catalogo_real = data.cliente.nombre;
      //this.vendedor_cliente_catalogo_real = data.cliente.codvendedor;
      this.cod_vendedor_cliente = data.cliente.codvendedor;
      console.log(this.codigo_cliente_catalogo_real);
    });
    //

    //Monedas
    this.serviciMoneda.disparadorDeMonedas.subscribe(data => {
      console.log("Recibiendo Moneda: ", data);
      this.moneda_get_catalogo = data.moneda;
      this.tipo_cambio_moneda_catalogo = data.tipo_cambio;

      //si se cambia la moneda, los totales tambien se cambian
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
      this.tipoentrega = "";
    });
    //

    //Proforma Transferida
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.subscribe(data => {
      console.log("Recibiendo Proforma Transferida: ", data);
      this.proforma_transferida = data.proforma_transferir;

      this.imprimir_proforma_tranferida(this.proforma_transferida);
    });
    //

    //Cotizacion Transferida
    this.servicioTransfeProformaCotizacion.disparadorDeCotizacionTransferir.subscribe(data => {
      console.log("Recibiendo Cotizacion Transferida: ", data);
      this.cotizacion_transferida = data.cotizacion_transferir;
      this.imprimir_cotizacion_transferida(this.cotizacion_transferida);
    });
    //

    //SALDOS ITEM PIE DE PAGINA
    this.saldoItemServices.disparadorDeSaldoAlm1.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_1 = data.saldo1;
    });

    this.saldoItemServices.disparadorDeSaldoAlm2.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_2 = data.saldo2;
    });

    this.saldoItemServices.disparadorDeSaldoAlm3.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_3 = data.saldo3;
    });

    this.saldoItemServices.disparadorDeSaldoAlm4.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_4 = data.saldo4;
    });

    this.saldoItemServices.disparadorDeSaldoAlm5.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_5 = data.saldo5;
    });
    //FIN SALDOS ITEM PIE DE PAGINA

    //disparador que trae los descuentos del ModalDesctExtrasComponent de los totales
    this.servicioDesctEspecial.disparadorDeDescuentosDelModalTotalDescuentos.subscribe(data => {
      console.log("Recibiendo Descuento De los Totales: ", data);
      this.cod_descuento_total = data.desct_proforma;
      this.total = data.resultado_validacion.total;
      this.subtotal = data.resultado_validacion.subtotal;
      this.peso = data.resultado_validacion.peso;
      this.des_extra = data.resultado_validacion.descuento;
      // this.array_de_descuentos_ya_agregados
      this.array_de_descuentos_ya_agregados = data.tabla_descuento;

      this.array_de_descuentos_ya_agregados = data.resultado_validacion.tablaDescuentos
    });
    //finDisparador

    //RECARGOS
    this.servicio_recargo_proforma.disparadorDeRecargo_a_Proforma.subscribe(data => {
      console.log("Recibiendo Recargo : ", data.recargo_array, data.resultado_validacion, data.resultado_validacion_tabla_recargos);

      console.log("array mapeado para concatenarlo a verecargoprof en el totalizar: ", data.resultado_validacion_tabla_recargos)
      //this.recargo_de_recargos = data.recargo_array;
      this.recargos_ya_en_array_tamanio = data.recargo_array.length;
      this.total = data.resultado_validacion.total,
        this.peso = data.resultado_validacion.peso,
        this.subtotal = data.resultado_validacion.subtotal,
        this.recargos = data.resultado_validacion.recargo,
        this.recargo_de_recargos = data.resultado_validacion_tabla_recargos
    });
    //FIN DE RECARGOS

    //ventana anticipos de proforma // mat-tab Anticipo Venta
    this.anticipo_servicio.disparadorDeTablaDeAnticipos.subscribe(data => {
      console.log("Recibiendo Tabla de Anticipos Agregados: ", data);
      this.tabla_anticipos = data.anticipos;
      this.monto_anticipo = data.totalAnticipo;
      console.log(this.tabla_anticipos);
    });
    //fin ventana anticipos de proforma // mat-tab Anticipo Venta
  }

  ngAfterViewInit() {
    this.getIdTipo();
    this.getAlmacen();
    this.getAlmacenParamUsuario();
    this.getVendedorCatalogo();

    this.getTarifa();
    this.getDescuentos();
    this.getAllmoneda();

    this.getTipoDocumentoIdentidadProforma();
    this.getDescuento();
    this.tablaInicializada();
    this.getIDScomplementarProforma();


  }

  onNoClick(event: Event): void {
    event.preventDefault();
  }

  ponerFocoEnInput() {
    this.inputCantidad.nativeElement.focus();
  }

  tablaInicializada() {
    this.orden_creciente = 0;
    this.item_seleccionados_catalogo_matriz_false = Array(35).fill({}).map(() => ({
      coditem: " ",
      descripcion: " ",
      medida: " ",
      udm: " ",
      porceniva: undefined,
      cantidad_pedida: undefined,
      cantidad: undefined,
      porcen_mercaderia: undefined,
      codtarifa: undefined,
      coddescuento: undefined,
      preciolista: undefined,
      niveldesc: " ",
      porcendesc: undefined,
      preciodesc: undefined,
      precioneto: undefined,
      total: undefined,
      cumple: false,
      nroitem: undefined,
      porcentaje: undefined,
      monto_descto: undefined,
      subtotal_descto_extra: undefined
    }));

    this.dataSource = new MatTableDataSource(this.item_seleccionados_catalogo_matriz_false);
    let validacion = [{
      codControl: '',
      descripcion: '',
      valido: '',
      cod_servicio: '',
      desct_servicio: '',
      datoA: '',
      datoB: '',
      clave_servicio: '',
      resolver: '',
      detalle_observacion: '',
      validar: '',
    }]

    this.dataSource_validacion = new MatTableDataSource(validacion);
  }

  createForm(): FormGroup {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    console.log(this.tipo_complementopf_input, this.input_complemento_view);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;
    let fecha_actual = new Date();
    let valor_cero: number = 0;

    // if(this.tipo_complementopf_input === 0) {
    //   this.dataform.tipo_complementopf === tipo_complementopf_val0;
    // }

    if (this.input_complemento_view === null) {
      this.input_complemento_view = valor_cero;
    }

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      fecha: [fecha_actual],
      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: [this.dataform.des_extra, Validators.compose([Validators.required])],
      tipopago: [this.dataform.tipopago === 0 ? 0 : 1, Validators.required],
      transporte: [this.dataform.transporte === "FLOTA", Validators.required],
      nombre_transporte: [this.dataform.nombre_transporte, Validators.compose([Validators.required])],
      tipo_docid: [this.dataform.tipo_docid, Validators.compose([Validators.required])],
      preparacion: [this.dataform.preparacion, Validators.compose([Validators.required])],
      tipoentrega: [this.dataform.tipoentrega === undefined ? "ENTREGAR" : this.dataform.tipoentrega, Validators.compose([Validators.required])],
      fletepor: [this.dataform.fletepor === "CLIENTE", Validators.compose([Validators.required])],

      fecha_inicial: [fecha_actual],
      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],
      fechaaut: [fecha_actual],
      fecha_confirmada: [fecha_actual],
      hora_confirmada: [hour.toString()],
      hora_inicial: [hour],
      usuarioaut: [""],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],

      obs: [this.dataform.obs],
      obs2: [""],
      direccion: [this.dataform.direccion],
      peso: Number(this.peso),
      codcliente_real: [this.dataform.cliente_real === null ? this.codigo_cliente : this.dataform.cliente_real],
      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],
      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email],

      venta_cliente_oficina: this.dataform.venta_cliente_oficina === undefined ? false : true,
      tipo_venta: ['0'],
      estado_contra_entrega: [this.dataform.estado_contra_entrega === null ? this.dataform.estado_contra_entrega : ""],
      contra_entrega: [this.dataform.contra_entrega === false ? false : true],
      odc: "",

      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud === undefined ? 0 : this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud

      idanticipo: [""], //anticipo VentasL
      numeroidanticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [false], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVISAR

      idsoldesctos: this.idpf_complemento_view, // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [valor_cero], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024

      idpf_complemento: this.dataform.idpf_complemento === undefined ? "0" : this.dataform.idpf_complemento, //aca es para complemento de proforma

      monto_anticipo: [this.dataform.monto_anticipo === 0 ? 0 : this.dataform.monto_anticipo], //anticipo Ventas
      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? " " : this.dataform.nroidpf_complemento,//aca es para complemento de proforma
      tipo_complementopf: [this.dataform.tipo_complementopf], //aca es para complemento de proforma

      // fechaaut_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // subtotal_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // moneda_total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario

      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento
      // no hay mas en esta seccion xD

      subtotal: [this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos], //TOTALES
      //des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.dataform.iva], //TOTALES
      total: [this.dataform.total], //TOTALES
      porceniva: [0],

      fechareg: [fecha_actual],
      horareg: [hora_actual_complete],
      hora: [hora_actual_complete],
      usuarioreg: [usuario_logueado],
      horaaut: [hora_actual_complete],
    });
  }

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
  }

  mandarEntregar() {
    this.valor_formulario = [this.FormularioData.value];
    console.log("Valor Formulario Original: ", this.valor_formulario);

    this.submitted = true;
    this.valor_formulario.map((element: any) => {
      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: this.preparacion?.toString() || '',
        contra_entrega: element.preciovta?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        tipo_complemento: element.tipo_complementopf?.toString() || '',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        monto_anticipo: element.monto_anticipo,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        tipo_cliente: this.tipo_cliente,
        nroautorizacion: "",
        nrocaja: "",
        idsol_nivel: "",
        nroidsol_nivel: "0",
        version_codcontrol: "",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: "",
        totdesctos_extras: 0,
        totrecargos: 0,
        idpf_complemento: "",
        nroidpf_complemento: " ",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: "2030-04-10",
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    if (this.preparacion === undefined) {
      this.preparacion = "NORMAL";
    } else {
      this.preparacion;
    }

    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      preparacion: this.preparacion,
    }
    console.log("Valor Formulario Mapeado: ", this.valor_formulario_copied_map_all);
    console.log("Valor Formulario Enviando Btn mandarEntregar: ", proforma_validar);

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/get_entrega_pedido/"
    return this.api.create('/venta/transac/veproforma/get_entrega_pedido/' + this.userConn + "/" + this.BD_storage, proforma_validar)
      .subscribe({
        next: (datav) => {
          this.tipoentrega = datav.mensaje;
          console.log(datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  get f() {
    return this.FormularioData.controls;
  }

  getIdTipo() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogoNumProfxUsuario/";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo_view_get_array = datav;
          // console.log(this.id_tipo_view_get_array);

          this.id_tipo_view_get_array_copied = this.id_tipo_view_get_array.slice();
          this.id_tipo_view_get_first = this.id_tipo_view_get_array_copied.shift();

          this.id_tipo_view_get_codigo = this.id_tipo_view_get_first.id;
          console.log(this.id_tipo_view_get_codigo);

          this.getIdTipoNumeracion(this.id_tipo_view_get_codigo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIdTipoNumeracion(id_tipo) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getNumActProd/";
    return this.api.getAll('/venta/transac/veproforma/getNumActProd/' + this.userConn + "/" + id_tipo)
      .subscribe({
        next: (datav) => {
          this.id_proforma_numero_id = datav;
          console.log('data', datav);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveIDTipo(event: any) {
    console.log(this.id_tipo_view_get_array);
    const inputValue = event.target.value;

    let cadena = inputValue.toString();
    console.log(cadena);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.id_tipo_view_get_array.some(objeto => objeto.id === cadena.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = cadena;
      this.getIdTipoNumeracion(cadena);
    }
  }

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  abrirTabPorLabelFooter(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup1._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup1.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen_get = datav;
          console.log(this.almacen_get);

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

          this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa
          this.cod_descuento_modal_codigo = this.almacn_parame_usuario.coddescuento;
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

  getVendedorCatalogo() {
    let a
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
          a = this.vendedor_get.shift();
          this.cod_vendedor_cliente = a.codigo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveVendedor(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.vendedor_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  getTarifa() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          this.tarifa_get_unico_copied = this.tarifa_get_unico.slice();
          this.cod_precio_venta_modal_first = this.tarifa_get_unico_copied.shift();
          // this.cod_precio_venta_modal_codigo = this.cod_precio_venta_modal_first.codigo

          console.log("Precio Venta: ", this.cod_precio_venta_modal_codigo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  aplicarPrecioVenta(value) {
    this.item_seleccionados_catalogo_matriz_copied = this.array_items_carrito_y_f4_catalogo.slice();
    console.log("Entra a la funcion aplicarPrecioVenta", value);

    this.array_items_carrito_y_f4_catalogo = this.item_seleccionados_catalogo_matriz_copied.map(item => {
      return { ...item, codtarifa: value, total: 0 };
    });

    console.log(this.array_items_carrito_y_f4_catalogo);
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

    this.total_desct_precio = true;
    this.total = 0;
    this.subtotal = 0;

    const resultado: boolean = window.confirm("¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA?, ESTA ACCION PUEDE TOMAR UN TIEMPO");
    if (resultado) {
      console.log("LE DIO AL SI HAY Q TOTALIZAR, ");
      this.totabilizar();
    } else {
      console.log("LE DIO AL NO, NO HAY Q TOTALIZAR");
    }
  }

  aplicarDesctEspc(value) {
    this.item_seleccionados_catalogo_matriz_copied = this.array_items_carrito_y_f4_catalogo.slice();
    console.log("Entra a la funcion aplicarDesctEspc()", value);

    this.array_items_carrito_y_f4_catalogo = this.item_seleccionados_catalogo_matriz_copied.map(item => {
      return { ...item, coddescuento: value, total: 0 };
    });

    console.log(this.array_items_carrito_y_f4_catalogo);
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

    this.total_desct_precio = true;
    this.total = 0.00;
    this.subtotal = 0.00;

    const resultado: boolean = window.confirm("¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA?, ESTA ACCION PUEDE TOMAR UN TIEMPO");
    if (resultado) {
      console.log("LE DIO AL SI HAY Q TOTALIZAR");
      this.totabilizar();
    } else {
      console.log("LE DIO AL NO, NO HAY Q TOTALIZAR");
    }
  }

  setEmailDefault() {
    this.email_cliente = "facturasventas@pertec.com.bo";
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
          this.tipo_doc_cliente = this.cliente.cliente.tipo_docid;
          this.nit_cliente = this.cliente.cliente.nit;
          this.email_cliente = this.cliente.cliente.email;
          this.cliente_casual = this.cliente.cliente.casual;

          this.cod_vendedor_cliente = this.cliente.cliente.codvendedor;
          this.moneda = this.cliente.cliente.moneda;
          this.venta_cliente_oficina = this.cliente.cliente.venta_cliente_oficina;
          this.tipo_cliente = this.cliente.cliente.tipo;

          this.direccion = this.cliente.vivienda.direccion;
          this.whatsapp_cliente = this.cliente.vivienda.celular;
          this.latitud_cliente = this.cliente.vivienda.latitud;
          this.longitud_cliente = this.cliente.vivienda.longitud;
          this.central_ubicacion = this.cliente.vivienda.central;

          this.obs = this.cliente.vivienda.obs;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.warning('Usuario Inexiste! ⚠️');
          this.limpiar();
        },
        complete: () => {
          this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;
          this.getUbicacionCliente(this.codigo_cliente_catalogo, this.cliente.vivienda.direccion);
        }
      })
  }

  getUbicacionCliente(cod_cliente, direccion) {
    let dirclient = {
      codcliente: cod_cliente,
      dircliente: direccion,
    }

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getUbicacionCliente/"
    return this.api.create('/venta/transac/veproforma/getUbicacionCliente/' + this.userConn, dirclient)
      .subscribe({
        next: (datav) => {
          this.central_ubicacion = datav;
          this.ubicacion_central = datav.ubi
          console.log(this.ubicacion_central);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarCodCliente(cod_cliente) {
    this.total = 0.00;
    this.subtotal = 0.00;
    this.servicioCliente.disparadorDeClientes.emit({
      cliente: { codigo: cod_cliente }
    });
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
            this.getMonedaTipoCambio(this.moneda_get_catalogo);
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDesctLineaIDTipo() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/vetiposoldsctos/catalogo/";
    return this.api.getAll('/vetiposoldsctos/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.desct_linea_id_tipo = datav;
          console.log(this.desct_linea_id_tipo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {

        }
      })
  }

  getMonedaTipoCambio(moneda) {
    let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adtipocambio/getmonedaValor/";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getmonedaValor/' + this.userConn + "/" + this.moneda_base + "/" + moneda + "/" + fechareg)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio_moneda_catalogo = datav;
          console.log(this.tipo_cambio_moneda_catalogo);
          this.tipo_cambio_moneda_catalogo = this.tipo_cambio_moneda_catalogo.valor;
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

  getPrecio() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.descuento_get = datav;
          console.log(this.descuento_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDescuento() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vedescuento/catalogo/";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuento_get = datav;
          console.log(this.descuento_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDireccionCentral(cod_usuario) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vetienda/getCentral/";
    return this.api.getAll('/venta/mant/vetienda/getCentral/' + this.userConn + "/" + cod_usuario)
      .subscribe({
        next: (datav) => {
          this.direccion_central = datav;
          this.direccion_central_input = this.direccion_central.direccion;
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

  getSaldoEmpaquePesoAlmacenLocal(item) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/pesoEmpaqueSaldo/";
    return this.api.getAll('/inventario/mant/inmatriz/pesoEmpaqueSaldo/' + this.userConn + "/" + this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal_codigo + "/" + item + "/" + this.agencia_logueado + "/" + this.BD_storage)
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

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.agencia_logueado;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getsaldosCompleto/";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.almacn_parame_usuario + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', datav, "+++ MENSAJE SALDO VPN: " + this.id_tipo[0].resp);
          // this.letraSaldos = this.id_tipo[0].resp;
          // this.saldo_variable = this.id_tipo[2];

          // LETRA
          this.id_tipo[1].forEach(element => {
            if (element.descripcion === 'Total Saldo') {
              this.saldoItem = element.valor;
              console.log(this.saldoItem);
            }
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getEmpaqueItem(item) {
    console.log("EMPAQUE");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .subscribe({
        next: (datav) => {
          this.empaquesItem = datav;
          console.log(this.empaquesItem);
          this.empaque_view = true;

          this.empaque_item_codigo = this.empaquesItem.codigo;
          this.empaque_item_descripcion = this.empaquesItem.descripcion;
          this.cantidad = this.empaquesItem.cantidad;

          this.empaque_descripcion_concat = "(" + this.empaque_item_codigo + ")" + this.empaque_item_descripcion + "-" + this.cantidad + " | ";
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getPorcentajeVentaItem(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inmatriz/infoItemRes/";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + this.agencia_logueado + "/" + item + "/" +
      this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal_codigo + "/" + this.codigo_cliente_catalogo_real)
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

  limpiar() {
    this.codigo_cliente = "";
    this.nombre_cliente = "";
    this.nombre_comercial_cliente = "";
    this.nombre_factura = "";
    this.razon_social = "";
    this.nombre_comercial_razon_social = "";
    this.tipo_doc_cliente = "";
    this.nit_cliente = "";
    this.email_cliente = " ";
    this.tipopago = 1;

    this.whatsapp_cliente = "";
    this.cod_vendedor_cliente = "";
    this.moneda = "";
    this.tipo = "";
    this.latitud_cliente = "";
    this.longitud_cliente = "";
    this.direccion_central_input = "";
    this.transporte = "";
    this.medio_transporte = "";
    this.fletepor = "";
    this.tipoentrega = "";
    this.peso = 0;
    this.codigo_cliente_catalogo_direccion = "";
    this.obs = "";

    this.tipo_cliente = "";
    this.direccion = "";
    this.central_ubicacion = "";
    this.email = "";
    this.obs = "";
    this.codigo_cliente_catalogo_real = "";
    this.habilitar_desct_sgn_solicitud = false;
    this.id_solicitud_desct = "false";
    this.nroidpf_complemento_view = "";
    this.desct_nivel_actual = "ACTUAL";

    this.email_cliente = "";
    this.subtotal = 0;
    this.recargos = 0;
    this.des_extra = 0;
    this.iva = 0;
    this.total = 0;

    this.almacenes_saldos = [];
    this.array_items_carrito_y_f4_catalogo = [];
    this.item_seleccionados_catalogo_matriz_sin_procesar = [];
    this.item_seleccionados_catalogo_matriz_sin_procesar_catalogo = [];
    this.dataSource_precios_desct = new MatTableDataSource([]);
    this.dataSource__venta_23_dias = new MatTableDataSource([]);
    this.dataSourceUltimasProformas = new MatTableDataSource([]);

    this.recargo_de_recargos = [];
    this.array_de_descuentos_ya_agregados = [];
    this.tabla_anticipos = [];

    this.tablaInicializada();
    this.limpiarEtiqueta();
  }

  guardarCorreo() {
    let ventana = "proforma-edit"
    let detalle = "proforma-actualizoEmail";
    let tipo_transaccion = "transacc-proforma-PUT";

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
          this.log_module.guardarLog(ventana, detalle, tipo_transaccion);
          this.email_save = datav;
          this.toastr.success('!CORREO GUARDADO!');
          this._snackBar.open('!CORREO GUARDADO!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! Ingrese un correo valido ! 📧');
        },
        complete: () => {

        }
      })
  }

  guardarNombreCliente() {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    let tipo_doc_cliente_parse_string = this.tipo_doc_cliente.toString();
    let nit_string;
    let cliente_nuevo: any = [];

    if (this.valor_nit !== undefined) {
      nit_string = this.valor_nit.toString();
    }

    cliente_nuevo = {
      codSN: this.codigo_cliente,
      nomcliente_casual: this.nombre_comercial_razon_social,
      nit_cliente_casual: nit_string,
      tipo_doc_cliente_casual: tipo_doc_cliente_parse_string,
      email_cliente_casual: this.email_cliente === undefined ? this.email : this.email_cliente,
      celular_cliente_casual: this.whatsapp_cliente === undefined ? " " : this.whatsapp_cliente,
      codalmacen: this.almacn_parame_usuario,
      codvendedor: this.cod_vendedor_cliente,
      usuarioreg: usuario_logueado,
    };
    console.log(cliente_nuevo);

    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/crearCliente/";
    return this.api.create('/venta/transac/veproforma/crearCliente/' + this.userConn, cliente_nuevo)
      .subscribe({
        next: (datav) => {
          this.usuario_creado_save = datav;
          console.log(this.usuario_creado_save);
          this.toastr.success('!CLIENTE GUARDADO!');
          this._snackBar.open('!CLIENTE GUARDADO!', 'Ok', {
            duration: 2000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      })
  }

  onPaste(event: any) {
    event.preventDefault();
    // También puedes mostrar un mensaje al usuario indicando que el pegado está bloqueado
    alert("EVENTO BLOQUEADO, NO PEGAR");
  }

  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  cantidadChangeMatrix(element: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    this.total_desct_precio = false;
    this.total_X_PU = true;

    // Actualizar la cantidad en el elemento correspondiente en tu array de datos
    element.cantidad = Number(newValue);

    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    console.log(this.dataSource.filteredData);

    //guardar en el carrito ya modificado, para enviar a totalizar
    this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
  }

  pedidoChangeMatrix(element: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    this.total_desct_precio = true;
    element.cantidad = element.cantidad_pedida;

    // Actualizar la cantidad en el elemento correspondiente en tu array de datos
    element.cantidad = Number(newValue);

    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    console.log(this.dataSource.filteredData);

    //guardar en el carrito ya modificado, para enviar a totalizar
    this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
  }

  //PRECIO VENTA DETALLE
  TPChangeMatrix(element: any, newValue: number) {
    console.log(element);
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    element.codtarifa = Number(newValue);

    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    console.log(this.dataSource.filteredData);
    this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  onLeavePrecioVentaDetalle(event: any, elemento) {
    console.log('Elemento seleccionado:', elemento);
    this.elementoSeleccionadoPrecioVenta = elemento;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    const inputValue = event.target.value;
    let entero = Number(this.elementoSeleccionadoPrecioVenta.codtarifa);
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;

      console.log('Elemento seleccionado:', elemento);
      this.elementoSeleccionadoDescuento = elemento;

      this.servicioPrecioVenta.disparadorDePrecioVentaDetalle.subscribe(data => {
        console.log("Recibiendo Descuento: ", data);
        this.elementoSeleccionadoPrecioVenta.codtarifa = data.precio_venta.codigo;

        this.total = 0;
        this.subtotal = 0;
        this.iva = 0
        this.des_extra = 0;
        this.recargos = 0;
      });

      //"api/venta/transac/veproforma/getItemMatriz_Anadir/DPD2_Loc_PE/PE/DPD2/35CH1H14/1/301/100/100/300800/0/311/FALSE/BS/2024-04-23"
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad_pedida +
        "/" + elemento.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.almacn_parame_usuario + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .subscribe({
          next: (datav) => {
            //this.almacenes_saldos = datav;
            console.log("Total al cambio de DE en el detalle: ", datav);
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos

            elemento.preciolista = Number(datav.preciolista);
            elemento.preciodesc = Number(datav.preciodesc);
            elemento.precioneto = Number(datav.precioneto);
            // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
            console.log(this.dataSource.filteredData);

            this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
          },

          error: (err: any) => {
            console.log(err, errorMessage);
          },
          complete: () => {
            //this.simularTab();
          }
        });

    }
  }

  // // Función que se llama cuando se hace clic en el input
  inputClickedPrecioVenta(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    console.log('Elemento seleccionado:', elemento);
    this.elementoSeleccionadoPrecioVenta = elemento;

    this.servicioPrecioVenta.disparadorDePrecioVentaDetalle.subscribe(data => {
      console.log("Recibiendo Descuento: ", data);
      this.elementoSeleccionadoPrecioVenta.codtarifa = data.precio_venta.codigo;
    });
  }
  //FIN PRECIO VENTA DETALLE

  //DESCUENTO ESPECIAL DETALLE
  DEChangeMatrix(element: any, newValue: number) {
    // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
    element.coddescuento = Number(newValue);
    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    console.log(this.dataSource.filteredData);
    this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
  }

  getDescuentos() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedescuento/catalogo/";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          //this.cod_descuento_modal_codigo = 0;
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

  onLeaveDescuentoEspecialDetalle(event: any, element) {
    console.log("Item seleccionado: ", element);

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    //desde aca verifica que lo q se ingreso al input sea data que existe en el array de descuentos descuentos_get
    let entero = Number(this.elementoSeleccionadoDescuento.coddescuento);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);
    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      console.log("NO ENCONTRADO VALOR DE INPUT");
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + "0" + "/" + element.cantidad_pedida +
        "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.almacn_parame_usuario + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .subscribe({
          next: (datav) => {
            //this.almacenes_saldos = datav;
            console.log("Total al cambio de DE en el detalle: ", datav);
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
            element.preciolista = Number(datav.preciolista);
            element.preciodesc = Number(datav.preciodesc);
            element.precioneto = Number(datav.precioneto);
            // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
            console.log(this.dataSource.filteredData);

            this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
          },

          error: (err: any) => {
            console.log(err, errorMessage);
          },
          complete: () => { }
        });
    } else {
      event.target.value = entero;

      console.log('Elemento seleccionado:', element);
      this.elementoSeleccionadoDescuento = element;

      this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
        console.log("Recibiendo Precio de Venta: ", data);
        this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;

        this.total = 0;
        this.subtotal = 0;
        this.iva = 0
        this.des_extra = 0;
        this.recargos = 0;
      });

      //"api/venta/transac/veproforma/getItemMatriz_Anadir/DPD2_Loc_PE/PE/DPD2/35CH1H14/1/301/100/100/300800/0/311/FALSE/BS/2024-04-23"
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + element.coddescuento + "/" + element.cantidad_pedida +
        "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.almacn_parame_usuario + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .subscribe({
          next: (datav) => {
            //this.almacenes_saldos = datav;
            console.log("Total al cambio de DE en el detalle: ", datav);
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
            element.preciolista = Number(datav.preciolista);
            element.preciodesc = Number(datav.preciodesc);
            element.precioneto = Number(datav.precioneto);
            // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
            console.log(this.dataSource.filteredData);

            this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
            //this.simularTab();
          },

          error: (err: any) => {
            console.log(err, errorMessage);
            //this.simularTab();
          },
          complete: () => {
            //this.simularTab();
          }
        });
    }
  }

  inputClickedDescuento(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    console.log('Elemento seleccionado:', elemento);
    this.elementoSeleccionadoDescuento = elemento;

    this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;
    });
  }
  //FIN DESCUENTO ESPECIAL DETALLE








  recalcularPedidoXPU(cantidad, precioneto) {
    console.log(cantidad, precioneto);
  }

  calcularTotalCantidadXPU(cantidad_pedida: number, cantidad: number, precioneto: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && precioneto !== undefined && cantidad !== undefined) {
      if (this.total_X_PU === true) {
        return this.formatNumberTotalSub(cantidad * precioneto);
      } else {
        // console.log(input);
        let cantidadPedida = cantidad_pedida;
        // Realizar cálculos solo si los valores no son undefined
        //console.log(cantidadPedida, preciolista);
        return this.formatNumberTotalSub(cantidadPedida * precioneto);
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

  obtenerCantidadParaPedido(cantidad) {
    console.log(cantidad);
    return cantidad;
  }

  enabledPagoFormaAnticipada(val) {
    if (this.anticipo_button === val) {
      this.anticipo_button = false;
    } else {
      this.anticipo_button = true;
    }
  }

  definirClienteReferencia(codcliente, casual) {
    console.log(codcliente, casual)
    if (!casual) {
      const result = window.confirm("El código del Cliente: " + codcliente + " no es casual, por tanto no puede vincular con otro cliente, ¿esta seguro de continuar?");
      if (result) {
        this.modalClientesparaReferencia();
        window.alert("Como el cliente: " + codcliente + " es casual y/o referencia, debe identificar el VENDEDOR que realiza la operacion, por defecto se pondra el codigo del vendedor del ! CLIENTE REFERENCIA O CASUAL !");
      }
    } else {
      //si es casual entra aca
      this.modalClientesparaReferencia();
      window.alert("Como el cliente: " + codcliente + " es casual y/o referencia, debe identificar el VENDEDOR que realiza la operacion, por defecto se pondra el codigo del vendedor del ! CLIENTE REFERENCIA O CASUAL !");
    }
  }

  ventanaPermisoEspecialPassword() {
    let codigo = this.codigo_cliente;
    let id_numero_id = this.cod_id_tipo_modal_id + this.id_proforma_numero_id;

    let ventana = "PermisosEspecialesParametros"
    let detalle = "trasnferirProforma-update";
    let tipo = "trasnferirProforma-UPDATE";

    console.log(codigo, id_numero_id);
    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: codigo,
        dataB: id_numero_id,
        dataPermiso: "TRANSFERIR PROFORMA",
        dataCodigoPermiso: "122",
        //abrir: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      console.log(result);
      if (result) {
        this.tranferirProforma();
        this.log_module.guardarLog(ventana, detalle, tipo);
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  imprimir_proforma_tranferida(proforma) {
    console.log(proforma);

    this.cod_id_tipo_modal_id = this.id_tipo_view_get_codigo;
    this.id_proforma_numero_id = this.id_proforma_numero_id;
    this.fecha_actual = this.fecha_actual;
    // this.fecha_actual = proforma.cabecera.fecha;
    this.almacn_parame_usuario = proforma.cabecera.codalmacen;
    this.venta_cliente_oficina = proforma.cabecera.venta_cliente_oficina;
    this.codigo_cliente = proforma.cabecera.codcliente;
    this.nombre_cliente = proforma.cabecera.nomcliente;
    this.nombre_comercial_cliente = proforma.cabecera.nombre_comercial;
    this.nombre_factura = proforma.cabecera.nombre_fact;
    this.razon_social = proforma.cabecera.nomcliente;
    this.complemento_ci = proforma.cabecera.complemento_ci;
    this.nombre_comercial_razon_social = proforma.cabecera.nomcliente;
    this.tipo_doc_cliente = proforma.cabecera.tipo_docid;
    this.nit_cliente = proforma.cabecera.nit;
    this.email_cliente = proforma.cabecera.email;
    this.cliente_casual = proforma.cabecera.casual;
    this.moneda_get_catalogo = proforma.cabecera.codmoneda;
    this.codigo_cliente = proforma.cabecera.codcliente_real;
    this.tipopago = proforma.cabecera.tipopago;

    this.transporte = proforma.cabecera.transporte;
    this.medio_transporte = proforma.cabecera.nombre_transporte;
    this.fletepor = proforma.cabecera.fletepor;
    this.tipoentrega = proforma.cabecera.tipoentrega;
    this.peso = proforma.cabecera.peso;
    this.codigo_cliente_catalogo_real = proforma.cabecera.codcliente_real

    this.cod_vendedor_cliente = proforma.cabecera.codvendedor;
    this.venta_cliente_oficina = proforma.cabecera.venta_cliente_oficina;
    this.tipo_cliente = proforma.cabecera.tipo === undefined ? " " : " ";
    this.direccion = proforma.cabecera.direccion;
    this.whatsapp_cliente = proforma.cabecera.celular;
    this.latitud_cliente = proforma.cabecera.latitud_entrega;
    this.longitud_cliente = proforma.cabecera.longitud_entrega;
    this.central_ubicacion = proforma.cabecera.central;
    this.obs = proforma.cabecera.obs;
    this.desct_nivel_actual = proforma.cabecera.niveles_descuento;
    this.whatsapp_cliente = "0";

    this.ubicacion_central = proforma.cabecera.ubicacion;
    this.preparacion = proforma.cabecera.preparacion;
    this.subtotal = proforma.cabecera.subtotal;
    this.recargos = 0;
    this.des_extra = proforma.cabecera.descuentos;
    this.iva = 0;
    this.total = proforma.cabecera.total;


    this.item_seleccionados_catalogo_matriz = proforma.detalle;
    this.veproforma1 = proforma.detalle;
    this.array_de_descuentos_ya_agregados = proforma.descuentos;
    //this.cod_descuento_total = proforma.descuentos;
    //la cabecera asignada a this.veproforma para totalizar y grabar
    this.veproforma = proforma.cabecera
    //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = proforma.detalle;

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;

    //this.dataSource = new MatTableDataSource(proforma.detalle);
    // se dibuja los items al detalle de la proforma
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
  }

  imprimir_cotizacion_transferida(cotizacion) {
    console.log(cotizacion);
    this.cod_id_tipo_modal_id = cotizacion.cabecera.id;
    this.id_proforma_numero_id = cotizacion.cabecera.numeroid;
    this.fecha_actual = cotizacion.cabecera.fecha;
    this.almacn_parame_usuario = cotizacion.cabecera.codalmacen;
    this.codigo_cliente = cotizacion.cabecera.codcliente;
    this.nombre_comercial_razon_social = cotizacion.cabecera.nomcliente;
    this.nit_cliente = cotizacion.cabecera.nit;
    this.cod_vendedor_cliente = cotizacion.cabecera.codvendedor;
    this.moneda_get_catalogo = cotizacion.cabecera.codmoneda;
    this.tipo_cambio_moneda_catalogo = cotizacion.cabecera.tdc;
    this.tipopago = cotizacion.cabecera.tipopago;
    this.preparacion = cotizacion.cabecera.preparacion;
    this.fecha_actual = cotizacion.cabecera.fecha;
    this.subtotal = cotizacion.cabecera.subtotal;
    this.recargos = cotizacion.cabecera.recargos;
    this.des_extra = cotizacion.cabecera.descuentos;
    this.iva = cotizacion.cabecera.iva;
    this.total = cotizacion.cabecera.total;

    this.direccion = cotizacion.cabecera.direccion;
    this.obs = cotizacion.cabecera.obs;
    this.transporte = cotizacion.cabecera.transporte;
    this.medio_transporte = cotizacion.cabecera.nombre_transporte;
    this.fletepor = cotizacion.cabecera.fletepor;
    this.habilitar_desct_sgn_solicitud = cotizacion.cabecera.desclinea_segun_solicitud;

    this.item_seleccionados_catalogo_matriz = cotizacion.detalle;

    this.array_items_carrito_y_f4_catalogo = cotizacion.detalle;
    this.dataSource = new MatTableDataSource(cotizacion.detalle);
  }

  imprimir_zip_importado(zip_json) {
    console.log(zip_json);

    this.cod_id_tipo_modal_id = this.id_tipo_view_get_codigo;
    this.id_proforma_numero_id = this.id_proforma_numero_id;
    this.fecha_actual = this.fecha_actual;
    this.almacn_parame_usuario = zip_json.cabeceraList[0].codalmacen;
    this.venta_cliente_oficina = zip_json.cabeceraList[0].venta_cliente_oficina;
    this.codigo_cliente = zip_json.cabeceraList[0].codcliente;
    this.nombre_cliente = zip_json.cabeceraList[0].nomcliente;
    this.nombre_comercial_cliente = zip_json.cabeceraList[0].nombre_comercial;
    this.nombre_factura = zip_json.cabeceraList[0].nombre_fact;
    this.razon_social = zip_json.cabeceraList[0].nomcliente;
    this.complemento_ci = zip_json.cabeceraList[0].complemento_ci;
    this.nombre_comercial_razon_social = zip_json.cabeceraList[0].nomcliente;
    this.tipo_doc_cliente = zip_json.cabeceraList[0].tipo_docid;
    this.nit_cliente = zip_json.cabeceraList[0].nit;
    this.email_cliente = zip_json.cabeceraList[0].email;
    this.cliente_casual = zip_json.cabeceraList[0].casual;
    this.moneda_get_catalogo = zip_json.cabeceraList[0].codmoneda;
    this.codigo_cliente = zip_json.cabeceraList[0].codcliente_real;
    this.tipopago = zip_json.cabeceraList[0].tipopago;
    this.tipo_cliente = zip_json.clienteList[0].tipo;

    this.transporte = zip_json.cabeceraList[0].transporte;
    this.medio_transporte = zip_json.cabeceraList[0].nombre_transporte;
    this.fletepor = zip_json.cabeceraList[0].fletepor;
    this.tipoentrega = zip_json.cabeceraList[0].tipoentrega;
    this.peso = zip_json.cabeceraList[0].peso;
    this.codigo_cliente_catalogo_real = zip_json.cabeceraList[0].codcliente_real

    this.cod_vendedor_cliente = zip_json.cabeceraList[0].codvendedor;
    this.venta_cliente_oficina = zip_json.cabeceraList[0].venta_cliente_oficina;
    this.tipo_cliente = zip_json.cabeceraList[0].tipo === undefined ? " " : " ";
    this.direccion = zip_json.cabeceraList[0].direccion;
    this.whatsapp_cliente = zip_json.cabeceraList[0].celular;
    this.latitud_cliente = zip_json.cabeceraList[0].latitud_entrega;
    this.longitud_cliente = zip_json.cabeceraList[0].longitud_entrega;
    this.central_ubicacion = zip_json.cabeceraList[0].central;
    this.obs = zip_json.cabeceraList[0].obs;
    this.desct_nivel_actual = zip_json.cabeceraList[0].niveles_descuento;
    this.whatsapp_cliente = "0";

    this.ubicacion_central = zip_json.cabeceraList[0].ubicacion;
    this.preparacion = zip_json.cabeceraList[0].preparacion;

    this.subtotal = zip_json.cabeceraList[0].subtotal;
    this.recargo_de_recargos = zip_json.recargoList;
    this.array_de_descuentos_ya_agregados = zip_json.descuentoList;
    this.veproforma_iva = zip_json.ivaList;
    this.total = zip_json.cabeceraList[0].total;


    this.item_seleccionados_catalogo_matriz = zip_json.detalleList[0];
    this.veproforma1 = zip_json.detalleList[0];

    // //la cabecera asignada a this.veproforma para totalizar y grabar
    this.veproforma = zip_json.cabeceraList[0]
    // //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = zip_json.detalleList;

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;

    // //this.dataSource = new MatTableDataSource(proforma.detalle);
    // // se dibuja los items al detalle de la proforma
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
  }



  complemento_proforma: any = [];
  buscadorIDComplementarProforma(complemento_id, complemento_numero_id) {
    console.log(complemento_id, complemento_numero_id);

    if (this.disableSelect.value === false) {
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    this.valor_formulario.map((element: any) => {
      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: this.preparacion?.toString() || '',
        contra_entrega: element.preciovta?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: "",
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        monto_anticipo: this.monto_anticipo,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        tipo_cliente: this.tipo_cliente,
        nroautorizacion: "",
        nrocaja: "",
        idsol_nivel: "",
        nroidsol_nivel: "0",
        version_codcontrol: "",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: "",
        totdesctos_extras: 0,
        totrecargos: 0,
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: "2030-04-10",
        idpf_solurgente: "0",
        noridpf_solurgente: "0",

        nroidpf_complemento: this.input_complemento_view.toString() === undefined ? "" : this.input_complemento_view.toString(),
        tipo_complemento: "complemento_para_descto_monto_min_desextra",
        idpf_complemento: this.idpf_complemento_view,
      }
    });

    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      preparacion: this.preparacion,
    }
    console.log(proforma_validar);

    return this.api.create("/venta/transac/veproforma/recuperarPfComplemento/" + this.userConn + "/" + complemento_id + "/" +
      complemento_numero_id + "/" + this.complementopf + "/" + this.BD_storage, proforma_validar)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.complemento_proforma = datav;

          if (datav.value === false) {
            this.modalDetalleObservaciones(datav.resp, datav.detalle);
            this.complementopf = false;
          } else {
            this.toastr.success("PROFORMA COMPLEMENTADA CON EXITO ✅")
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err) => {
          console.log(err);
          this.toastr.error('! OCURRIO UN PROBLEMA AL COMPLEMENTAR FAVOR REVISAR CON SISTEMAS !');
          this.complementopf = false;
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => { }
      })
  }

  getSaldoItemSeleccionadoDetalle(item) {
    console.log(item);
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

  getIDScomplementarProforma() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + 2)
      .subscribe({
        next: (datav) => {
          this.ids_complementar_proforma = datav;
          console.log('data', this.ids_complementar_proforma);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  //accion de btn grabar
  submitData() {
    this.spinner.show();
    //this.validarProformaAll();
    //this.totabilizar();


    // Asegúrate de que las variables estén definidas antes de aplicar el filtro
    if (this.validacion_post && this.validacion_post_negativos) {
      let array_validacion_existe_aun_no_validos = this.validacion_post.filter(element => element.Valido === "NO");
      let array_negativos_aun_existe = this.validacion_post_negativos.filter(element => element.obs === 'Genera Negativo');
      let array_negativos_aun_existe_tamanio = array_negativos_aun_existe.length;
      let array_validacion_existe_aun_no_validos_tamanio = array_validacion_existe_aun_no_validos.length;

      console.log("NEGATIVOS,", array_negativos_aun_existe_tamanio, "tamanio:", array_negativos_aun_existe_tamanio.length);
      console.log("NO VALIDOS", array_validacion_existe_aun_no_validos, "tamanio:", array_validacion_existe_aun_no_validos.length);
      // Aquí puedes continuar con tu lógica...
      console.log(array_validacion_existe_aun_no_validos);
      console.log(array_negativos_aun_existe);

      //validacion cuando hay validaciones NO VALIDADADAS PERO IGUAL QUIERES GUARDAR
      if (array_validacion_existe_aun_no_validos_tamanio > 0) {
        const confirmacionValidaciones: boolean = window.confirm(`La Proforma ${this.id_tipo_view_get_codigo}-${this.id_proforma_numero_id} tiene validaciones las cuales tienen que ser revisadas. ¿Esta seguro de grabar la proforma?`);
        if (!confirmacionValidaciones) {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          return;
        }
      }

      //VALIDACION SI EN LA VALIDACIONES HAY ITEMS QUE GENERAN NEGATIVOS
      if (array_negativos_aun_existe_tamanio > 0) {
        const confirmacionNegativos = window.confirm(`La Proforma ${this.id_tipo_view_get_codigo}-${this.id_proforma_numero_id} genera saldos negativos. ¿Esta seguro de grabar la proforma?`);
        if (!confirmacionNegativos) {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          return;
        }
      }

    } else {
      console.error('validacion_post o validacion_post_negativos no están definidos');
    }

    let tamanio_array_etiqueta = this.etiqueta_get_modal_etiqueta.length;
    let total_proforma_concat: any = [];

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map(item => ({
      ...item,
      cantaut: 0,
      totalaut: 0,
      obs: "",
    }));

    this.submitted = true;
    let data = this.FormularioData.value;
    console.log(data);

    total_proforma_concat = {
      veproforma: data,
      veproforma1: this.array_items_carrito_y_f4_catalogo,
      veproforma_valida: [
        {
          "codproforma": 0,
          "codcontrol": "00001",
          "nroitems": 3,
          "nit": "12492433",
          "subtotal": 148.21,
          "descuentos": 19.04,
          "recargos": 0,
          "total": 129.17,
          "valido": "SI",
          "observacion": "Sin Observacion",
          "obsdetalle": "",
          "codservicio": 102,
          "datoa": "",
          "datob": "",
          "clave_servicio": ""
        },
        {
          "codproforma": 0,
          "codcontrol": "00002",
          "nroitems": 3,
          "nit": "12492433",
          "subtotal": 148.21,
          "descuentos": 19.04,
          "recargos": 0,
          "total": 129.17,
          "valido": "SI",
          "observacion": "Sin Observacion",
          "obsdetalle": "",
          "codservicio": 0,
          "datoa": "",
          "datob": "",
          "clave_servicio": ""
        },
        {
          "codproforma": 0,
          "codcontrol": "00003",
          "nroitems": 3,
          "nit": "12492433",
          "subtotal": 148.21,
          "descuentos": 19.04,
          "recargos": 0,
          "total": 129.17,
          "valido": "SI",
          "observacion": "Sin Observacion",
          "obsdetalle": "",
          "codservicio": 0,
          "datoa": "",
          "datob": "",
          "clave_servicio": ""
        }
      ],
      dt_anticipo_pf: this.tabla_anticipos,
      vedesextraprof: this.array_de_descuentos_ya_agregados, // array de desct extra del totalizador
      verecargoprof: this.recargo_de_recargos, //array de recargos,
      veetiqueta_proforma: this.etiqueta_get_modal_etiqueta, // array de etiqueta
      veproforma_iva: this.veproforma_iva, //array de iva
    };

    console.log(total_proforma_concat);



    if (!this.FormularioData.valid) {
      this.toastr.info("VALIDACION ACTIVA 🚨");
      console.log("HAY QUE VALIDAR DATOS");
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }

    if (tamanio_array_etiqueta === 0) {
      this.toastr.error("¡ FALTA GRABAR ETIQUETA !");
      setTimeout(() => {
        this.spinner.hide();
      }, 1500);
      return;
    }

    if (this.total === 0.00) {
      this.toastr.error("EL TOTAL NO PUEDE SER 0, PARA GRABAR PROFORMA");
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }




    // const confirmar_proforma: boolean = window.confirm("La Proforma" + this.id_tipo_view_get_codigo + "-" +
    //   this.id_proforma_numero_id + "no esta confirmada. ¿Desea Confirmarla? ");

    // if (confirmar_proforma) {
    //   setTimeout(() => {
    //     spinner.hide();
    //   }, 1000);
    //   return;

    // Preguntar si desea colocar el desct 23 APLICAR DESCT POR DEPOSITO
    const confirmacionValidaciones: boolean = window.confirm(`¿Desea aplicar descuento por deposito si el cliente tiene pendiente algun descuento por este concepto?`);
    if (confirmacionValidaciones) {
      this.aplicarDesctPorDeposito();

      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    } else {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }



    console.log("FORMULARIO VALIDADO");
    const url = `/venta/transac/veproforma/guardarProforma/${this.userConn}/${this.cod_id_tipo_modal_id}/${this.BD_storage}/false`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, total_proforma_concat).subscribe({
      next: (datav) => {
        this.toastr.info("GUARDADO CON EXITO ✅");
        this.totabilizar_post = datav;
        console.log(this.totabilizar_post);

        this.exportProformaExcel(this.totabilizar_post.codProf);

        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
      error: (err) => {
        console.log(err, errorMessage);
        this.toastr.error('! NO SE GRABO, OCURRIO UN PROBLEMA AL GRABAR !');
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    });
  }

  totabilizar() {
    let total_proforma_concat: any = [];

    //valor del check en el mat-tab complementar proforma
    if (this.disableSelect.value === false) { //valor del check en el mat-tab complementar proforma this.disableSelect.value 
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }
    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.toastr.error("NO HAY ITEM'S EN EL DETALLE DE PROFORMA");
    };

    if (this.habilitar_desct_sgn_solicitud === undefined) {
      this.habilitar_desct_sgn_solicitud = false;
    };

    total_proforma_concat = {
      veproforma: this.FormularioData.value, //este es el valor de todo el formulario de proforma
      veproforma1: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      veproforma_valida: [],
      veproforma_anticipo: [],
      vedesextraprof: this.array_de_descuentos_ya_agregados, //array de descuentos
      verecargoprof: this.recargo_de_recargos, //array de recargos
      veproforma_iva: this.veproforma_iva, //array de iva
    };

    console.log(total_proforma_concat);
    console.log(this.veproforma, this.array_items_carrito_y_f4_catalogo, this.veproforma_valida,
      this.veproforma_anticipo, this.vedesextraprof, this.verecargoprof, this.veproforma_iva);

    console.log("Array de Carrito a Totaliza:", total_proforma_concat, "URL: " + ("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" + this.habilitar_desct_sgn_solicitud + "/" + this.complementopf + "/" + this.desct_nivel_actual));
    if (this.habilitar_desct_sgn_solicitud != undefined && this.complementopf != undefined) {
      console.log("DATOS VALIDADOS");
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
      return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
        this.habilitar_desct_sgn_solicitud + "/" + this.complementopf + "/" + this.desct_nivel_actual, total_proforma_concat)
        .subscribe({
          next: (datav) => {
            this.totabilizar_post = datav;
            console.log(this.totabilizar_post);
            this.toastr.success('! TOTALIZADO EXITOSAMENTE !');

            console.log(this.array_items_carrito_y_f4_catalogo);
            this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

            setTimeout(() => {
              this.spinner.hide();
            }, 1500);
          },

          error: (err) => {
            console.log(err, errorMessage);
            this.toastr.error('! NO SE TOTALIZO !');

            setTimeout(() => {
              this.spinner.hide();
            }, 1500);
          },
          complete: () => {
            this.mandarEntregar();
            this.total = this.totabilizar_post.totales?.total;
            this.subtotal = this.totabilizar_post.totales?.subtotal;
            this.recargos = this.totabilizar_post.totales?.recargo;
            this.des_extra = this.totabilizar_post.totales?.descuento;
            this.iva = this.totabilizar_post.totales?.iva;
            this.peso = Number(this.totabilizar_post.totales?.peso);
            this.tablaIva = this.totabilizar_post.totales?.tablaIva;
            const item_procesados_en_total = this.totabilizar_post?.detalleProf;

            this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf;
            this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
          }
        })
    } else {
      this.toastr.info("VALIDACION ACTIVA 🚨");
      console.log("HAY QUE VALIDAR DATOS");
    }
  }


  formatNumber(number: number): any {
    // Formatear el número con el separador de miles como coma y el separador decimal como punto
    return new Intl.NumberFormat('en-US').format(number);
  }

  convertToNumber(value: any): number {
    if (value === undefined) {
      return 0; // O cualquier valor predeterminado que desees
    }
    return parseFloat(value.toString().replace(',', '.'));
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(formattedNumber);
  }

  //VALIDACIONES
  validacion_solo_validos: any = [];
  validacion_no_validos: any = [];
  toggleValidacionesAll: boolean = false;
  toggleValidos: boolean = false;
  toggleNoValidos: boolean = false;

  validarProformaAll() {
    // ACA TRAE TODAS LAS VALIDACIONES QUE SE REALIZAN EN EL BACKEND
    // VACIO - TODOS LOS CONTROLES
    this.valor_formulario = [this.FormularioData.value];
    console.log("Valor Formulario Original: ", this.valor_formulario);

    this.valor_formulario.map((element: any) => {
      this.valor_formulario_copied_map_all = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: element.preparacion,
        contra_entrega: element.preciovta?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        tipo_complemento: element.tipo_complementopf?.toString() || '',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        monto_anticipo: this.monto_anticipo,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        tipo_cliente: this.tipo_cliente,
        nroautorizacion: "",
        nrocaja: "",
        idsol_nivel: "",
        nroidsol_nivel: "0",
        version_codcontrol: "",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: "",
        totdesctos_extras: 0,
        totrecargos: 0,
        idpf_complemento: "",
        nroidpf_complemento: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: this.fecha_actual,
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    console.log("Valor Formulario Mapeado: ", this.valor_formulario_copied_map_all);
    let proforma_validar = {
      datosDocVta: this.valor_formulario_copied_map_all,
      detalleAnticipos: [],
      detalleDescuentos: [],
      detalleEtiqueta: [this.etiqueta_get_modal_etiqueta],
      detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
      detalleRecargos: [],
    }
    let tamanio_array_etiqueta = this.etiqueta_get_modal_etiqueta.length;
    console.log(proforma_validar, "Largo del array etiqueta: ", tamanio_array_etiqueta);

    this.spinner.show();
    this.submitted = true;

    const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/vacio/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

    if (this.total === 0) {
      this.toastr.error("EL TOTAL NO PUEDE SER 0");

      setTimeout(() => {
        this.spinner.hide();
      }, 1500);
      return;
    }

    if (!this.FormularioData.valid || tamanio_array_etiqueta === 0) {
      this.toastr.error("¡ FALTA GRABAR ETIQUETA !");
      this.toastr.info("VALIDACION ACTIVA 🚨");
      setTimeout(() => {
        this.spinner.hide();
      }, 1500);
      return;
    }

    this.api.create(url, proforma_validar).subscribe({
      next: (datav) => {
        this.toastr.info("VALIDACION EN CURSO ⚙️");
        this.validacion_post = datav;
        console.log("INFO VALIDACIONES:", datav);

        this.abrirTabPorLabel("Resultado de Validacion");
        this.dataSource_validacion = new MatTableDataSource(this.validacion_post);

        this.toggleValidacionesAll = true;
        this.toggleValidos = false;
        this.toggleNoValidos = false;

        // al traer todas las validaciones tambien se traen los negativos
        this.validacion_post_negativos = datav[56]?.Dtnegativos;
        this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);

        // maximo de ventas
        this.validacion_post_max_ventas = datav[54]?.Dtnocumplen;
        this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);

        setTimeout(() => {
          this.spinner.hide();
        }, 1500);
      },
      error: (err) => {
        console.log(err, errorMessage);
        this.toastr.error('¡NO SE VALIDÓ, OCURRIÓ UN PROBLEMA!');

        setTimeout(() => {
          this.spinner.hide();
        }, 1500);
      },
      complete: () => {
        this.abrirTabPorLabel("Resultado de Validacion");
        setTimeout(() => {
          this.spinner.hide();
        }, 1500);
      }
    });
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
  // FIN VALIDACION ALL

  // NEGATIVOS
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];

  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;

  validarProformaSoloNegativos() {
    // 00060 - VALIDAR SALDOS NEGATIVOS
    // VACIO - TODOS LOS CONTROLES
    this.valor_formulario = [this.FormularioData.value];
    console.log("Valor Formulario Original: ", this.valor_formulario);

    this.valor_formulario.map((element: any) => {
      return this.valor_formulario_negativos = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: element.preparacion,
        contra_entrega: element.preciovta?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        tipo_complemento: element.tipo_complementopf?.toString() || '',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        monto_anticipo: this.monto_anticipo,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        tipo_cliente: this.tipo_cliente,
        nroautorizacion: "",
        nrocaja: "",
        idsol_nivel: "",
        nroidsol_nivel: "0",
        version_codcontrol: "",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: "",
        totdesctos_extras: 0,
        totrecargos: 0,
        idpf_complemento: "",
        nroidpf_complemento: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: "2024-04-10T14:26:09.532Z",
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    // boolean que verifica que el formulario este con sus data llenada
    this.submitted = true;
    if (this.FormularioData.valid) {
      this.spinner.show();
      console.log("DATOS VALIDADOS");
      console.log("Valor Formulario Mapeado: ", this.valor_formulario_negativos);

      let proforma_validar = {
        datosDocVta: this.valor_formulario_negativos,
        detalleAnticipos: [],
        detalleDescuentos: [],
        //detalleEtiqueta: [this.etiqueta_get_modal_etiqueta],
        detalleEtiqueta: [],
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
        detalleRecargos: [],
      }

      console.log(proforma_validar);
      const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/00060/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

      this.api.create(url, proforma_validar).subscribe({
        next: (datav) => {
          this.toastr.info("VALIDACION CORRECTA NEGATIVOS ✅");
          if (datav[0].Dtnegativos) {
            this.validacion_post_negativos = datav[0].Dtnegativos;
          }

          this.abrirTabPorLabel("Negativos");
          console.log(this.validacion_post_negativos);

          this.toggleTodosNegativos = true;
          this.toggleNegativos = false;
          this.togglePositivos = false;

          this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE VALIDO NEGATIVOS, OCURRIO UN PROBLEMA !');
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        }
      });
    } else {
      this.toastr.info("VALIDACION ACTIVA 🚨");
      console.log("HAY QUE VALIDAR DATOS");
    }
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
  //FIN NEGATIVOS

  // MAX VENTAS
  validacion_post_max_venta_filtrados_si_sobrepasa: any = [];
  validacion_post_max_venta_filtrados_no_sobrepasa: any = [];

  toggleTodosMaximoVentas: boolean = false;
  toggleMaximoVentaSobrepasan: boolean = false;
  toggleMaximoVentasNoSobrepasan: boolean = false;

  validarProformaSoloMaximoVenta() {
    // 00058 - VALIDAR MAXIMO DE VENTA
    // VACIO - TODOS LOS CONTROLES
    this.valor_formulario = [this.FormularioData.value];
    console.log("Valor Formulario Original: ", this.valor_formulario);

    this.valor_formulario.map((element: any) => {
      return this.validacion_post_max_ventas = {
        coddocumento: 0,
        id: element.id.toString() || '',
        numeroid: element.numeroid?.toString() || '',
        codcliente: element.codcliente?.toString() || '',
        nombcliente: element.nombcliente?.toString() || '',
        nitfactura: element.nit?.toString() || '',
        tipo_doc_id: element.tipo_docid?.toString() || '',
        codcliente_real: element.codcliente_real?.toString() || '',
        nomcliente_real: element.nomcliente_real?.toString() || '',
        codmoneda: element.codmoneda?.toString() || '',
        subtotaldoc: element.subtotal,
        totaldoc: element.total,
        tipo_vta: element.tipopago?.toString() || '',
        codalmacen: element.codalmacen?.toString() || '',
        codvendedor: element.codvendedor?.toString() || '',
        preciovta: element.preciovta?.toString() || '',
        preparacion: element.preparacion,
        contra_entrega: element.preciovta?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega,
        desclinea_segun_solicitud: element.desclinea_segun_solicitud,
        pago_con_anticipo: element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion,
        latitud: element.latitud_entrega,
        longitud: element.longitud_entrega,
        nroitems: this.array_items_carrito_y_f4_catalogo.length,
        tipo_complemento: element.tipo_complementopf?.toString() || '',
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        monto_anticipo: this.monto_anticipo,
        nrofactura: "0",
        nroticket: "",
        tipo_caja: "",
        tipo_cliente: this.tipo_cliente,
        nroautorizacion: "",
        nrocaja: "",
        idsol_nivel: "",
        nroidsol_nivel: "0",
        version_codcontrol: "",
        estado_doc_vta: "NUEVO",
        codtarifadefecto: "1",
        desctoespecial: "0",
        cliente_habilitado: "",
        totdesctos_extras: 0,
        totrecargos: 0,
        idpf_complemento: "",
        nroidpf_complemento: "",
        idFC_complementaria: "",
        nroidFC_complementaria: "",
        fechalimite_dosificacion: "2024-04-10T14:26:09.532Z",
        idpf_solurgente: "0",
        noridpf_solurgente: "0",
      }
    });

    // boolean que verifica que el formulario este con sus data llenada
    this.submitted = true;

    if (this.FormularioData.valid) {
      console.log("DATOS VALIDADOS");
      this.spinner.show();
      console.log("Valor Formulario Mapeado: ", this.validacion_post_max_ventas);
      let proforma_validar = {
        datosDocVta: this.validacion_post_max_ventas,
        detalleAnticipos: [],
        detalleDescuentos: [],
        // detalleEtiqueta: [this.etiqueta_get_modal_etiqueta],
        detalleEtiqueta: [],
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
        detalleRecargos: [],
      }

      console.log(proforma_validar);
      const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/00058/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

      this.api.create(url, proforma_validar).subscribe({
        next: (datav) => {
          this.toastr.info("VALIDACION CORRECTA MAX VENTAS ✅");
          this.validacion_post_max_ventas = datav[0].Dtnocumplen;
          console.log(this.validacion_post_max_ventas);

          this.toggleTodosMaximoVentas = true;
          this.toggleMaximoVentaSobrepasan = false;
          this.toggleMaximoVentasNoSobrepasan = false;

          this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE VALIDO MAX VENTAS, OCURRIO UN PROBLEMA !');
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        }
      });
    } else {
      this.toastr.info("VALIDACION ACTIVA 🚨");
      console.log("HAY QUE VALIDAR DATOS");
    }
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
  // FIN MAX VENTAS













  estadoMoraValidacion() {
    console.log("Estado de Mora Xd");
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
            this.pinta_empaque_minimo = false;
          }

          this.modalDetalleObservaciones(datav.reg, mesagge);
          this.toastr.success('EMPAQUES CERRADOS PROCESANDO ⚙️');
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      })
  }

  pinta_empaque_minimo: boolean = false;
  empaquesMinimosPrecioValidacion() {
    let mesagge: string;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesMinimosVerifica/";
    return this.api.create('/venta/transac/veproforma/empaquesMinimosVerifica/' + this.userConn + "/" + this.codigo_cliente + "/" + this.almacn_parame_usuario, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          if (datav.cumple === true) {
            mesagge = "CUMPLE";
          } else {
            mesagge = "NO CUMPLE";
            this.pinta_empaque_minimo = true;
          }

          this.modalDetalleObservaciones(datav.reg, mesagge);
          this.toastr.success('EMPAQUES MINIMO PROCESANDO ⚙️');
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }


  aplicarDesctPorDeposito() {
    let a = {
      getTarifaPrincipal: {
        tabladetalle: this.array_items_carrito_y_f4_catalogo,
        dvta: this.FormularioData.value,
      },
      tabladescuentos: this.array_de_descuentos_ya_agregados,
      tblcbza_deposito: [],
    };

    this.spinner.show();
    console.log(a);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesMinimosVerifica/";
    return this.api.create('/venta/transac/veproforma/aplicar_descuento_por_deposito/' + this.userConn + "/" + this.codigo_cliente + "/" +
      this.codigo_cliente_catalogo_real + "/" + this.nit_cliente + "/" + this.BD_storage + "/" + this.subtotal + "/" + this.moneda_get_catalogo + "/" + 0, a)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.modalDetalleObservaciones(datav.msgVentCob, datav.megAlert);
          this.array_de_descuentos_ya_agregados = datav.tabladescuentos;

          this.toastr.success('DESCT. DEPOSITO APLICANDO ⚙️');
          //  this.totabilizar();
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      })
  }

  // MAT-TAB Ultimas Proformas
  ultimasProformas() {
    this.spinner.show();
    this.abrirTabPorLabelFooter("Ultimas-Proformas");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/ultimasProformas/";
    return this.api.getAll('/venta/transac/veproforma/ultimasProformas/' + this.userConn + "/" + this.codigo_cliente + "/" + this.codigo_cliente_catalogo_real + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.array_ultimas_proformas = datav;
          console.log(this.array_ultimas_proformas);

          this.dataSourceUltimasProformas = new MatTableDataSource(this.array_ultimas_proformas);
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        }
      })
  }
  //FIN MATTAB Ultimas Proformas

  // MAT-TAB Ultimas Proformas
  getDiasControl(item) {
    this.abrirTabPorLabelFooter("Ultimas Ventas Item 23 Dias");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDiasControl/";
    return this.api.getAll('/venta/transac/veproforma/getDiasControl/' + this.userConn + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          this.ultimasVentas23Dias(item, datav.diascontrol)
        },

        error: (err: any) => {
          console.log(err, errorMessage);

        },
        complete: () => { }
      })
  }

  ultimasVentas23Dias(item, dias) {
    this.spinner.show();
    this.abrirTabPorLabelFooter("Ultimas Ventas Item 23 Dias");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/cargarPFVtaDias/";
    return this.api.getAll('/venta/transac/veproforma/cargarPFVtaDias/' + this.userConn + "/" + item + "/" + this.BD_storage + "/" + this.codigo_cliente_catalogo_real + "/" + dias)
      .subscribe({
        next: (datav) => {
          this.array_venta_item_23_dias = datav;
          console.log(this.array_venta_item_23_dias);

          this.dataSource__venta_23_dias = new MatTableDataSource(this.array_venta_item_23_dias);
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        }
      })
  }
  //FIN MATTAB Ultimas Proformas

  //MAT-TAB Precios - Descuentos Especiales
  aplicarDescuentoEspecialSegunTipoPrecio() {
    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/aplicar_desc_esp_seg_precio/";
    return this.api.create('/venta/transac/veproforma/aplicar_desc_esp_seg_precio/' + this.userConn, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          this.toastr.success('DESCT. ESPECIAL S/TIPO PRECIO PROCESANDO ⚙️');
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          //siempre sera uno
          this.orden_creciente = 1;
          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.orden = index + 1;
          });
          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          if (datav.msgTitulo !== '' && datav.msgDetalle !== '') {
            this.modalDetalleObservaciones(datav.msgTitulo, datav.msgDetalle);
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }
  //FIN MAT-TAB Precios - Descuentos Especiales

  borrarDesct() {
    this.spinner.show();
    this.array_items_carrito_y_f4_catalogo.map((element) => {
      element.coddescuento = 0
      this.toastr.success("BORRANDO DESCUENTOS ⚙️");
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  validarEmpaqueDescEspc() {
    this.spinner.show();
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    if (this.disableSelect.value === false) {
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    let array = {
      codempresa: this.BD_storage,
      usuario: this.usuarioLogueado,
      codalmacen: this.almacn_parame_usuario,
      codcliente_real: this.codigo_cliente_catalogo_real,
      codcliente: this.codigo_cliente,
      opcion_nivel: this.complementopf.toString(),
      desc_linea_seg_solicitud: this.desct_nivel_actual,
      codmoneda: this.moneda_get_catalogo,
      fecha: fecha,
      tabladetalle: this.array_items_carrito_y_f4_catalogo
    };
    console.log(array);

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/valEmpDescEsp/";
    return this.api.create('/venta/transac/veproforma/valEmpDescEsp/' + this.userConn, array)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          this.toastr.success('VALIDAR EMPAQUE DESC. ESPECIAL ⚙️');
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          //siempre sera uno
          this.orden_creciente = 1;

          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.orden = index + 1;
          });
          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);

          if (datav.cumple === true) {
            this.modalDetalleObservaciones("CUMPLE", datav.msg);
          } else {
            this.modalDetalleObservaciones("NO CUMPLE", datav.msg);
          }

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }

  dividirItemsParaCumplirCajaCerrada() {
    this.total = 0.00;
    this.subtotal = 0.00;

    // dejar tabla de descuentos sugeridos en blanco sino al darle click en aplica a todos aplica a los q no son xD
    this.dataSource_precios_desct = new MatTableDataSource([]);
    console.log(this.array_items_carrito_y_f4_catalogo);
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    this.spinner.show();

    if (this.disableSelect.value === false) {
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/aplicar_dividir_items/";
    return this.api.create('/venta/transac/veproforma/aplicar_dividir_items/' + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado
      + "/" + this.codigo_cliente + "/" + this.desct_nivel_actual + "/" + this.almacn_parame_usuario + "/" + this.complementopf + "/" + this.moneda_get_catalogo + "/" + fecha,
      this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          this.toastr.success('DIVIDIR ITEMS PARA CUMPLIR EMPAQUE CAJA CERRADA PROCESANDO ⚙️');
          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle.slice();
          console.log(this.array_items_carrito_y_f4_catalogo);

          //siempre sera uno
          this.orden_creciente = 1;
          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.orden = index + 1;
          });

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
          this.modalDetalleObservaciones(datav.alertMsg, " ");

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }

  sugerirCantidadDescEspecial() {
    console.log(this.array_items_carrito_y_f4_catalogo);
    this.restablecerContadorClickSugerirCantidad();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/sugerirCantDescEsp/";
    return this.api.create('/venta/transac/veproforma/sugerirCantDescEsp/' + this.userConn + "/" + this.cod_descuento_modal_codigo + "/" + this.almacn_parame_usuario
      + "/" + this.BD_storage, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          if (datav.status === false) {
            this.toastr.warning(datav.resp);
            return;
          }

          this.toastr.success('VALIDAR EMPAQUE DESCT. ESPECIAL ⚙️');
          this.array_items_carrito_y_f4_catalogo = [...datav.tabladetalle];

          //siempre sera uno
          this.orden_creciente = 1;

          // Agregar el número de orden a los objetos de datos
          this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
            element.orden = index + 1;
          });

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
          console.log("Data Sugerida: ", datav.tabla_sugerencia)
          //console.log("Data del Carrito: ", this.array_items_carrito_y_f4_catalogo);
          this.toastr.warning(datav.msgDetalle);

          this.dataSource_precios_desct = new MatTableDataSource(datav.tabla_sugerencia);

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }

  //btn APLICAR de su tabla detalle por ITEM
  aplicarCantidadSugeridadParaCumplirEmpaque(detalle, item) {
    console.log("Detalle Carrito: ", detalle.filteredData, item);
    let item_select = detalle.filteredData.find((element1) => element1.coditem === item.coditem);

    console.log("Item seleccionado sacando del carrito: ", item_select);
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    if (item_select) {
      if (item_select.cantidad === item.cantidad) {
        if (item.cantidad_sugerida_aplicable >= 0) {
          item_select.cantidad += item.cantidad_sugerida_aplicable;
          //item_select.cantidad_pedida = (item_select.cantidad_pedida + item.cantidad_sugerida_aplicable);
          // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
          console.log(item_select.cantidad_pedida);
          this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
        }
      }
      else {
        if (item_select.cantidad === item.cantidad) {
          item_select.cantidad -= item.cantidad_sugerida_aplicable;
          //item_select.cantidad_pedida = (item_select.cantidad_pedida - item.cantidad_sugerida_aplicable);
          // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
          console.log(this.dataSource.filteredData);
          this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
        }
      }
    } else {
      console.error("Elemento no encontrado en detalle.filteredData");
    }
  }

  //btn RESTAURAR de su tabla detalle por ITEM
  restaurarCantidadSugeridadParaCumplirEmpaque(detalle, item) {
    console.log(item);
    console.log("Detalle Carrito: ", detalle.filteredData, item);
    let item_select = detalle.filteredData.find((element1) => element1.coditem === item.coditem);

    console.log("Item seleccionado sacando del carrito: ", item_select);
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    if (item_select) {
      if (item_select.cantidad !== item.cantidad) {
        if (item.cantidad_sugerida_aplicable >= 0) {
          item_select.cantidad -= item.cantidad_sugerida_aplicable;
          //item_select.cantidad_pedida = (item_select.cantidad_pedida - item.cantidad_sugerida_aplicable);
          // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
          console.log(this.dataSource.filteredData);
          this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
        }
      } else {
        if (item_select.cantidad !== item.cantidad) {
          item_select.cantidad += item.cantidad_sugerida_aplicable;
          //item_select.cantidad_pedida = (item_select.cantidad_pedida + item.cantidad_sugerida_aplicable);
          // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
          console.log(item_select.cantidad_pedida);
          this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

          this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
        }
      }
    } else {
      console.error("Elemento no encontrado en detalle.filteredData");
    }
  }

  // Contador de clics TODOS
  contadorClicks = 0;
  contadorClicksRestaur = 0;

  aplicarCantidadSugeridadParaCumplirEmpaqueATODO(carrito, sugerencia_array) {
    let carrito1 = carrito.filteredData;
    let array_sugerido = sugerencia_array.filteredData;
    this.contadorClicksRestaur = 0;

    console.log(carrito1, array_sugerido);

    if (this.contadorClicks <= 0) {
      carrito1.forEach((elementCarrito) => {
        array_sugerido.forEach((elementSugerido) => {
          if (elementCarrito.coditem === elementSugerido.coditem) {
            if (elementSugerido.obs !== 'No Cumple.' && elementSugerido.obs !== 'Cumple Empaque Cerrado.') {
              if (elementSugerido.cantidad_sugerida_aplicable >= 0) {
                elementCarrito.cantidad += elementSugerido.cantidad_sugerida_aplicable;
              } else {
                elementCarrito.cantidad -= elementSugerido.cantidad_sugerida_aplicable;
              }
            }
          }
        });
      });
      // Incrementar el contador de clics después de aplicar la suma
      this.contadorClicks += 1;
    }
    // 'carrito' ahora contiene todos los elementos con la cantidad sugerida aplicada
    console.log(carrito1, this.contadorClicks);
  }

  restablecerContadorClickSugerirCantidad() {
    this.contadorClicks = 0;
    this.contadorClicksRestaur = 0;
  }

  restaurarCantidadSugeridadParaCumplirEmpaqueATODO(carrito, sugerencia_array) {
    let carrito1 = carrito.filteredData;
    let array_sugerido = sugerencia_array.filteredData;
    this.contadorClicks = 0;

    console.log(carrito1, array_sugerido);

    if (this.contadorClicksRestaur <= 0) {
      carrito1.forEach((elementCarrito) => {
        // Verificar si el elemento ya ha sido sumado antes
        array_sugerido.forEach((elementSugerido) => {
          if (elementCarrito.coditem === elementSugerido.coditem) {
            if (elementSugerido.obs !== 'No Cumple.' && elementSugerido.obs !== 'Cumple Empaque Cerrado.') {
              if (elementSugerido.cantidad_sugerida_aplicable >= 0) {
                elementCarrito.cantidad -= elementSugerido.cantidad_sugerida_aplicable;
              } else {
                elementCarrito.cantidad += elementSugerido.cantidad_sugerida_aplicable;
              }
            }
          }
        });
      });
      // Incrementar el contador de clics después de aplicar la suma
      this.contadorClicksRestaur += 1;
    }

    // 'carrito' ahora contiene todos los elementos con la cantidad sugerida aplicada
    console.log(carrito1, this.contadorClicksRestaur);
  }
  // FIN MAT-TAB Precios - Descuentos Especiales





  // MAT-TAB Ultimas Proformas
  tarifaPrincipal: any = [];
  getPrecioMayorEnDetalle() {
    let array_post = {
      tabladetalle: this.array_items_carrito_y_f4_catalogo,
      dvta: this.FormularioData.value,
    };

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          this.tarifaPrincipal = datav;
          console.log(this.tarifaPrincipal);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      })
  }
  // FIN MAT-TAB Ultimas Proformas

  // const zip = new JSZip();
  // const zipContent = await this.readFile(file);
  // const zipData = await zip.loadAsync(zipContent);
  // console.log(zipData);
  // this.extractedFiles = [];


  // zipData.forEach((relativePath, zipEntry) => {
  //   zipEntry.async("string").then(content => {
  //     this.extractedFiles.push({ name: relativePath, content });
  //     //this.modalDetalleObservaciones(relativePath, content);
  //     console.log(`Archivos: ${relativePath}, Contenido: ${content}`);
  //     this.convertXmlToJson()
  //   });
  // });


  //Importar a EXCEL
  async onFileChange(event: any) {
    const file = event.target.files[0];
    console.log(file);

    if (file && file.type === 'application/x-zip-compressed') {
      // Crear un FormData y agregar el archivo
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.api.cargarArchivo('/venta/transac/veproforma/importProfinJson/', formData)
        .subscribe({
          next: (datav) => {
            //console.log(datav);
            this.toastr.success("ARCHIVO ZIP CARGADO EXITOSAMENTE ✅");
            this.imprimir_zip_importado(datav);

            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },
          error: (err: any) => {
            console.log(err);
            this.toastr.error("ERROR AL CARGAR EL ARCHIVO ❌");
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },
          complete: () => {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          }
        });
    } else {
      console.error('Please upload a valid ZIP file.');
      this.toastr.error("SOLO SELECCIONAR FORMATO .ZIP ❌");
    }
  }






  isZipFile(file: File): boolean {
    return file.name.endsWith('.zip');
  }

  readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = error => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
  //FIN Importar a EXCEL




  // Exportar a EXCEL
  exportProformaExcel(cod_proforma: any) {
    const resultado: boolean = window.confirm("Se Grabo La Proforma" + this.id_tipo_view_get_codigo + "-" + this.id_proforma_numero_id
      + " con Exito. ¿Desea Exportar el Documento? ");
    if (resultado) {
      console.log("El usuario hizo clic en Aceptar.");

      this.api.descargarArchivo('/venta/transac/veproforma/exportProforma/' + this.userConn + "/" + cod_proforma + "/" + this.codigo_cliente, { responseType: 'arraybuffer' })
        .subscribe({
          next: (datav: ArrayBuffer) => {
            console.log(datav);
            this.toastr.success("DESCARGA EN PROCESO");

            // Convertir ArrayBuffer a Blob
            const blob = new Blob([datav], { type: 'application/zip' });
            const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Formato: YYYYMMDDTHHMMSS

            // Crear el objeto URL para el Blob recibido
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = timestamp + "-" + this.cod_id_tipo_modal_id + "-" + this.id_proforma_numero_id + '.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },

          error: (err: any) => {
            console.log(err);
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },

          complete: () => {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          }
        });
    } else {
      this.toastr.error("NO SE DESCARGO");
    }
  }




  cargarDataExcel() {
    //funcion para traer data de excel abierto dando los datos pestania, celdas
    this.dialog.open(CargarExcelComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  detalleProformaCarritoTOExcel() {
    console.log(this.array_items_carrito_y_f4_catalogo);
    // console.log([this.array_items_carrito_y_f4_catalogo].length);
    //aca mapear el array del carrito para que solo esten con las columnas necesarias

    const resultado: boolean = window.confirm("¿ Desea Exportar El Detalle Del Documento a Excel ?");
    if (resultado) {
      // Convertir los datos a una hoja de cálculo
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.array_items_carrito_y_f4_catalogo);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      // Generar el archivo Excel
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Guardar el archivo
      this.saveAsExcelFile(excelBuffer, 'DetalleProforma');
    } else {
      console.log("El usuario hizo clic en Cancelar.");
    }
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Formato: YYYYMMDDTHHMMSS
    const fullFileName = `${timestamp}_${fileName}.xlsx`;

    saveAs(data, fullFileName);
  }

  //FIN Exportar a EXCEL















































  quitarDescDeposito23() {
    console.log(this.array_de_descuentos_ya_agregados);
    let borrarDesct23 = [{
      codproforma: 0,
      coddesextra: 0,
      porcen: 0,
      montodoc: 0,
      codcobranza: 0,
      codcobranza_contado: 0,
      codanticipo: 0,
      id: 0,
      aplicacion: "",
      codmoneda: this.moneda_get_catalogo,
      descrip: "",
      total_dist: 0,
      total_desc: 0,
      montorest: 0
    }];

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/reqstQuitarDescDeposito/' + this.userConn + "/" + this.BD_storage, borrarDesct23)
      .subscribe({
        next: (datav) => {
          this.tarifaPrincipal = datav;
          console.log(this.tarifaPrincipal);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => {
          this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados.filter(desct =>
            desct.coddesextra !== 23,
          );

          console.log(this.array_de_descuentos_ya_agregados);
        }
      })
  }


  eliminarItemTabla(orden, coditem) {
    console.log(orden, coditem, this.array_items_carrito_y_f4_catalogo);

    // Filtrar el array para eliminar el elemento con el número de orden dado y el código de ítem
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return item.orden !== orden || item.coditem !== coditem;
    });

    // Actualizar el origen de datos del MatTableDataSource
    this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
  }

  modalTipoID(): void {
    this.dialog.open(ModalIdtipoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
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

  modalVendedor(): void {
    this.dialog.open(ModalVendedorComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: false }
    });
  }

  modalPrecioVentaDetalle(): void {
    console.log("F4 DEL CATALOGO PRECIO VENTA DETALLE");
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

  modalDescuentoEspecialDetalle(): void {
    console.log("F4 DEL CATALOGO DESCUENTO DETALLE");
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      data: { detalle: true }
    });
  }

  modalMatrizProductos(): void {
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

    if (this.desct_nivel_actual === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE NIVEL DE DESCT.",
        }
      });
      return;
    }

    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal_codigo,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.almacn_parame_usuario,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.desct_nivel_actual,
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
        descuento: this.cod_descuento_modal_codigo,
        codcliente: this.codigo_cliente,
        codalmacen: this.almacn_parame_usuario,
        desc_linea_seg_solicitud: "",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        //itemss: this.item_seleccionados_catalogo_matriz_sin_procesar,
        descuento_nivel: this.desct_nivel_actual,
      },
    });
  }

  modalClientes(): void {
    this.dialog.open(ModalClienteComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalClientesparaReferencia(): void {
    this.dialog.open(ModalClienteComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        cliente_referencia_proforma: true
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

  modalClientesDireccion(cod_cliente): void {
    this.dialog.open(ModalClienteDireccionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { cod_cliente: cod_cliente },
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
        posicion_fija: posicion_fija
      },
    });
  }

  modalVerificarCreditoDisponible(): void {
    if (this.tipopago === '' || this.tipopago === "CONTADO") {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TIPO DE PAGO EN LA PROFORMA TIENE QUE SER CREDITO",
        }
      });
      return;
    }

    if (this.total === 0) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TOTAL TIENE QUE SER DISTINTO A 0",
        }
      });
      return;
    }

    if (this.moneda_get_catalogo === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE MONEDA",
        }
      });
      return;
    }

    if (this.codigo_cliente === '' && this.codigo_cliente === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "INGRESE CODIGO DE USUARIO EN PROFORMA",
        }
      });
      return;
    }

    this.dialog.open(VerificarCreditoDisponibleComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        cod_moneda: this.moneda_get_catalogo,
        totalProf: this.total,
        tipoPago: this.tipopago,
      }
    });
  }

  modalAnticiposProforma(): void {
    // Validaciones necesarias:
    // codcliente
    // tipopago === contado
    // total != 0

    if (this.codigo_cliente === '' && this.codigo_cliente === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "INGRESE CODIGO DE USUARIO EN PROFORMA",
        }
      });
      return;
    }

    if (this.tipopago === 1 || this.tipopago === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TIPO DE PAGO EN LA PROFORMA TIENE QUE SER CONTADO",
        }
      });
      return;
    }

    if (this.total === 0) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TOTAL TIENE QUE SER DISTINTO A 0",
        }
      });
      return;
    }

    this.dialog.open(AnticiposProformaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        nombre_cliente: this.razon_social,
        nit: this.nit_cliente,
        cod_moneda: this.moneda_get_catalogo,
        totalProf: this.total,
        tipoPago: this.tipopago,
        vendedor: this.cod_vendedor_cliente,
        id: this.id_tipo_view_get_codigo,
        numero_id: this.id_proforma_numero_id,
        cod_cliente_real: this.cliente_catalogo_real,
        total: this.total,
        tdc: this.tipo_cambio_moneda_catalogo,
        array_tabla_anticipos: this.tabla_anticipos,
      },
    });
  }

  tranferirProforma() {
    this.dialog.open(ModalTransfeProformaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  estadoPagoClientes() {
    this.dialog.open(ModalEstadoPagoClienteComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        // descuento_nivel: this.desct_nivel_actual,
        cod_cliente: this.codigo_cliente,
        // cod_almacen: this.almacn_parame_usuario,
        // cod_moneda: this.moneda_get_catalogo,
        // desc_linea: this.habilitar_desct_sgn_solicitud,
        // items: this.array_items_carrito_y_f4_catalogo,
        // fecha: this.fecha_actual
      },
    });
  }

  //SECCION DE TOTALES
  modalSubTotal() {
    this.dialog.open(ModalSubTotalComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        descuento_nivel: this.desct_nivel_actual,
        cod_cliente: this.codigo_cliente,
        cod_almacen: this.almacn_parame_usuario,
        cod_moneda: this.moneda_get_catalogo,
        desc_linea: this.habilitar_desct_sgn_solicitud,
        items: this.array_items_carrito_y_f4_catalogo,
        fecha: this.fecha_actual
      },
    });
  }

  modalRecargos() {
    let a = this.recargo_de_recargos.length;
    this.dialog.open(ModalRecargosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cabecera: this.FormularioData.value,
        items: this.array_items_carrito_y_f4_catalogo,
        recargos: this.recargo_de_recargos,
        des_extra_del_total: this.des_extra,
        cod_moneda: this.moneda_get_catalogo,
        tamanio_recargos: a,
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

    if (this.tipopago === undefined || this.tipopago === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE TIPO PAGO EN PROFORMA",
        }
      });
      return;
    }

    // if (this.tipopago === 0) {
    //   this.tipopago = 0;
    // } else {
    //   this.tipopago = 1;
    // }

    this.submitted = true;
    if (this.FormularioData.valid) {
      this.dialog.open(ModalDesctExtrasComponent, {
        width: 'auto',
        height: 'auto',
        data: {
          cabecera: this.FormularioData.value,
          desct: this.cod_descuento_total,
          contra_entrega: this.es_contra_entrega,
          items: this.array_items_carrito_y_f4_catalogo,
          recargos_del_total: this.recargos,
          cod_moneda: this.moneda_get_catalogo,
          recargos_array: this.recargo_de_recargos,
          array_de_descuentos_ya_agregados_a_modal: this.array_de_descuentos_ya_agregados,
          cmtipo_complementopf: this.disableSelect.value === false ? 0 : 1,
        }
      });
    } else {
      this.toastr.error("VALIDACION ACTIVA 🚨");
    }
  }

  modalIva() {
    console.log(this.tablaIva);
    this.dialog.open(ModalIvaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { tablaIva: this.tablaIva },
    });
  }

  modalClienteEtiqueta(cod_cliente): void {
    this.dialog.open(ModalEtiquetaComponent, {
      width: '420px',
      height: 'auto',
      data: {
        cod_cliente: cod_cliente,
        id_proforma: this.id_tipo_view_get_codigo,
        numero_id: this.id_proforma_numero_id,
        nom_cliente: this.razon_social,
        desc_linea: this.habilitar_desct_sgn_solicitud,
        id_sol_desct: this.id_solicitud_desct,
        nro_id_sol_desct: this.numero_id_solicitud_desct,
        cliente_real: this.codigo_cliente === undefined ? this.codigo_cliente : this.codigo_cliente,
      },
    });
  }

  limpiarEtiqueta() {
    this.toastr.success("Etiqueta Limpiada");

    // this.dialog.open(ModalEtiquetaComponent, {
    //   width: 'auto',
    //   height: 'auto',
    //   data: {
    //     cod_cliente: 0,
    //     id_proforma: "",
    //     numero_id: "",
    //     nom_cliente: "",
    //     desc_linea: "",
    //     id_sol_desct: "",
    //     nro_id_sol_desct: "",
    //     cliente_real: "",
    //   },
    // });
  }
  //FIN SECCION TOTALES

  //seccion mat-tab Resultado de Validacion
  resolverValidacion() {
    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: '00068',
        dataB: 140,
        dataPermiso: "122 - TRANSFERIR PROFORMA",
        dataCodigoPermiso: "122",
        //abrir: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      console.log(result);
      if (result) {
        this.tranferirProforma();
        //this.log_module.guardarLog(ventana, detalle, tipo);
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  verificarDepositoPendientesDescuentoCliente() {
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

    this.dialog.open(ModalDesctDepositoClienteComponent, {
      width: '1325px',
      height: 'auto',
      data: {
        cod_cliente: this.codigo_cliente,
        nombre_cliente: this.razon_social,
        cliente_real: this.codigo_cliente_catalogo_real === undefined ? this.codigo_cliente : this.codigo_cliente_catalogo_real,
        nit: this.nit_cliente,
      },
    });
  }




  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }











































  array_original_de_validaciones_NO_VALIDAS: any = [];
  array_original_de_validaciones_NO_VALIDAS_RESUELTAS: any = [];




  array_original_de_validaciones_copied: any = [];
  array_original_de_validaciones_validadas_OK: any = [];
  array_original_de_validaciones_validadas_OK_mostrar: any = [];

  resolverValidacionEnValidar(datoA, datoB, msj_validacion, cod_servicio, element) {
    //En este array ya estan filtrados las validaciones con observacion this.validacion_no_validos.
    console.log(element, this.validacion_no_validos);
    this.array_original_de_validaciones_copied = this.validacion_no_validos;

    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: datoA,
        dataB: datoB,
        dataPermiso: msj_validacion,
        dataCodigoPermiso: cod_servicio,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
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
          this.toastr.warning("EL Codigo" + element.Codigo + "ya se encuentra resuelto");
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
      } else {
        this.toastr.error('¡CANCELADO!');
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

  modalDetalleObservaciones(obs, obsDetalle) {
    this.dialog.open(ModalDetalleObserValidacionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        obs_titulo: obs,
        obs_contenido: obsDetalle,
      },
    });
  }

  public calcularEmpaquePorPrecio: boolean = true;
  public calcularEmpaquePorDescuento: boolean = false;

  changeValueCheck(type: string) {
    if (type === 'precio') {
      if (this.calcularEmpaquePorPrecio) {
        this.calcularEmpaquePorDescuento = false;
      }
    } else if (type === 'descuento') {
      if (this.calcularEmpaquePorDescuento) {
        this.calcularEmpaquePorPrecio = false;
      }
    }
  }










  // FUNCION QUE CONVIERTE XML A JSON, POR AHORA NO SE USARA PORQ LO HACE EL BACKEND
  // jsonDataXML: any;
  // convertXmlToJson(xmlData) {
  //   this.jsonDataXML = xmljs.xml2json(xmlData, {
  //     compact: true,
  //     ignoreComment: true, alwaysArray: true,
  //     elementNameFn: function (val) { return val.replace('foo:', '').toUpperCase(); }
  //   });
  //   console.log(this.jsonDataXML); // Asegúrate de que estés recibiendo el resultado esperado en la consola
  // }
}
