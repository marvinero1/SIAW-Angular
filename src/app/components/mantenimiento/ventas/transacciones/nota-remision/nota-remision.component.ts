import { Component, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ItemDetalle, veCliente } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicioclienteService } from '../../serviciocliente/serviciocliente.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { TipoidService } from '../../serviciotipoid/tipoid.service';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { ModalIdtipoComponent } from '../../modal-idtipo/modal-idtipo.component';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { MatrizItemsComponent } from '../../matriz-items/matriz-items.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { ModalSaldosComponent } from '../../matriz-items/modal-saldos/modal-saldos.component';
import { ModalTransfeNotaRemisionComponent } from '../../modal-transfe-nota-remision/modal-transfe-nota-remision.component';
import { DatePipe } from '@angular/common';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { ServicioTransfeAProformaService } from '../../modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { ModalSubTotalComponent } from '../../modal-sub-total/modal-sub-total.component';
import { ModalIvaComponent } from '../../modal-iva/modal-iva.component';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-nota-remision',
  templateUrl: './nota-remision.component.html',
  styleUrls: ['./nota-remision.component.scss']
})
export class NotaRemisionComponent implements OnInit, AfterViewInit {

  public nombre_ventana: string = "docveremision.vb";
  public ventana: string = "Notas De Remision";
  public detalle = "Notas De Remision";
  public tipo = "transaccion-nota-remision-POST";

  @HostListener("document:keydown.F4", []) unloadHandler() {
    this.modalMatrizProductos();
  }

  @HostListener("document:keydown.F5", []) unloadHandler2(event: Event) {
    console.log("No se puede actualizar");
    event.preventDefault();
    this.toastr.warning('TECLA DESHABILITADA ⚠️');
  }

  @HostListener("document:keydown.Delete", []) unloadHandler7() {
    console.log("Borrar items de detalle de carrito");
    this.onRowSelectForDelete();
  }

  nrSelect: string = "Normal";
  tipoPagoSelect: string = "CREDITO";
  opcions_preparacion = ['Normal', 'Urgente', 'Final', 'Urgente Provincias', 'Por Comisionista', 'Caja Cerrada Recoge Cliente'];
  opcions_tipo_pago = ['Credito', 'Contado',];

  cliente: any = [];
  moneda_get: any = [];
  vendedor_get: any = [];
  agencia_get: any = [];
  tarifa_get: any = [];
  descuento_get: any = [];
  precio_venta_get: any = [];
  documento_identidad: any = [];
  empaquesItem: any = [];
  id_tipo_view_get: any = [];
  id_proforma_numero_id: any = [];
  email_save: any = [];
  almacenes_saldos: any = [];
  item_tabla: any = [];
  almacn_parame_usuario: any = [];

  tarifa_get_unico: any;
  descuentos_get_unico: any;
  direccion_central: any;

  dataform: any = '';
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();

  public cliente_create: any = [];
  veCliente: veCliente[] = [];

  public cod_cliente_enter;
  public disable_input_create: boolean;
  public codigo_cliente: string;
  public nombre_cliente: string;
  public nombre_comercial_cliente: string;
  public razon_social: string;
  public nombre_comercial_razon_social: string;
  public nombre_factura: string;
  public tipo_doc_cliente: string;
  public nit_cliente: string;
  public email_cliente: string;
  public whatsapp_cliente: string;
  public moneda: string;
  public parsed: string;
  public longitud: string;
  public latitud: string;
  public complemento_ci: string
  public cod_vendedor_cliente: string;
  public cod_vendedor_cliente_modal: string;
  public cod_id_tipo_modal: string;
  public cod_descuento_modal: string;
  public cod_precio_venta_modal: string;
  public cod_almacen_cliente: string;
  public codigo_vendedor_catalogo: string;
  public direccion_cen: string;
  public direccion_central_input: string;
  public empaque_item_codigo: string;
  public empaque_item_descripcion: string;
  public cantidad: string;
  public empaque_descripcion_concat: string;
  public isDisabled: boolean = true;
  public selected: string = "Credito";

  public complementopf: any;
  public tipo_complementopf_input: any;
  public idpf_complemento_view: any;
  public disableSelect = new FormControl(false);


  precio: any = true;
  desct: any = false;

  public total_desct_precio: boolean = false;
  public anticipo_button: boolean;
  public cliente_casual: boolean;
  public total_X_PU: boolean = false;
  public submitted = false;
  //TABLA DETALLE
  products!: ItemDetalle[];
  selectedProducts: ItemDetalle[] = [];

  elementoSeleccionadoPrecioVenta: any;
  elementoSeleccionadoDescuento: any;

  // TRANSFERENCIA
  moneda_get_catalogo: string;
  cod_id_tipo_modal_id: string;
  tipopago: string;
  transporte: string;
  medio_transporte: string;
  fletepor: string;
  tipoentrega: string;
  peso: any;
  desct_nivel_actual: string;
  preparacion: string;
  tipo_cambio_moneda_catalogo: string;
  id_tipo_view_get_codigo: string;
  cod_precio_venta_modal_codigo: number;

  habilitar_desct_sgn_solicitud: any = [];
  item_seleccionados_catalogo_matriz: any = [];
  array_items_carrito_y_f4_catalogo: any = [];

  public codigo_cliente_catalogo_real: string;
  public venta_cliente_oficina: string;
  public tipo_cliente: string;

  public direccion: string;
  public latitud_cliente: string;
  public longitud_cliente: string;
  public central_ubicacion: string;
  public URL_maps: string;
  public obs: string;

  public ubicacion_central: string;
  public ids_complementar_proforma: any = [];

  decimalPipe: any;
  private debounceTimer: any;

  // NEGATIVOS
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];

  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;

  public cliente_habilitado_get: any;

  //VALIDACIONES TODOS, NEGATIVOS, MAXIMO VENTA
  public validacion_post: any = [];
  public valor_formulario: any = [];
  public validacion_post_negativos: any = [];

  public valor_formulario_copied_map_all: any = {};
  public valor_formulario_negativos: any = {};

  public negativos_validacion: any = [];
  public tabla_anticipos: any;


  // totales
  public subtotal: number;
  public recargos: number;
  public des_extra: number;
  public iva: number;
  public total: number;

  totabilizar_post: any = [];
  tablaIva: any = [];

  cod_descuento_modal_codigo: number = 0;
  array_de_descuentos_ya_agregados: any = [];
  almacn_parame_usuario_almacen: any;

  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  public codigo_cliente_catalogo: string;
  public codigo_item_catalogo: string;

  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
    'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
    'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];


  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private _formBuilder: FormBuilder,
    private serviciotipoid: TipoidService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private log_module: LogService, private datePipe: DatePipe,
    public servicioTransfeProformaCotizacion: ServicioTransfeAProformaService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.serviciotipoid.disparadorDeIDTipo.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.cod_id_tipo_modal = data.id_tipo.id;
    });

    // transferencia
    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.subscribe(data => {
      console.log("Recibiendo Transferencia: ", data);
      this.imprimir_proforma_tranferida(data.proforma_transferir);
    });
    // fin_transferencia 

    this.itemservice.disparadorDeItems.subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data.item;
      this.getEmpaqueItem(this.codigo_item_catalogo);
    });

    this.servicioCliente.disparadorDeClientes.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.codigo_cliente_catalogo = data.cliente;
      this.getClientByID(this.codigo_cliente_catalogo);
    });
  }

  ngAfterViewInit() {
    this.getIDScomplementarProforma();
    this.getIdTipo();
    this.getAlmacenParamUsuario();
    this.getTarifa();
    this.getDescuentos();
    this.getAllmoneda();
    this.getTipoDocumentoIdentidadProforma();
    this.getVendedor();
  }

  getIdTipo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/catalogoNumProf/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo_view_get = datav.shift();
          // console.log('data', this.id_tipo_view_get.codigo);
          this.getIdTipoNumeracion(this.id_tipo_view_get.codigo);
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

          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          this.cod_descuento_modal_codigo = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIdTipoNumeracion(id_proforma) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getNumActProd/' + this.userConn + "/" + id_proforma)
      .subscribe({
        next: (datav) => {
          this.id_proforma_numero_id = datav.shift();
          // console.log('data', this.id_proforma_numero_id);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTarifa() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/intarifa/catalogo/";

    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav.shift();
          // console.log("Tarifa ", this.tarifa_get_unico);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDescuentos() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/vedescuento/catalogo";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get_unico = datav.shift();
          // console.log(this.descuentos_get_unico);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
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

  getAllmoneda() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get = datav.shift();
          console.log(this.moneda_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTipoDocumentoIdentidadProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
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

  getVendedor() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav.shift();
          console.log(this.vendedor_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getEmpaqueItem(item) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .subscribe({
        next: (datav) => {
          this.empaquesItem = datav;

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

  getAlmacenesSaldos(cod_usuario) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + cod_usuario)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          console.log(this.almacenes_saldos);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }


  mandarEntregar() {
    this.valor_formulario = [this.FormularioData.value];
    console.log("Valor Formulario Original: ", this.valor_formulario, this.estado_contra_entrega_input);

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
        contra_entrega: element.contra_entrega?.toString(),
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega === "undefined" ? "NO" : "SI",
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
        monto_anticipo: 0,
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
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
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
          this.toastr.error("Formulario T. Entrega Error");
        },
        complete: () => { }
      });
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
    this.email_cliente = "";
    this.whatsapp_cliente = "";
    this.cod_vendedor_cliente = "";
    this.moneda = "";
    this.tipo = "";
    this.latitud = "";
    this.longitud = "";
    this.direccion_central_input = "";


    this.subtotal = 0;
    this.recargos = 0;
    this.des_extra = 0;
    this.iva = 0;
    this.total = 0;
  }

  createForm(): FormGroup {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    console.log(this.tipo_complementopf_input);

    let hour = this.hora_actual.getHours();
    // Asegurarse de que el valor de la hora esté en formato de 24 horas
    let hora_inicial = hour < 10 ? '0' + hour : hour; // Agrega un 0 inicial si la hora es menor a 10

    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;
    let fecha_actual = new Date();
    let valor_cero: number = 0;

    // if(this.tipo_complementopf_input === 0) {
    //   this.dataform.tipo_complementopf === tipo_complementopf_val0;
    // }

    // if (this.input_complemento_view === null) {
    //   this.input_complemento_view = valor_cero;
    // }

    return this._formBuilder.group({
      id: "NR311",
      numeroid: 114767,
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      fecha: [fecha_actual],
      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: [this.des_extra],
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
      fechaaut: ["1900-01-01"],
      fecha_confirmada: ["1900-01-01"],
      hora_confirmada: ["00:00"],
      hora_inicial: [hora_inicial],
      usuarioaut: [""],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],

      obs: this.dataform.obs ? this.dataform.obs.trim() : '',
      obs2: [""],
      direccion: [this.dataform.direccion],
      peso: Number(this.peso),
      codcliente_real: this.codigo_cliente,
      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],
      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email],

      venta_cliente_oficina: this.dataform.venta_cliente_oficina === undefined ? false : true,
      tipo_venta: ['0'],

      contra_entrega: this.estado_contra_entrega_input,
      estado_contra_entrega: [this.dataform.estado_contra_entrega === undefined ? "" : this.dataform.estado_contra_entrega],

      odc: "",
      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud === undefined ? 0 : this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud

      idanticipo: [""], //anticipo VentasL
      numeroidanticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [false], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? "" : this.dataform.nroidpf_complemento,
      idsoldesctos: this.idpf_complemento_view, // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [valor_cero], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024

      idpf_complemento: this.dataform.idpf_complemento === undefined ? "" : this.dataform.idpf_complemento, //aca es para complemento de proforma
      monto_anticipo: 0, //anticipo Ventas
      tipo_complementopf: [{ value: this.dataform.tipo_complementopf }], //aca es para complemento de proforma

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

  submitData() {
    let ventana = "proforma-create"
    let detalle = "proforma-CreoNuevoClienteCasual";
    let tipo_transaccion = "transacc-proforma-POST";

    let data = this.FormularioData.value;
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /seg_adm/mant/adarea/";

    console.log(data);

    return this.api.create("/venta/transac/veproforma/crearCliente/" + userConn, data)
      .subscribe({
        next: (datav) => {
          this.cliente_create = datav;
          console.log(this.cliente_create);

          this.log_module.guardarLog(ventana, detalle, tipo_transaccion);
          this.spinner.show();
          this.toastr.success('Guardado con Exito! ✅');

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.warning('El Cliente no se registro correctamente! ❌');
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

  totabilizar() {
    let total_proforma_concat: any = [];

    //valor del check en el mat-tab complementar proforma
    if (this.complementopf === false || this.complementopf === undefined) { //valor del check en el mat-tab complementar proforma this.disableSelectComplemetarProforma.value 
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
      veproforma1_2: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      veproforma_valida: [],
      veproforma_anticipo: [],
      vedesextraprof: this.array_de_descuentos_ya_agregados, //array de descuentos
      verecargoprof: [], //array de recargos
      veproforma_iva: [], //array de iva
    };

    // console.log(total_proforma_concat);
    // console.log(this.veproforma, this.array_items_carrito_y_f4_catalogo, this.veproforma_valida,
    //   this.veproforma_anticipo, this.vedesextraprof, this.verecargoprof, this.veproforma_iva);

    console.log("Array de Carrito a Totaliza:", total_proforma_concat, "URL: " + ("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" + this.habilitar_desct_sgn_solicitud + "/" + this.complementopf + "/" + this.desct_nivel_actual));
    if (this.habilitar_desct_sgn_solicitud != undefined && this.complementopf != undefined) {
      console.log("DATOS VALIDADOS");
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
      return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
        "false" + "/" + this.complementopf + "/" + this.desct_nivel_actual + "/" + this.codigo_cliente_catalogo_real, total_proforma_concat)
        .subscribe({
          next: (datav) => {
            this.totabilizar_post = datav;
            console.log(this.totabilizar_post);
            this.toastr.success('! TOTALIZADO EXITOSAMENTE !');

            console.log(this.array_items_carrito_y_f4_catalogo);

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
            // this.tablaIva = this.totabilizar_post.totales?.tablaIva;
            const item_procesados_en_total = this.totabilizar_post?.detalleProf;

            // Agregar el número de orden a los objetos de datos
            this.totabilizar_post?.detalleProf.forEach((element, index) => {
              element.orden = index + 1;
            });

            this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf;
          }
        })
    } else {
      this.toastr.info("VALIDACION ACTIVA 🚨");
      console.log("HAY QUE VALIDAR DATOS");
    }
  }


  tdc: any;
  public estado_contra_entrega_input: any;
  cod_proforma: any;
  id_nro_id_proforma: any;
  odc: any;
  nroidpf_complemento: any;
  nivel_descuento: any;
  pago_contado_anticipado: any;

  imprimir_proforma_tranferida(proforma) {
    console.log(proforma);

    // this.cod_id_tipo_modal = proforma.cabecera.id;
    // this.id_proforma_numero_id = proforma.cabecera.numeroid;
    // this.fecha_actual = proforma.cabecera.fecha;


    this.fecha_actual = this.fecha_actual;
    this.almacn_parame_usuario = proforma.cabecera.codalmacen;
    this.cod_vendedor_cliente_modal = proforma.cabecera.codvendedor;
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
    this.tdc = proforma.cabecera.tdc;
    this.codigo_cliente = proforma.cabecera.codcliente_real;
    this.tipopago = proforma.cabecera.tipopago;
    this.estado_contra_entrega_input = proforma.cabecera.contra_entrega;
    this.cod_proforma = proforma.cabecera.codigo;
    this.id_nro_id_proforma = proforma.cabecera.id + proforma.cabecera.numeroid;

    this.transporte = proforma.cabecera.transporte;
    this.medio_transporte = proforma.cabecera.nombre_transporte;
    this.fletepor = proforma.cabecera.fletepor;
    this.tipoentrega = proforma.cabecera.tipoentrega;
    this.peso = proforma.cabecera.peso;
    this.direccion_central_input = proforma.cabecera.direccion;
    this.odc = proforma.cabecera.odc;

    this.codigo_cliente_catalogo_real = proforma.cabecera.codcliente_real;

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

    //Descuentos De Linea de CLiente
    this.nivel_descuento = proforma.cabecera.niveles_descuento;

    //complementarProforma
    this.idpf_complemento_view = proforma.cabecera.idpf_complemento;
    this.nroidpf_complemento = proforma.cabecera.nroidpf_complemento;

    this.pago_contado_anticipado = proforma.cabecera.pago_contado_anticipado;

    //eso nop porque se totaliza una vez transferida
    // this.subtotal = proforma.cabecera.subtotal;
    // this.recargos = proforma.cabecera.recargos;
    // this.des_extra = proforma.cabecera.descuentos;
    // this.iva = proforma.cabecera.iva;
    // this.total = proforma.cabecera.total;

    this.item_seleccionados_catalogo_matriz = proforma.detalle;
    this.array_de_descuentos_ya_agregados = proforma.descuentos;
    //this.cod_descuento_total = proforma.descuentos;


    //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = proforma.detalle;

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      if (element.empaque === null) {
        element.empaque = 0;
      }
    });

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;

    // this.totabilizar()
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


  itemDataAll(codigo) {
    // this.getSaldoEmpaquePesoAlmacenLocal(codigo);
    // this.getEmpaqueItem(codigo);
    // this.getSaldoItemSeleccionadoDetalle(codigo);
    // this.getAlmacenesSaldos();
    // this.getSaldoItem(codigo);
    // this.getPorcentajeVentaItem(codigo);

    // this.saldo_modal_total_1 = "";
    // this.saldo_modal_total_2 = "";
    // this.saldo_modal_total_3 = "";
    // this.saldo_modal_total_4 = "";
    // this.saldo_modal_total_5 = "";
  }


  // eventos de seleccion en la tabla
  onRowSelect(event: any) {
    console.log('Row Selected:', event.data);
    this.updateSelectedProducts();
  }

  onRowSelectForDelete() {
    console.log('Items para cambiar cantidad a 0: ', this.selectedProducts);

    // Filtrar el array para eliminar los elementos que están en el array de elementos seleccionados
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element: any) => ({
      ...element,
      cantidad: 0
    }))

    //si se cambia la cantidad a 0 TOTABILIZAR


  }

  onRowUnselect(event: any) {
    console.log('Row Unselected:', event.data);
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    console.log('Selected Products:', this.selectedProducts);
  }
  // fin eventos de seleccion en la tabla

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

  validarProformaSoloNegativos() {
    // 00060 - VALIDAR SALDOS NEGATIVOS
    // VACIO - TODOS LOS CONTROLES
    this.valor_formulario = [this.FormularioData.value];
    console.log("Valor Formulario Original: ", this.valor_formulario);

    let tipo_complemento
    console.log(this.complementopf);
    switch (this.complementopf) {
      case 3:
        tipo_complemento = "";
        break;
      case 0:
        tipo_complemento = "complemento_mayorista_dimediado";
        break;
      case 1:
        tipo_complemento = "complemento_para_descto_monto_min_desextra";
        break;
    }

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
        contra_entrega: element.contra_entrega?.toString() === true ? "SI" : "NO",
        vta_cliente_en_oficina: element.venta_cliente_oficina,
        estado_contra_entrega: element.estado_contra_entrega === undefined ? "SI" : "NO",
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
        tipo_complemento: tipo_complemento,
        fechadoc: element.fecha,
        idanticipo: element.idanticipo,
        noridanticipo: element.numeroidanticipo?.toString() || '',
        monto_anticipo: 0,
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
        cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
        totdesctos_extras: this.des_extra,
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



  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

























































  tranferirNotasRemision() {
    this.dialog.open(ModalTransfeNotaRemisionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalTipoID(): void {
    this.dialog.open(ModalIdtipoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalMatrizProductos(): void {
    this.dialog.open(MatrizItemsComponent, {
      width: 'auto',
      height: '900px',
    });
  }

  modalClientesInfo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ModalClienteInfoComponent, {
      width: 'auto',
      height: '600px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  modalSaldos(cod_almacen): void {
    let cod_item_mayuscula = this.codigo_item_catalogo.toUpperCase();
    // console.log(cod_item_mayuscula);
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      data: { cod_almacen: cod_almacen, cod_item: cod_item_mayuscula },
    });
  }

  modalSubTotal() {
    this.dialog.open(ModalSubTotalComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        descuento_nivel: this.desct_nivel_actual,
        cod_cliente: this.codigo_cliente,
        cod_almacen: this.agencia_logueado,
        cod_moneda: this.moneda_get_catalogo,
        desc_linea: this.habilitar_desct_sgn_solicitud,
        items: this.array_items_carrito_y_f4_catalogo,
        fecha: this.fecha_actual
      },
    });
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
}