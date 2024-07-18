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
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { MatrizItemsComponent } from '../../matriz-items/matriz-items.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { ModalSaldosComponent } from '../../matriz-items/modal-saldos/modal-saldos.component';
import { DatePipe } from '@angular/common';
import { ModalSubTotalComponent } from '../../modal-sub-total/modal-sub-total.component';
import { ModalIvaComponent } from '../../modal-iva/modal-iva.component';
import { MatTabGroup } from '@angular/material/tabs';
import { CatalogoNotasRemisionComponent } from './catalogo-notas-remision/catalogo-notas-remision.component';
import { ModalTransfeNotaRemisionComponent } from './modal-transfe-nota-remision/modal-transfe-nota-remision.component';
import { SaldoItemMatrizService } from '../../matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ServicioTransfeAProformaService } from '../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
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

  public saldoItem: number;
  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  public ubicacion_central: string;
  public ids_complementar_proforma: any = [];

  decimalPipe: any;
  private debounceTimer: any;

  // formulario
  tdc: any;
  cod_proforma: any;
  id_nro_id_proforma: any;
  odc: any;
  nroidpf_complemento: number;
  nivel_descuento: any;
  pago_contado_anticipado: any;
  estado: any;

  public input_complemento_view: any;
  public estado_contra_entrega_input: any;

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

  public item_obtenido: any = [];
  porcen_item: string;

  // totales
  public subtotal: number;
  public recargos: number;
  public des_extra: number;
  public iva: number;
  public total: number;

  totabilizar_post: any = [];
  tablaIva: any = [];

  cod_descuento_modal_codigo: number;
  cod_precio_venta_modal_codigo: number;

  item_seleccionados_catalogo_matriz_codigo: any;

  array_de_descuentos_ya_agregados: any = [];
  almacn_parame_usuario_almacen: any;

  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  public codigo_cliente_catalogo: string;
  public codigo_item_catalogo: string;
  id_tipo: any = [];

  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
    'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
    'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private _formBuilder: FormBuilder,
    private serviciotipoid: TipoidService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private log_module: LogService, private datePipe: DatePipe, private saldoItemServices: SaldoItemMatrizService,
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
      const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
        width: 'auto',
        height: 'auto',
        data: { mensaje_dialog: "¿ Esta Seguro de Transferir a la Nota de Remision actual?, Se reemplazara el contenido de la proforma actual !" },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          this.toastr.success('! TRANSFERENCIA EN PROGESO ! ✅');
          //SE PINTA LA DATA TRANSFERIDA A LA NOTA DE REMISION
          this.imprimir_proforma_tranferida(data.proforma_transferir);
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        } else {
          this.toastr.error('! CANCELADO ! ❌');
        }
      });
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
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/catalogoNumProf/";
    return this.api.getAll('/venta/transac/veremision/getParametrosIniciales/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log('data', datav);
          this.cod_id_tipo_modal = datav.id;
          this.id_proforma_numero_id = datav.numeroid;
          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.moneda_get_catalogo = datav.codmoneda;
          this.tdc = datav.codtarifadefect;
          this.cod_descuento_modal_codigo = datav.coddescuentodefect;
          this.cod_precio_venta_modal_codigo = datav.codtarifadefect;
          this.cod_vendedor_cliente_modal = datav.codvendedor;
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
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/intarifa/catalogo/";

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

  getAlmacenesSaldos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuarioLogueado)
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
    this.fecha_actual = this.fecha_actual;
    this.almacn_parame_usuario = "";
    this.cod_vendedor_cliente_modal = "";
    this.venta_cliente_oficina = "";
    this.codigo_cliente = "";
    this.nombre_cliente = "";
    this.nombre_comercial_cliente = "";
    this.nombre_factura = "";
    this.complemento_ci = "";
    this.tipo_doc_cliente = "";
    this.nit_cliente = "";
    this.email_cliente = "";
    this.cliente_casual = false;
    this.preparacion = "";
    this.estado = "";

    this.moneda_get_catalogo = "";
    this.tdc = "";
    this.codigo_cliente = "";
    this.tipopago = "";
    this.estado_contra_entrega_input = "";
    this.cod_proforma = "";
    this.id_nro_id_proforma = "";

    this.transporte = "";
    this.medio_transporte = "";
    this.fletepor = "";
    this.tipoentrega = "";
    this.peso = "";
    this.direccion_central_input = "";
    this.odc = "";

    this.codigo_cliente_catalogo_real = "";

    this.cod_vendedor_cliente = "";
    this.venta_cliente_oficina = "";
    this.tipo_cliente = "";
    this.direccion = "";
    this.whatsapp_cliente = "";
    this.latitud_cliente = "";
    this.longitud_cliente = "";
    this.central_ubicacion = "";
    this.obs = "";
    this.desct_nivel_actual = "";
    this.whatsapp_cliente = "0";

    this.ubicacion_central = "";
    this.preparacion = "";

    //Descuentos De Linea de CLiente
    this.nivel_descuento = "";

    //complementarProforma
    this.idpf_complemento_view = "";
    this.nroidpf_complemento = 0;

    this.pago_contado_anticipado = "";

    //eso nop porque se totaliza una vez transferida
    // this.subtotal = proforma.cabecera.subtotal;
    // this.recargos = proforma.cabecera.recargos;
    // this.des_extra = proforma.cabecera.descuentos;
    // this.iva = proforma.cabecera.iva;
    // this.total = proforma.cabecera.total;

    this.item_seleccionados_catalogo_matriz = [];
    this.array_de_descuentos_ya_agregados = [];
    //this.cod_descuento_total = proforma.descuentos;

    this.subtotal = 0;
    this.recargos = 0;
    this.des_extra = 0;
    this.iva = 0;
    this.total = 0;
  }

  desclinea_segun_solicitud: any;
  total_cabecera: any;
  moneda_cabecera: any;
  txtid_solurgente: any;
  txtnroid_solurgente: any;


  fecha_confirmada: any;
  fechaaut: any;
  fecha_reg: any;
  fecha: any;
  fecha_inicial: any;

  horareg: any;
  hora: any;
  usuarioreg: any;
  horaaut: any;
  hora_confirmada: any;
  hora_inicial: any;

  imprimir_proforma_tranferida(proforma) {
    console.log(proforma.data);

    this.total_cabecera = proforma.data.cabecera.total;
    this.moneda_cabecera = proforma.data.cabecera.codmoneda;

    // this.cod_id_tipo_modal = proforma.data.cabecera.id;
    // this.id_proforma_numero_id = proforma.data.cabecera.numeroid;
    this.fecha_actual = proforma.data.cabecera.fecha;
    this.fecha_actual = this.fecha_actual;

    this.almacn_parame_usuario = proforma.data.cabecera.codalmacen;
    this.cod_vendedor_cliente_modal = proforma.data.cabecera.codvendedor;
    this.venta_cliente_oficina = proforma.data.cabecera.venta_cliente_oficina;
    this.codigo_cliente = proforma.data.cabecera.codcliente;
    this.nombre_cliente = proforma.data.cabecera.nomcliente;
    this.nombre_comercial_cliente = proforma.data.cabecera.nombre_comercial;
    this.nombre_factura = proforma.data.cabecera.nombre_fact;
    this.complemento_ci = proforma.data.cabecera.complemento_ci;
    this.tipo_doc_cliente = proforma.data.cabecera.tipo_docid;
    this.nit_cliente = proforma.data.cabecera.nit;
    this.email_cliente = proforma.data.cabecera.email;
    this.cliente_casual = proforma.data.cabecera.casual;
    this.preparacion = proforma.data.cabecera.preparacion;
    this.estado = proforma.data.cabecera.estado_contra_entrega;

    this.moneda_get_catalogo = proforma.data.cabecera.codmoneda;
    this.tdc = proforma.data.cabecera.tdc;
    this.codigo_cliente = proforma.data.cabecera.codcliente_real;
    this.tipopago = proforma.data.cabecera.tipopago;
    this.estado_contra_entrega_input = proforma.data.cabecera.contra_entrega;
    this.cod_proforma = proforma.data.cabecera.codigo;
    this.id_nro_id_proforma = proforma.data.cabecera.id + "-" + proforma.data.cabecera.numeroid;

    this.transporte = proforma.data.cabecera.transporte;
    this.medio_transporte = proforma.data.cabecera.nombre_transporte;
    this.fletepor = proforma.data.cabecera.fletepor;
    this.tipoentrega = proforma.data.cabecera.tipoentrega;
    this.peso = proforma.data.cabecera.peso;
    this.direccion_central_input = proforma.data.cabecera.direccion;
    this.odc = proforma.data.cabecera.odc;

    this.codigo_cliente_catalogo_real = proforma.data.cabecera.codcliente_real;

    this.desclinea_segun_solicitud = proforma.data.cabecera.desclinea_segun_solicitud;

    this.cod_vendedor_cliente = proforma.data.cabecera.codvendedor;
    this.venta_cliente_oficina = proforma.data.cabecera.venta_cliente_oficina;
    this.tipo_cliente = proforma.data.cabecera.tipo === undefined ? " " : " ";
    this.direccion = proforma.data.cabecera.direccion;
    this.whatsapp_cliente = proforma.data.cabecera.celular;
    this.latitud_cliente = proforma.data.cabecera.latitud_entrega;
    this.longitud_cliente = proforma.data.cabecera.longitud_entrega;
    this.central_ubicacion = proforma.data.cabecera.ubicacion;
    this.obs = proforma.data.cabecera.obs;
    this.desct_nivel_actual = proforma.data.cabecera.niveles_descuento;
    this.whatsapp_cliente = "0";

    this.ubicacion_central = proforma.data.cabecera.ubicacion;
    this.preparacion = proforma.data.cabecera.preparacion;

    //Descuentos De Linea de CLiente
    this.nivel_descuento = proforma.data.cabecera.niveles_descuento;

    //complementarProforma
    this.idpf_complemento_view = proforma.data.cabecera.idpf_complemento;
    this.nroidpf_complemento = proforma.data.cabecera.nroidpf_complemento;
    this.pago_contado_anticipado = proforma.data.cabecera.pago_contado_anticipado;

    //eso nop porque se totaliza una vez transferida
    // this.subtotal = proforma.data.cabecera.subtotal;
    // this.recargos = proforma.data.cabecera.recargos;
    // this.des_extra = proforma.data.cabecera.descuentos;
    // this.total = proforma.data.cabecera.total;

    this.iva = proforma.data.cabecera.iva;
    this.tablaIva = proforma.data.iva

    this.item_seleccionados_catalogo_matriz = proforma.data.detalle;
    this.array_de_descuentos_ya_agregados = proforma.data.descuentos;
    //this.cod_descuento_total = proforma.descuentos;

    //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = proforma.data.detalle;

    //fechas
    this.fecha = this.datePipe.transform(proforma.data.cabecera.fecha, "yyyy-MM-dd");
    this.fecha_inicial = this.datePipe.transform(proforma.data.cabecera.fecha_inicial, "yyyy-MM-dd");
    this.fecha_confirmada = this.datePipe.transform(proforma.data.cabecera.fecha_confirmada, "yyyy-MM-dd");
    this.fechaaut = this.datePipe.transform(proforma.data.cabecera.fechaaut, "yyyy-MM-dd");
    this.fecha_reg = this.datePipe.transform(proforma.data.cabecera.fechareg, "yyyy-MM-dd");

    this.hora_inicial = proforma.data.cabecera.hora_inicial;
    this.horareg = proforma.data.cabecera.horareg;
    this.hora = proforma.data.cabecera.hora;
    this.usuarioreg = proforma.data.cabecera.usuarioreg;
    this.horaaut = proforma.data.cabecera.horaaut;
    this.hora_confirmada = proforma.data.cabecera.hora_confirmada;
    //fin-fecha

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      if (element.empaque === null) {
        element.empaque = 0;
      }
    });

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;

    //id_solurgente, txtnroid_solurgente
    this.txtid_solurgente = proforma.txtid_solurgente;
    this.txtnroid_solurgente = proforma.txtnroid_solurgente;

    console.log("Data que va a la URL: ", this.txtid_solurgente, this.txtnroid_solurgente);

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.totabilizarYGrabar();
    }, 1500); // 300 ms de retardo
  }

  createForm(): FormGroup {
    let valor_cero: number = 0;

    // if(this.tipo_complementopf_input === 0) {
    //   this.dataform.tipo_complementopf === tipo_complementopf_val0;
    // }

    // if(this.tipo_complementopf_input === 0) {
    //   this.dataform.tipo_complementopf === tipo_complementopf_val0;
    // }

    if (this.input_complemento_view === null) {
      this.input_complemento_view = valor_cero;
    }

    return this._formBuilder.group({
      total_cabecera: [this.dataform.total_cabecera],
      moneda_cabecera: [this.dataform.moneda_cabecera],

      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      //precio venta columna segunda primera fila verificar conq nombre se guarda

      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: [this.des_extra],
      tipopago: [this.dataform.tipopago === 0 ? 0 : 1, Validators.required],
      transporte: [this.dataform.transporte === "FLOTA", Validators.required],
      nombre_transporte: [this.dataform.nombre_transporte, Validators.compose([Validators.required])],
      tipo_docid: [{ value: this.dataform.tipo_docid, disabled: true }, Validators.compose([Validators.required])],
      preparacion: [this.dataform.preparacion, Validators.compose([Validators.required])],
      tipoentrega: [this.dataform.tipoentrega === undefined ? "ENTREGAR" : this.dataform.tipoentrega, Validators.compose([Validators.required])],
      fletepor: [this.dataform.fletepor === "CLIENTE", Validators.compose([Validators.required])],
      estado_proforma: [{ value: this.dataform.estado_proforma, disabled: true }],
      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],
      usuarioaut: [""],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],
      cod_proforma_form: [this.dataform.cod_proforma_form],
      id_nro_id_proforma_form: [this.dataform.id_nro_id_proforma_form],

      obs: this.dataform.obs ? this.dataform.obs.trim() : '',
      obs2: [""],
      direccion: [this.dataform.direccion],
      peso: Number(this.peso),
      codcliente_real: this.codigo_cliente,
      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],
      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email],

      venta_cliente_oficina: [{ value: this.dataform.venta_cliente_oficina === undefined ? false : true, disabled: true }],
      contra_entrega: [{ value: this.estado_contra_entrega_input, disabled: true }],
      tipo_venta: ['0'],
      estado_contra_entrega: [this.dataform.estado_contra_entrega === undefined ? "" : this.dataform.estado_contra_entrega],
      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud

      odc: "",

      idanticipo: [""], //anticipo VentasL
      numeroidanticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [false], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? 0 : this.dataform.nroidpf_complemento,
      idsoldesctos: this.idpf_complemento_view, // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [valor_cero], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024

      idpf_complemento: this.dataform.idpf_complemento === undefined ? "" : this.dataform.idpf_complemento, //aca es para complemento de proforma
      monto_anticipo: 0, //anticipo Ventas
      tipo_complementopf: this.dataform.tipo_complementopf, //aca es para complemento de proforma

      // fechaaut_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // subtotal_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // moneda_total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario

      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento

      // no hay mas en esta seccion xD
      subtotal: [this.dataform.subtotal === null ? 0.00 : this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos === null ? 0.00 : this.dataform.recargos], //TOTALES
      //des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.dataform.iva === null ? 0.00 : this.dataform.iva], //TOTALES
      total: [this.dataform.total === null ? 0.00 : this.dataform.total], //TOTALES
      porceniva: [0],

      fecha: this.dataform.fecha,
      fechareg: this.dataform.fechareg,
      fecha_confirmada: this.dataform.fecha_confirmada,
      fechaaut: this.dataform.fechaaut,
      fecha_inicial: this.dataform.fecha_inicial,

      horareg: this.dataform.horareg,
      hora: this.dataform.hora,
      usuarioreg: this.usuarioLogueado,
      horaaut: this.dataform.horaaut,
      hora_inicial: this.dataform.hora_inicial,
      hora_confirmada: this.dataform.hora_confirmada,
    });
  }

  submitDataNotaRemision() {
    let submit_nota_remision = {
      veremision: this.FormularioData.value,
      veremision1: this.array_items_carrito_y_f4_catalogo,
      vedesextraremi: this.array_de_descuentos_ya_agregados,
      verecargoremi: [],
      veremision_iva: this.tablaIva,
      veremision_chequerechazado: {
        codremision: 0,
        id: "",
        numeroid: 0,
        codigo: 0
      },
    };

    if (this.txtid_solurgente === "") {
      this.txtid_solurgente = "0";
    }

    console.log(submit_nota_remision);

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veremision/grabarNotaRemision/"
    return this.api.create('/venta/transac/veremision/grabarNotaRemision/' + this.userConn + "/" + this.cod_id_tipo_modal + "/" + this.usuarioLogueado
      + "/" + this.desclinea_segun_solicitud + "/" + this.cod_proforma + "/" + this.BD_storage + "/" + this.txtid_solurgente + "/" + this.txtnroid_solurgente, submit_nota_remision)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.log_module.guardarLog(this.ventana, "Modificacion" + datav.codproforma, "POST", this.cod_id_tipo_modal_id, this.id_proforma_numero_id);

          this.toastr.success(datav.resp);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => {
          window.location.reload();
        }
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

  totabilizarYGrabar() {
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
    // this.veproforma_anticipo, this.vedesextraprof, this.verecargoprof, this.veproforma_iva);

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

            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
              if (this.total != 0) {
                const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
                  width: 'auto',
                  height: 'auto',
                  data: { mensaje_dialog: "¿ DESEA GRABAR LA NOTA DE REMISION SIN REALIZAR NINGUNA MODIFICACION ?" },
                  disableClose: true,
                });

                dialogRef.afterClosed().subscribe((result: Boolean) => {
                  if (result) {
                    console.log("GRABANDO....");
                    this.submitDataNotaRemision();
                  } else {
                    console.log("LE DIO AL CANCELAR, NO GRABAR");
                    // despues de que se transfiera se totaliza, si le da a cancelar igual se totaliza
                  }
                });
              }
            }, 1500);
          }
        })
    } else {
      this.toastr.info("VALIDACION ACTIVA 🚨");
      console.log("HAY QUE VALIDAR DATOS");
    }
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
    this.getEmpaqueItem(codigo);
    this.getSaldoItemSeleccionadoDetalle(codigo);
    this.getAlmacenesSaldos();
    // this.getSaldoItem(codigo);
    this.getPorcentajeVentaItem(codigo);

    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";
  }

  getSaldoItemSeleccionadoDetalle(item) {
    console.log(item, this.agencia_logueado);

    if (this.agencia_logueado === "Loc") {
      this.agencia_logueado = "311";
    }

    let agencia = this.agencia_logueado;
    this.item_seleccionados_catalogo_matriz_codigo = item;

    let agencia_concat = "AG" + this.agencia_logueado;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', this.id_tipo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
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
        desclinea_segun_solicitud: element.desclinea_segun_solicitud === null ? false : true,
        pago_con_anticipo: element.pago_contado_anticipado,
        niveles_descuento: element.niveles_descuento,
        transporte: element.transporte,
        nombre_transporte: element.nombre_transporte,
        fletepor: element.fletepor === undefined ? "" : element.fletepor,
        tipoentrega: element.tipoentrega,
        direccion: element.direccion,
        ubicacion: element.ubicacion === null ? "" : element.ubicacion,
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
          console.log(this.validacion_post_negativos);

          this.toggleTodosNegativos = true;
          this.toggleNegativos = false;
          this.togglePositivos = false;

          this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);

          this.abrirTabPorLabel("Negativos");
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

  cantidadChangeMatrix(elemento: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    this.total_desct_precio = false;
    this.total_X_PU = true;

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad_pedida +
      "/" + elemento.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
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
        complete: () => { }
      });
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

















































  tranferirNotasRemision() {
    this.dialog.open(ModalTransfeNotaRemisionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalTipoID(): void {
    this.dialog.open(CatalogoNotasRemisionComponent, {
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