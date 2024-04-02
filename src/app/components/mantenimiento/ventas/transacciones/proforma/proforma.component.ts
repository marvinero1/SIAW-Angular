import { DatePipe } from '@angular/common';
import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
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
import { TarifaService } from '../../serviciotarifa/tarifa.service';
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
import { ModalClienteDireccionComponent } from '../../modal-cliente-direccion/modal-cliente-direccion.component';
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
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { ServicioTransfeAProformaService } from '../../modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { ModalEstadoPagoClienteComponent } from '../../modal-estado-pago-cliente/modal-estado-pago-cliente.component';
import { ModalSubTotalComponent } from '../../modal-sub-total/modal-sub-total.component';
import { ModalRecargosComponent } from '../../modal-recargos/modal-recargos.component';
import { ModalDesctExtrasComponent } from '../../modal-desct-extras/modal-desct-extras.component';
import { RecargoToProformaService } from '../../modal-recargos/recargo-to-proforma-services/recargo-to-proforma.service';
import { fastCall } from 'handsontable/helpers';
import { VentanaValidacionesComponent } from '../../ventana-validaciones/ventana-validaciones.component';

@Component({
  selector: 'app-proforma',
  templateUrl: './proforma.component.html',
  styleUrls: ['./proforma.component.scss'],
})
export class ProformaComponent implements OnInit, AfterViewInit {

  public nombre_ventana: string = "docveproforma.vb";
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
        case "inputCatalogoDireccion":
          this.modalClientesDireccion(this.codigo_cliente_catalogo);
          break;
        case "":
          this.modalCatalogoProductos();
          break;
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

  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;


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
  public venta_cliente_oficina: boolean;
  public transporte: any;
  public medio_transporte: any;
  public fletepor: any;
  public tipoentrega: any;

  public desct_nivel_actual: any = "ACTUAL";

  public codigo_vendedor_catalogo: string;
  public direccion_cen: string;
  public direccion_central_input: string;
  public direccion: string;
  public central_ubicacion: any;
  public obs: string;
  public empaque_item_codigo: string;
  public empaque_item_descripcion: string;
  public cantidad: string;
  public empaque_descripcion_concat: string;
  public selected: string = "Credito";
  public tipopago: any;
  public preparacion: any;

  public disable_input_create: boolean;
  public isDisabled: boolean = true;
  public total_desct_precio: boolean = false;
  public anticipo_button: boolean;
  public cliente_casual: boolean;
  public total_X_PU: boolean = false;
  public disableSelect = new FormControl(false);
  public habilitar_desct_sgn_solicitud: boolean;
  public empaque_view = false;
  public submitted = false;

  public idpf_complemento_view: any;
  public nroidpf_complemento_view: any;
  public input_complemento_view: any;

  public moneda_get_catalogo: any;
  public moneda_get_array: any = [];
  public tipo_cambio_moneda_catalogo: any;

  public subtotal: number = 0;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0;
  public peso: number = 0;

  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  veCliente: veCliente[] = [];

  public codigo_cliente_catalogo: string;
  public codigo_cliente_catalogo_direccion: string;
  public cliente_catalogo_real: any = [];
  public nombre_cliente_catalogo_real: string;
  public vendedor_cliente_catalogo_real: string;
  public id_solicitud_desct: string;
  public numero_id_solicitud_desct: string;


  public codigo_item_catalogo: any = [];
  public cantidad_item_matriz: number;
  public URL_maps: string;

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

  valorPredeterminadoPreparacion = "NORMAL";
  valorPredeterminadoTipoPago = "CONTADO";

  displayedColumns = ['orden', 'item', 'descripcion', 'medida', 'unidad', 'iva', 'pedido',
    'cantidad', 'sld', 'tp', 'de', 'pul', 'niv', 'porcentaje', 'pd', 'pu', 'total'];

  displayedColumns_validacion = ['codControl', 'descripcion', 'valido', 'codservicio', 'descservicio', 'datoA',
    'datoB', 'claveservicio', 'resolver', 'detalleObs', 'validar'];

  displayedColumns_ultimas_proformas = ['id', 'numero_id', 'cod_cliente', 'cliente_real',
    'nombre_cliente', 'nit', 'fecha', 'total', 'item', 'aprobada', 'transferida']

  displayedColumns_venta_23_dias = ['codproforma', 'id', 'numero_id', 'cod_cliente', 'cod_cliente_real', 'nom_cliente',
    'nit', 'fecha', 'total', 'item', 'cantidad', 'moneda', 'aprobada', 'transferida'];

  displayedColumns_precios_desct = ['codproforma', 'id', 'numero_id', 'cod_cliente', 'cod_cliente_real', 'nom_cliente',
    'nit', 'fecha', 'total', 'item', 'cantidad', 'moneda', 'aprobada', 'transferida'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  dataSource_validacion = new MatTableDataSource();
  dataSourceWithPageSize_validacion = new MatTableDataSource();

  dataSource__venta_23_dias = new MatTableDataSource();
  dataSourceWithPageSize__venta_23_dias = new MatTableDataSource();

  dataSource_precios_desct = new MatTableDataSource();
  dataSourceWithPageSize_precios_desct = new MatTableDataSource();

  constructor(public dialog: MatDialog, private api: ApiService, public itemservice: ItemServiceService,
    public servicioCliente: ServicioclienteService, public almacenservice: ServicioalmacenService,
    public serviciovendedor: VendedorService, public servicioTarifa: TarifaService, public servicioPrecioVenta: ServicioprecioventaService,
    private datePipe: DatePipe, private serviciMoneda: MonedaServicioService, private renderer: Renderer2,
    private _formBuilder: FormBuilder, public servicioDesctEspecial: DescuentoService, private serviciotipoid: TipoidService,
    private toastr: ToastrService, private spinner: NgxSpinnerService, public log_module: LogService, public saldoItemServices: SaldoItemMatrizService,
    public _snackBar: MatSnackBar, public servicioTransfeProformaCotizacion: ServicioTransfeAProformaService,
    public servicio_recargo_proforma: RecargoToProformaService) {

    this.FormularioData = this.createForm();

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.api.getRolUserParaVentana(this.usuarioLogueado, this.nombre_ventana);

    if (this.agencia_logueado === 'Loc') {
      this.agencia_logueado = '311'
    }
  }

  ngOnInit() {
    this.getDesctLineaIDTipo();

    //ID TIPO
    this.serviciotipoid.disparadorDeIDTipo.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.cod_id_tipo_modal = data.id_tipo;
      this.cod_id_tipo_modal_id = this.cod_id_tipo_modal.id
    });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacn_parame_usuario = data.almacen.codigo;
    });
    //

    //Vendedor
    this.serviciovendedor.disparadorDeVendedores.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_vendedor_cliente_modal = data.vendedor;
    });
    //finvendedor

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo
    });
    // fin_precio_venta

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.subscribe(data => {
      console.log("Recibiendo Descuento: ", data);
      this.cod_descuento_modal = data.descuento;
      this.cod_descuento_modal_codigo = this.cod_descuento_modal.codigo
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









    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.subscribe(data_carrito => {
      console.log("Recibiendo Item de Carrito Compra: ", data_carrito);
      this.array_items_carrito_y_f4_catalogo = data_carrito
      this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
      console.log("ARRAY COMPLETO DE MATRIZ Y F4: " + this.array_items_carrito_y_f4_catalogo);

      for (let i = 0; i < this.array_items_carrito_y_f4_catalogo.length; i++) {
        this.array_items_carrito_y_f4_catalogo[i].orden_creciente = i + 1;
      }

      //ACA SE DIBUJA LA TABLA CON LA INFO DEL CARRITO DE COMPRAS YA CON LOS ITEM TRABAJADOS EN EL BACKEND
      this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
    });
    //

    //Item Sin Procesar DEL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsSeleccionadosSinProcesar.subscribe(data => {
      console.log("Recibiendo Item Sin Procesar: ", data);
      this.item_seleccionados_catalogo_matriz_sin_procesar = data;
    });
    //

    //CATALOGO F4 ITEMS
    //ItemElejidoCatalogoF4Procesados
    this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.subscribe(data => {
      console.log("Recibiendo Item Procesados De Catalogo F4: ", data);
      this.item_seleccionados_catalogo_matriz = data;
      this.array_items_carrito_y_f4_catalogo.push(this.item_seleccionados_catalogo_matriz);

      console.log("ARRAY COMPLETO DE MATRIZ Y F4: " + this.array_items_carrito_y_f4_catalogo);

      for (let i = 0; i < this.array_items_carrito_y_f4_catalogo.length; i++) {
        this.array_items_carrito_y_f4_catalogo[i].orden_creciente = i + 1;
      }

      //ACA SE DIBUJA LA TABLA CON LA INFO DEL CARRITO DE COMPRAS YA CON LOS ITEM TRABAJADOS EN EL BACKEND
      this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
    });
    //

    //ItemSinProcesarCatalogoF4
    this.itemservice.disparadorDeItemsCatalogo.subscribe(data => {
      console.log("Recibiendo Item Sin Procesar de Catalogo F4: ", data);
      this.item_seleccionados_catalogo_matriz_sin_procesar_catalogo = data;
    });
    //FIN CATALOGO F4 ITMES










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

    //Clientes
    this.servicioCliente.disparadorDeClientes.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.codigo_cliente_catalogo = data.cliente.codigo;

      this.getClientByID(this.codigo_cliente_catalogo);
      this.getDireccionCentral(this.codigo_cliente_catalogo);
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


    //RECARGOS
    this.servicio_recargo_proforma.disparadorDeRecargo_a_Proforma.subscribe(data => {
      console.log("Recibiendo Recargo: ", data);
      this.recargo_de_recargos = data;
    });
    //FIN DE RECARGOS
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
  }

  createForm(): FormGroup {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      //codigo: [0],
      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      fecha: ["2024-02-16"],
      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: [this.dataform.descuentos, Validators.compose([Validators.required])],
      tipopago: [this.dataform.tipopago, Validators.compose([Validators.required])],
      transporte: [this.dataform.transporte, Validators.compose([Validators.required])],
      tipo_docid: [this.dataform.tipo_docid, Validators.compose([Validators.required])],
      preparacion: [this.dataform.preparacion, Validators.compose([Validators.required])],
      fecha_inicial: ["2024-02-16"],
      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],
      fechaaut: [null],
      fecha_confirmada: [null],
      hora_confirmada: [null],
      hora_inicial: [hour],
      usuarioaut: [null],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],
      //cliente_real: [this.dataform.cliente_real === null ? this.codigo_cliente : this.dataform.cliente_real],
      obs: [this.dataform.obs],
      obs2: [null],
      fletepor: [this.dataform.fletepor],
      direccion: [this.dataform.direccion],
      tipoentrega: [this.dataform.tipoentrega === undefined ? "ENTREGAR" : this.dataform.tipoentrega],
      peso: [this.dataform.peso],
      codcliente_real: [this.dataform.cliente_real === null ? this.codigo_cliente : this.dataform.cliente_real],

      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],

      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email],
      complemento_ci: [this.dataform.complemento_ci],
      venta_cliente_oficina: [this.dataform.venta_cliente_oficina === null ? false : true],
      tipo_venta: ['0', Validators.required],
      //nomcliente_casual: [this.dataform.nomcliente_casual],
      //razon_social: [this.dataform.razon_social],
      estado_contra_entrega: [this.dataform.estado_contra_entrega],
      contra_entrega: [this.dataform.contra_entrega === null ? false : true],
      //celular: [this.dataform.celular],
      nombre_transporte: [this.dataform.nombre_transporte],
      odc: [this.dataform.odc === null ? " " : this.dataform.odc],


      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud === undefined ? 0 : this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud
      idsoldesctos: [this.dataform.idsoldesctos === undefined ? "" : this.dataform.idsoldesctos], //Descuentos de Linea de Solicitud
      nroidsoldesctos: [this.dataform.nroidsoldesctos === null ? 0 : this.dataform.nroidsoldesctos], //Descuentos de Linea de Solicitud


      idanticipo: [""], //anticipo Ventas
      numeroidanticipo: [0], //anticipo Ventas
      monto_anticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [false], //anticipo Ventas


      tipo_complementopf: [this.dataform.tipo_complementopf === null ? 0 : this.dataform.tipo_complementopf], //aca es para complemento de proforma
      idpf_complemento: [this.dataform.idpf_complemento === null ? 0 : this.dataform.idpf_complemento], //aca es para complemento de proforma
      nroidpf_complemento: [this.dataform.nroidpf_complemento === null ? 0 : this.dataform.nroidpf_complemento], //aca es para complemento de proforma
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVISAR

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

      fechareg: ["2024-02-16"],
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
  }

  mandarEntregar() {
    this.tipoentrega = "ENTREGAR"
  }

  get f() {
    return this.FormularioData.controls;
  }

  submitData() {
    let total_proforma_concat: any = [];
    this.submitted = true;
    let data = this.FormularioData.value;
    console.log(data);

    total_proforma_concat = {
      // veproforma: {
      //   "id": "PYM01",
      //   "numeroid": 2477,
      //   "codalmacen": 311,
      //   "codcliente": "303119",
      //   "nomcliente": "ARMINDA CHOQUE CORONADO DE PORTUGAL",
      //   "nit": "12492433",
      //   "codvendedor": 31201,
      //   "codmoneda": "BS",
      //   "fecha": "2024-02-16",
      //   "tdc": 1,
      //   "tipopago": 0,
      //   "subtotal": 148.21,
      //   "descuentos": 0,
      //   "recargos": 0,
      //   "total": 129.17,
      //   "anulada": false,
      //   "transporte": "CAMION PERTEC",
      //   "fletepor": "OTROS",
      //   "direccion": "AV. CAPITAN VICTOR USTARIZ ENTRE C/C.W. CEVALLOS (CERCADO - CBBA - PCBA)",
      //   "aprobada": false,
      //   "paraaprobar": false,
      //   "transferida": false,
      //   "fechaaut": null,
      //   "codcomplementaria": 0,
      //   "obs": "---",
      //   "obs2": null,
      //   "horareg": "09:22",
      //   "fechareg": "2024-02-16",
      //   "usuarioreg": "DPD3",
      //   "preparacion": "NORMAL",
      //   "iva": 0,
      //   "horaaut": "09:23",
      //   "tipoentrega": "ENTREGAR",
      //   "porceniva": 0,
      //   "odc": "",
      //   "peso": 34.23575,
      //   "impresa": false,
      //   "etiqueta_impresa": false,
      //   "fecha_inicial": "2024-02-16",
      //   "hora_inicial": "09:22",
      //   "usuarioaut": null,
      //   "confirmada": false,
      //   "fecha_confirmada": null,
      //   "hora_confirmada": null,
      //   "contra_entrega": true,
      //   "idanticipo": "",
      //   "numeroidanticipo": 0,
      //   "monto_anticipo": 0,
      //   "pago_contado_anticipado": false,
      //   "codcliente_real": "303119",
      //   "venta_cliente_oficina": false,
      //   "estado_contra_entrega": "POR CANCELAR",
      //   "nombre_transporte": "CAMION PERTEC",
      //   "desclinea_segun_solicitud": false,
      //   "idsoldesctos": "",
      //   "nroidsoldesctos": 0,
      //   "latitud_entrega": "-17.396827",
      //   "longitud_entrega": "-66.189689",
      //   "hora": "09:22",
      //   "ubicacion": "LOCAL",
      //   "es_sol_urgente": false,
      //   "niveles_descuento": "ACTUAL",
      //   "idpf_complemento": "", //aca es para complemento de proforma
      //   "nroidpf_complemento": 0, //aca es para complemento de proforma
      //   "complemento_ci": "",
      //   "tipo_venta": 0,
      //   "tipo_docid": 1,
      //   "email": "facturasventas@pertec.com.bo",
      //   "tipo_complementopf": 0
      // },

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
      veproforma_anticipo: [],
      vedesextraprof: [],
      verecargoprof: [{
        "codproforma": 0,
        "codrecargo": 0,
        "porcen": 0,
        "monto": 0,
        "moneda": "BS",
        "montodoc": 0,
        "codcobranza": 0
      }],
      veproforma_iva: this.veproforma_iva,
    }

    if (this.FormularioData.valid) {
      console.log("DATOS VALIDADOS");

      let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/guardarProforma/";
      return this.api.create("/venta/transac/veproforma/guardarProforma/" + this.userConn + "/" + this.cod_id_tipo_modal_id + "/" + this.BD_storage.bd, total_proforma_concat)
        .subscribe({
          next: (datav) => {
            this.totabilizar_post = datav;
            console.log(this.totabilizar_post);
            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 1500);
            window.location.reload();
          },

          error: (err) => {
            console.log(err, errorMessage);
            this.toastr.error('! NO SE GRABO !');
          },
          complete: () => {

          }
        })
    } else {
      console.log("HAY Q VALIDAR DATOS");
    }



  }

  infoItemTotalSubTotal(array) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";
    return this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/" + this.BD_storage.bd + "/" + this.usuarioLogueado, array)
      .subscribe({
        next: (datav) => {
          console.log('data', datav);
          this.item_seleccionados_catalogo_matriz = datav
          this.dataSource = new MatTableDataSource(this.item_seleccionados_catalogo_matriz);
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getIdTipo() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/catalogoNumProf/";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo_view_get_array = datav;
          // console.log(this.id_tipo_view_get_array);

          this.id_tipo_view_get_array_copied = this.id_tipo_view_get_array.slice();
          this.id_tipo_view_get_first = this.id_tipo_view_get_array_copied.shift();
          // console.log(this.id_tipo_view_get_first);
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getNumActProd/";
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

  // onLeaveCodigoCliente(event: any) {
  //   this.renderer.selectRootElement('#input_id_email').focus();
  // }

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
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getAlmacenUser/";
    return this.api.getAll('/venta/transac/veproforma/getAlmacenUser/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          console.log('data', this.almacn_parame_usuario);
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
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
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
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          this.tarifa_get_unico_copied = this.tarifa_get_unico.slice();
          this.cod_precio_venta_modal_first = this.tarifa_get_unico_copied.shift();
          this.cod_precio_venta_modal_codigo = this.cod_precio_venta_modal_first.codigo

          console.log("Precio Venta: ", this.cod_precio_venta_modal_codigo);
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
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  getDescuentos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --vedescuento/catalogo";

    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          // this.descuentos_get_copied = this.descuentos_get.slice();
          // this.descuentos_get_unico = this.descuentos_get_copied.shift();
          // this.cod_descuento_modal_codigo = this.descuentos_get_unico.codigo;
          // console.log(this.descuentos_get_unico);
          this.cod_descuento_modal_codigo = 0;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }


  aplicarPrecioVenta(value) {
    this.item_seleccionados_catalogo_matriz_copied = this.item_seleccionados_catalogo_matriz.slice();
    console.log("Entra a la funcion aplicarPrecioVenta", value);

    this.item_seleccionados_catalogo_matriz = this.item_seleccionados_catalogo_matriz_copied.map(item => {
      return { ...item, codtarifa: value, total: 0 };
    });

    console.log(this.item_seleccionados_catalogo_matriz);
    this.dataSource = new MatTableDataSource(this.item_seleccionados_catalogo_matriz);

    this.total_desct_precio = true;
    this.total = 0;
    this.subtotal = 0;

    const resultado: boolean = window.confirm("¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA?, ESTA ACCION PUEDE TOMAR UN TIEMPO");
    if (resultado) {
      console.log("LE DIO AL SI HAY Q TOTALIZAR, ");
      this.totabilizar();
    } else {
      console.log("LE DIO AL NO, NO HAY Q TOTALIZAR")
    }
  }

  aplicarDesctEspc(value) {
    this.item_seleccionados_catalogo_matriz_copied = this.item_seleccionados_catalogo_matriz.slice();
    console.log("Entra a la funcion aplicarDesctEspc", value);

    this.item_seleccionados_catalogo_matriz = this.item_seleccionados_catalogo_matriz_copied.map(item => {
      return { ...item, coddescuento: value, total: 0 };
    });

    console.log(this.item_seleccionados_catalogo_matriz);
    this.dataSource = new MatTableDataSource(this.item_seleccionados_catalogo_matriz);

    this.total_desct_precio = true;
    this.total = 0;
    this.subtotal = 0;

    const resultado: boolean = window.confirm("¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA?, ESTA ACCION PUEDE TOMAR UN TIEMPO");
    if (resultado) {
      console.log("LE DIO AL SI HAY Q TOTALIZAR");
      this.totabilizar();
    } else {
      console.log("LE DIO AL NO, NO HAY Q TOTALIZAR")
    }
  }

  totabilizarProformaCotizacion(items_detalle) {

  }

  setEmailDefault() {
    this.email_cliente = "facturasventas@pertec.com.bo";
  }

  getClientByID(codigo) {
    console.log(codigo);
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/mant/vecliente/ --cliente";
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
        }
      })
  }

  mandarCodCliente(cod_cliente) {
    this.servicioCliente.disparadorDeClientes.emit({
      cliente: {
        codigo: cod_cliente,
      }
    });
  }

  getAllmoneda() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
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
        complete: () => {

        }
      })
  }

  getDesctLineaIDTipo() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
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

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
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
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
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
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
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
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
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
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vetienda/getCentral/' + this.userConn + "/" + cod_usuario)
      .subscribe({
        next: (datav) => {
          this.direccion_central = datav;
          this.direccion_central_input = this.direccion_central.direccion;
          //console.log(this.direccion_central);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  // MAT-TAB-GROUP RESULTADO DE VALIDACION
  getDetalleItemResultadoValidacion(item, tarifa, descuento, cantidad) {

    let data: any = [


    ];

    this.fecha_actual_empaque = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")
    console.log(this.fecha_actual_empaque);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.create('venta/transac/veproforma/validarProforma/dpd3_310_PE/vacio/proforma/grabar_aprobar', data)
      .subscribe({
        next: (datav) => {
          this.itemTabla = datav;
          // console.log(this.itemTabla);


          // aca agrega los items a un arrays de items
          this.arr.push(datav);


          // this.arr.map(function(dato){
          //   dato.cantidad = cantidad;
          //   return dato;
          // })

          console.log(this.arr);



          this.dataSource = new MatTableDataSource(this.arr);
          // this.dataSource.paginator = this.paginator;
          // this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  //FIN MAT-TAB-GROUP RESULTADO DE VALIDACION

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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/pesoEmpaqueSaldo/' + this.userConn + "/1" + "/2/" + item + "/" + "311" + "/" + this.BD_storage.bd)
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

          console.log(this.empaquesItem);
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
    this.tipopago = " ";

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
    this.central_ubicacion = false;
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

    this.tablaInicializada();
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

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /actualizarCorreoCliente --Update";
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
    let nit_string = this.nit_cliente.toString();

    let data = {
      codSN: this.codigo_cliente,
      nomcliente_casual: this.nombre_comercial_razon_social,
      nit_cliente_casual: nit_string,
      tipo_doc_cliente_casual: tipo_doc_cliente_parse_string,
      email_cliente_casual: this.email_cliente === undefined ? this.email : this.email_cliente,
      celular_cliente_casual: this.whatsapp_cliente,
      codalmacen: this.almacn_parame_usuario,
      codvendedor: this.cod_vendedor_cliente_modal,

      usuarioreg: usuario_logueado,
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/crearCliente/";
    return this.api.create('/venta/transac/veproforma/crearCliente/' + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.usuario_creado_save = datav;
          console.log(this.usuario_creado_save);

          this.toastr.success('!CLIENTE GUARDADO!');
          this._snackBar.open('!CLIENTE GUARDADO!', 'Ok', {
            duration: 2000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })

  }

  btnVerificarCreditoDisponible() {
    let a = {
      "veproforma": {
        "id": "PYM01",
        "numeroid": 2477,
        "codalmacen": 311,
        "codcliente": "303119",
        "nomcliente": "ARMINDA CHOQUE CORONADO DE PORTUGAL",
        "nit": "12492433",
        "codvendedor": 31201,
        "codmoneda": "BS",
        "fecha": "2024-02-16",
        "tdc": 1,
        "tipopago": 0,
        "subtotal": 148.21,
        "descuentos": 19.04,
        "recargos": 0,
        "total": 129.17,
        "anulada": false,
        "transporte": "CAMION PERTEC",
        "fletepor": "OTROS",
        "direccion": "AV. CAPITAN VICTOR USTARIZ ENTRE C/C.W. CEVALLOS (CERCADO - CBBA - PCBA)",
        "aprobada": false,
        "paraaprobar": false,
        "transferida": false,
        "fechaaut": null,
        "codcomplementaria": 0,
        "obs": "---",
        "obs2": null,
        "horareg": "09:22",
        "fechareg": "2024-02-16",
        "usuarioreg": "DPD3",
        "preparacion": "NORMAL",
        "iva": 0,
        "horaaut": "09:23",
        "tipoentrega": "ENTREGAR",
        "porceniva": 0,
        "odc": "",
        "peso": 34.23575,
        "impresa": false,
        "etiqueta_impresa": false,
        "fecha_inicial": "2024-02-16",
        "hora_inicial": "09:22",
        "usuarioaut": null,
        "confirmada": false,
        "fecha_confirmada": null,
        "hora_confirmada": null,
        "contra_entrega": true,
        "idanticipo": "",
        "numeroidanticipo": 0,
        "monto_anticipo": 0,
        "pago_contado_anticipado": false,
        "codcliente_real": "303119",
        "venta_cliente_oficina": false,
        "estado_contra_entrega": "POR CANCELAR",
        "nombre_transporte": "CAMION PERTEC",
        "desclinea_segun_solicitud": false,
        "idsoldesctos": "",
        "nroidsoldesctos": 0,
        "latitud_entrega": "-17.396827",
        "longitud_entrega": "-66.189689",
        "hora": "09:22",
        "ubicacion": "LOCAL",
        "es_sol_urgente": false,
        "niveles_descuento": "ACTUAL",
        "idpf_complemento": "",
        "nroidpf_complemento": 0,
        "complemento_ci": "",
        "tipo_venta": 0,
        "tipo_docid": 1,
        "email": "facturasventas@pertec.com.bo",
        "tipo_complementopf": 0
      },

      "veproforma1": [
        {
          "codproforma": 0,
          "coditem": "01VZNJ37",
          "cantidad": 15,
          "udm": "PZ",
          "precioneto": 1.127840,
          "preciodesc": 1.127840,
          "niveldesc": "X",
          "preciolista": 1.127840,
          "codtarifa": 1,
          "coddescuento": 0,
          "total": 16.917600,
          "cantaut": 15.00,
          "totalaut": 16.917600,
          "obs": "",
          "porceniva": 0,
          "cantidad_pedida": 15,
          "peso": 6,
          "nroitem": 1
        },
        {
          "codproforma": 0,
          "coditem": "02EPAD28",
          "cantidad": 3000,
          "udm": "PZ",
          "precioneto": 0.007110,
          "preciodesc": 0.007110,
          "niveldesc": "X",
          "preciolista": 0.007110,
          "codtarifa": 1,
          "coddescuento": 0,
          "total": 21.330000,
          "cantaut": 3000.00,
          "totalaut": 21.330000,
          "obs": "",
          "porceniva": 0,
          "cantidad_pedida": 3000,
          "peso": 4.3590000,
          "nroitem": 2
        },
        {
          "codproforma": 0,
          "coditem": "03EAGE07",
          "cantidad": 5000,
          "udm": "PZ",
          "precioneto": 0.008730,
          "preciodesc": 0.009000,
          "niveldesc": "X",
          "preciolista": 0.009000,
          "codtarifa": 1,
          "coddescuento": 301,
          "total": 43.650000,
          "cantaut": 5000.00,
          "totalaut": 43.650000,
          "obs": "",
          "porceniva": 0,
          "cantidad_pedida": 5000,
          "peso": 9.1000000,
          "nroitem": 3
        }
      ],
      "veproforma_valida": [
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
      "veproforma_anticipo": [
      ],
      "vedesextraprof": [
        {
          "codproforma": 0,
          "coddesextra": 14,
          "porcen": 10.00,
          "montodoc": 14.82,
          "codcobranza": 0,
          "codcobranza_contado": 0,
          "codanticipo": 0
        },
        {
          "codproforma": 0,
          "coddesextra": 23,
          "porcen": 100.00,
          "montodoc": 0.08,
          "codcobranza": 122226,
          "codcobranza_contado": 0,
          "codanticipo": 0
        },
        {
          "codproforma": 0,
          "coddesextra": 23,
          "porcen": 100.00,
          "montodoc": 4.14,
          "codcobranza": 122227,
          "codcobranza_contado": 0,
          "codanticipo": 0
        }
      ],
      "verecargoprof": [

      ],
      "veproforma_iva": [
        {
          "codproforma": 0,
          "porceniva": 0,
          "total": 148.21,
          "porcenbr": -12.85,
          "br": -19.04,
          "iva": 0
        }
      ]
    }

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /actualizarCorreoCliente --Update";
    return this.api.create('/venta/transac/veproforma/totabilizarProf/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage.bd + "/" + 'false' + "/" + "1" + "/" + "ACTUAL", a)
      .subscribe({
        next: (datav) => {
          console.log("TOTABILIZAR HARDCODIADO: ", datav);
          this.item_seleccionados_catalogo_matriz = datav.detalleProf;
          this.dataSource = new MatTableDataSource(this.item_seleccionados_catalogo_matriz);

          this.total = datav.totales.total;
          this.subtotal = datav.totales.subtotal;
          this.recargos = datav.totales.recargo;
          this.des_extra = datav.totales.descuento;
          this.iva = datav.totales.iva;
          this.peso = datav.totales.peso;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE TOTALIZO ! HARDCODIADO Xd Xd');
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



  cambiarBoolValorTotal() {
    this.total_desct_precio = false;
    this.total_X_PU = true;
  }

  copiarCantidad(element: any) {
    console.log(element);

    this.total_desct_precio = true;
    element.cantidad = element.cantidad_pedida;
  }

  recalcularPedidoXPU(cantidad, preciolista) {
    console.log(cantidad, preciolista);
  }

  calcularTotalCantidadXPU(cantidad_pedida: number, cantidad: number, preciolista: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && preciolista !== undefined && cantidad !== undefined) {
      if (this.total_X_PU === true) {
        return cantidad * preciolista;
      } else {
        // console.log(input);
        let cantidadPedida = cantidad_pedida;
        // Realizar cálculos solo si los valores no son undefined
        //console.log(cantidadPedida, preciolista);
        return cantidadPedida * preciolista;
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
        dataPermiso: "122 - TRANSFERIR PROFORMA",
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

  totabilizar() {
    let total_proforma_concat: any = [];
    let item_procesados_en_total: any = [];
    let veproforma_valida: [{
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
    ];
    console.log("ENTRO A LA FUNCION SACAR TOTAL");
    this.veproforma = [this.FormularioData.value];
    // this.veproforma1 = this.item_seleccionados_catalogo_matriz;

    //ACA PONER A LA TABLA DEL DATA SOURCE SI SE MODIFICA LA CANTIDFAD O EL PEDIDO
    //this.veproforma1 = this.item_seleccionados_catalogo_matriz_sin_procesar;
    this.veproforma1 = this.array_items_carrito_y_f4_catalogo;
    this.veproforma_valida = veproforma_valida;
    this.veproforma_anticipo = [];
    this.vedesextraprof = [];
    this.verecargoprof = this.recargo_de_recargos.recargo_array;
    this.veproforma_iva = [{
      "codproforma": 0,
      "porceniva": 0,
      "total": this.total,
      "porcenbr": 0,
      "br": 0,
      "iva": this.iva
    }];

    console.log(this.veproforma, this.veproforma1, this.veproforma_valida, this.veproforma_anticipo,
      this.vedesextraprof, this.verecargoprof, this.veproforma_iva);


    //total_proforma_concat = this.veproforma.concat(this.veproforma1);
    total_proforma_concat = {
      // veproforma: {
      //   "id": "PYM01",
      //   "numeroid": 2477,
      //   "codalmacen": 311,
      //   "codcliente": "303119",
      //   "nomcliente": "ARMINDA CHOQUE CORONADO DE PORTUGAL",
      //   "nit": "12492433",
      //   "codvendedor": 31201,
      //   "codmoneda": "BS",
      //   "fecha": "2024-02-16",
      //   "tdc": 1,
      //   "tipopago": 0,
      //   "subtotal": 148.21,
      //   "descuentos": 0,
      //   "recargos": 0,
      //   "total": 129.17,
      //   "anulada": false,
      //   "transporte": "CAMION PERTEC",
      //   "fletepor": "OTROS",
      //   "direccion": "AV. CAPITAN VICTOR USTARIZ ENTRE C/C.W. CEVALLOS (CERCADO - CBBA - PCBA)",
      //   "aprobada": false,
      //   "paraaprobar": false,
      //   "transferida": false,
      //   "fechaaut": null,
      //   "codcomplementaria": 0,
      //   "obs": "---",
      //   "obs2": null,
      //   "horareg": "09:22",
      //   "fechareg": "2024-02-16",
      //   "usuarioreg": "DPD3",
      //   "preparacion": "NORMAL",
      //   "iva": 0,
      //   "horaaut": "09:23",
      //   "tipoentrega": "ENTREGAR",
      //   "porceniva": 0,
      //   "odc": "",
      //   "peso": 34.23575,
      //   "impresa": false,
      //   "etiqueta_impresa": false,
      //   "fecha_inicial": "2024-02-16",
      //   "hora_inicial": "09:22",
      //   "usuarioaut": null,
      //   "confirmada": false,
      //   "fecha_confirmada": null,
      //   "hora_confirmada": null,
      //   "contra_entrega": true,
      //   "idanticipo": "",
      //   "numeroidanticipo": 0,
      //   "monto_anticipo": 0,
      //   "pago_contado_anticipado": false,
      //   "codcliente_real": "303119",
      //   "venta_cliente_oficina": false,
      //   "estado_contra_entrega": "POR CANCELAR",
      //   "nombre_transporte": "CAMION PERTEC",
      //   "desclinea_segun_solicitud": false,
      //   "idsoldesctos": "",
      //   "nroidsoldesctos": 0,
      //   "latitud_entrega": "-17.396827",
      //   "longitud_entrega": "-66.189689",
      //   "hora": "09:22",
      //   "ubicacion": "LOCAL",
      //   "es_sol_urgente": false,
      //   "niveles_descuento": "ACTUAL",
      //   "idpf_complemento": "", //aca es para complemento de proforma
      //   "nroidpf_complemento": 0, //aca es para complemento de proforma
      //   "complemento_ci": "",
      //   "tipo_venta": 0,
      //   "tipo_docid": 1,
      //   "email": "facturasventas@pertec.com.bo",
      //   "tipo_complementopf": 0
      // },
      veproforma: this.FormularioData.value,
      veproforma1: this.veproforma1,
      veproforma_valida: [this.veproforma_valida],
      veproforma_anticipo: [],
      vedesextraprof: [],
      verecargoprof: [],
      veproforma_iva: [],
    }

    console.log(total_proforma_concat);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
    return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage.bd + "/" + 'false' + "/" + "1" + "/" + "ACTUAL", total_proforma_concat)
      .subscribe({
        next: (datav) => {
          this.totabilizar_post = datav;
          console.log(this.totabilizar_post);
          this.toastr.success('! TOTALIZADO EXITOSAMENTE !');
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE TOTALIZO !');
        },
        complete: () => {
          this.total = this.totabilizar_post.totales.total;
          this.subtotal = this.totabilizar_post.totales.subtotal;
          this.recargos = this.totabilizar_post.totales.recargo;
          this.des_extra = this.totabilizar_post.totales.descuento;
          this.iva = this.totabilizar_post.totales.iva;
          this.peso = this.totabilizar_post.totales.peso;
          item_procesados_en_total = this.totabilizar_post.detalleProf;


          this.dataSource = new MatTableDataSource(item_procesados_en_total);
        }
      })
  }

  totabilizarConParametros() {

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


    this.preparacion = proforma.cabecera.preparacion;
    this.subtotal = 0;
    this.recargos = 0;
    this.des_extra = 0;
    this.iva = 0;
    this.total = 0;

    this.item_seleccionados_catalogo_matriz = proforma.detalle;
    this.veproforma1 = proforma.detalle;


    //la cabecera asignada a this.veproforma para totalizar y grabar
    this.veproforma = proforma.cabecera
    //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = proforma.detalle

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
    this.dataSource = new MatTableDataSource(cotizacion.detalle);
  }


  buscadorIDComplementarProforma(complemento_id, complemento_numero_id) {
    console.log(complemento_id, complemento_numero_id);
  }

  getSaldoItemSeleccionadoDetalle(item) {
    let agencia_concat = "AG" + this.agencia_logueado;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage.bd + "/" + this.usuarioLogueado)
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
        complete: () => {

        }
      })
  }

  ids_complementar_proforma: any = [];

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
        complete: () => {

        }
      })
  }




























































  eliminarItemTabla(item) {
    console.log(item);

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(i => i.coditem !== item);
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
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDesctExtrasComponent, {
      width: 'auto',
      height: 'auto',
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
        codalmacen: this.almacn_parame_usuario,
        desc_linea_seg_solicitud: "",
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
      data: { cod_almacen: cod_almacen, cod_item: this.item_seleccionados_catalogo_matriz_codigo, posicion_fija: posicion_fija },
    });
  }

  modalVerificarCreditoDisponible(): void {
    this.dialog.open(VerificarCreditoDisponibleComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        cod_moneda: this.moneda_get_catalogo,
        totalProf: this.total,
        tipoPago: this.tipopago
      },
    });
  }

  modalAnticiposProforma(): void {
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
        vendedor: this.almacn_parame_usuario,
      },
    });
  }

  modalClienteEtiqueta(cod_cliente): void {
    this.dialog.open(ModalEtiquetaComponent, {
      width: 'auto',
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

    this.dialog.open(ModalEtiquetaComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        cod_cliente: 0,
        id_proforma: "",
        numero_id: "",
        nom_cliente: "",
        desc_linea: "",
        id_sol_desct: "",
        nro_id_sol_desct: "",
        cliente_real: "",
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
    });
  }

  modalSubTotal() {
    this.dialog.open(ModalSubTotalComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        cod_almacen: this.almacn_parame_usuario,
        cod_moneda: this.moneda_get_catalogo,
        desc_linea: this.habilitar_desct_sgn_solicitud,
        items: this.item_seleccionados_catalogo_matriz,
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
        recargos: this.recargo_de_recargos,
      },
    });
  }

}
