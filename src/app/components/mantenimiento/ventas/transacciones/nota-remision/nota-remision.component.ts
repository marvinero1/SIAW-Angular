import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { veCliente } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicioclienteService } from '../../serviciocliente/serviciocliente.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { TipoidService } from '../../serviciotipoid/tipoid.service';
import { TarifaService } from '../../serviciotarifa/tarifa.service';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { ModalIdtipoComponent } from '../../modal-idtipo/modal-idtipo.component';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { MatrizItemsComponent } from '../../matriz-items/matriz-items.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { ModalSaldosComponent } from '../../matriz-items/modal-saldos/modal-saldos.component';
import { ModalTransfeNotaRemisionComponent } from '../../modal-transfe-nota-remision/modal-transfe-nota-remision.component';
@Component({
  selector: 'app-nota-remision',
  templateUrl: './nota-remision.component.html',
  styleUrls: ['./nota-remision.component.scss']
})
export class NotaRemisionComponent implements OnInit, AfterViewInit {

  @HostListener("document:keydown.F4", []) unloadHandler(event: Event) {
    this.modalMatrizProductos();
  }

  @HostListener("document:keydown.enter", []) unloadHandler3(event: Event) {
    this.enterCliente();
  }

  @ViewChild("cod_cliente") myInputField: ElementRef;


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
  public tipo: string;
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

  // totales
  public subtotal: number;
  public recargos: number;
  public des_extra: number;
  public iva: number;
  public total: number;

  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  public codigo_cliente_catalogo: string;
  public codigo_item_catalogo: string;

  nombre_ventana: string = "docveremision.vb";

  displayedColumns = ['orden', 'item', 'descripcion', 'medida', 'unidad', 'iva', 'pedido',
    'cantidad', 'sld', 'tp', 'de', 'pul', 'niv', 'porcentaje', 'pd', 'pu', 'total'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private servicioPrecioVenta: TarifaService,
    private _formBuilder: FormBuilder, private servicioDesctEspecial: DescuentoService,
    private serviciotipoid: TipoidService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private log_module: LogService) {

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
      this.cod_id_tipo_modal = data.id_tipo;
    });

    // precio_venta
    this.servicioPrecioVenta.disparadorDeTarifa.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_precio_venta_modal = data.tarifa;
    });
    // fin_precio_venta

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.subscribe(data => {
      console.log("Recibiendo Descuento: ", data);
      this.cod_descuento_modal = data.descuento;
    });
    // findescuentos  

    this.itemservice.disparadorDeItems.subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data.item;
      this.getEmpaqueItem(this.codigo_item_catalogo);
      this.getDetalleItem(this.codigo_item_catalogo, this.tarifa_get_unico?.codigo, this.descuentos_get_unico?.codigo);
    });

    this.servicioCliente.disparadorDeClientes.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.codigo_cliente_catalogo = data.cliente;
      this.getClientByID(this.codigo_cliente_catalogo);
    });
  }

  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
    this.getIDScomplementarProforma();
    //this.getIdTipo();
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
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getAlmacenUser/";
    return this.api.getAll('/venta/transac/veproforma/getAlmacenUser/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          // console.log('data', this.almacn_parame_usuario);
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

  public codigo_cliente_catalogo_real: string;
  public cliente_casual: string;
  public venta_cliente_oficina: string;
  public tipo_cliente: string;

  public direccion: string;
  public latitud_cliente: string;
  public longitud_cliente: string;
  public central_ubicacion: string;
  public URL_maps: string;
  public obs: string;

  public ubicacion_central: string;


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






  itemTabla: any = [];
  arr: any[] = [];

  getDetalleItem(item, tarifa, descuento) {
    console.log(tarifa, descuento);

    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getItemMatriz/";
    return this.api.getAll('/venta/transac/veproforma/getItemMatriz/' + this.userConn + "/" + item + "/" + tarifa + "/" + descuento + "/" + "10")
      .subscribe({
        next: (datav) => {
          this.itemTabla = datav;
          console.log(this.itemTabla);

          // aca agrega los items a un arrays de items
          this.arr.push(datav);
          console.log(this.arr);


          this.dataSource = new MatTableDataSource(this.arr);
          // this.dataSource.paginator = this.paginator;
          // this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          // this.empaque_descripcion_concat = "("+this.empaque_item_codigo+")"+ this.empaque_item_descripcion+"-"+this.cantidad+" | ";
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

  enterCliente() {
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.cod_cliente_enter = this.myInputField.nativeElement.value;
    // console.log(this.cod_cliente_enter);

    // value[1] Seleccionas la segunda posición del array "OPERATING"
    //EL VALOR YA ESTA PARSEADO PARA Q SIEMPRE SEA MAYUSCULA
    const word = this.cod_cliente_enter[0].toUpperCase();
    // Retornas la primera letra de la palabra
    let inicio_sn = word.substring(0, 1);

    this.getClientByID(this.cod_cliente_enter);
    console.log(inicio_sn);

    if (inicio_sn === "S") {
      this.email_cliente = 'true'
      this.disable_input_create = false;
    } else {
      this.disable_input_create = true;
    }
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      codSN: [this.dataform.codSN, Validators.compose([Validators.required])],
      nomcliente_casual: [this.dataform.nomcliente_casual, Validators.compose([Validators.required])],
      nit_cliente_casual: [this.dataform.nit_cliente_casual, Validators.compose([Validators.required])],
      tipo_doc_cliente_casual: [this.dataform.tipo_doc_cliente_casual?.toString(), Validators.compose([Validators.required])],
      email_cliente_casual: [this.dataform.email_cliente_casual, Validators.compose([Validators.required])],
      celular_cliente_casual: [this.dataform.celular_cliente_casual?.toString(), Validators.compose([Validators.required])],
      complemento_ci: [this.dataform.complemento_ci],

      codalmacen: [this.almacn_parame_usuario],
      codvendedor: [0],
      usuarioreg: this.usuarioLogueado,
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




  public ids_complementar_proforma: any = [];
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

  moneda_get_catalogo: string;
  cod_id_tipo_modal_id: string;
  tipopago: string;
  transporte: string;
  medio_transporte: string;
  fletepor: string;
  tipoentrega: string;
  peso: string;
  desct_nivel_actual: string;
  preparacion: string;
  tipo_cambio_moneda_catalogo: string;
  id_tipo_view_get_codigo: string;

  habilitar_desct_sgn_solicitud: any = [];
  item_seleccionados_catalogo_matriz: any = [];
  array_items_carrito_y_f4_catalogo: any = [];

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


    // this.item_seleccionados_catalogo_matriz = proforma.detalle;
    // this.veproforma1 = proforma.detalle;
    // this.array_de_descuentos_ya_agregados = proforma.descuentos;
    // //this.cod_descuento_total = proforma.descuentos;
    // //la cabecera asignada a this.veproforma para totalizar y grabar
    // this.veproforma = proforma.cabecera
    // //el cuerpo del detalle asignado al carrito
    // this.array_items_carrito_y_f4_catalogo = proforma.detalle;

    this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;

    //this.dataSource = new MatTableDataSource(proforma.detalle);
    // se dibuja los items al detalle de la proforma
    //this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
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

  public total_X_PU: boolean = false;
  public total_desct_precio: boolean = false;
  selectedRowIndex: number = -1; // Inicialmente ninguna celda está seleccionada
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


}