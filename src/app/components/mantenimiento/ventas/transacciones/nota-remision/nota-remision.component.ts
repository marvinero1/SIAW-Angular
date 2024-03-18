import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { TipoidService } from '../../serviciotipoid/tipoid.service';
import { ServicioalmacenService } from '../../../inventario/almacen/servicioalmacen/servicioalmacen.service';
import { VendedorService } from '../../serviciovendedor/vendedor.service';
import { TarifaService } from '../../serviciotarifa/tarifa.service';
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
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';

@Component({
  selector: 'app-nota-remision',
  templateUrl: './nota-remision.component.html',
  styleUrls: ['./nota-remision.component.scss']
})
export class NotaRemisionComponent implements OnInit {

  nombre_ventana: string = "docveremision.vb";

  @HostListener("document:keydown.F4", []) unloadHandler(event: Event) {
    this.modalMatrizProductos();
  }

  @HostListener("document:keydown.F6", []) unloadHandler1(event: Event) {
    this.modalCatalogoProductos();
  }

  @HostListener("document:keydown.F7", []) unloadHandler2(event: Event) {
    this.modalClientes();
  }

  @HostListener("document:keydown.enter", []) unloadHandler3(event: Event) {
    this.enterCliente();
  }

  @ViewChild("cod_cliente") myInputField: ElementRef;
  // select tipoDePreparacion

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
  // public email_cliente_input:string;
  dataform: any = '';

  userConn: any;
  user: any;

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  public cliente_create: any = [];


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

  // totales
  public subtotal: number;
  public recargos: number;
  public des_extra: number;
  public iva: number;
  public total: number;


  selectTPago: string = "Credito";
  selectedCountryControl = new FormControl(this.selectTPago);

  veCliente: veCliente[] = [];

  public codigo_cliente_catalogo: string;
  private codigo_item_catalogo: string;





  displayedColumns = ['orden', 'item', 'descripcion', 'medida', 'unidad', 'iva', 'pedido',
    'cantidad', 'sld', 'tp', 'de', 'pul', 'niv', 'porcentaje', 'pd', 'pu', 'total'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();


  constructor(public dialog: MatDialog, private api: ApiService, public itemservice: ItemServiceService,
    public servicioCliente: ServicioclienteService, public almacenservice: ServicioalmacenService,
    public serviciovendedor: VendedorService, public servicioPrecioVenta: TarifaService,
    private _formBuilder: FormBuilder, public servicioDesctEspecial: DescuentoService, private serviciotipoid: TipoidService,
    private toastr: ToastrService, private spinner: NgxSpinnerService, public log_module: LogService, public _snackBar: MatSnackBar) {

    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.user = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    let agenciaLogueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;

    this.serviciotipoid.disparadorDeIDTipo.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.cod_id_tipo_modal = data.id_tipo;
    });

    //almacen si no se selecciona almacen viene por defecto la agencia logueada
    if (this.cod_almacen_cliente == undefined) {
      this.cod_almacen_cliente = agenciaLogueado;
    }

    if (this.cod_almacen_cliente != undefined) {
      this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
        console.log("Recibiendo Almacen: ", data);
        this.cod_almacen_cliente = data.almacen;
      });
    }


    // finalmacen

    //Vendedor
    this.serviciovendedor.disparadorDeVendedores.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_vendedor_cliente_modal = data.vendedor;
    });
    //finvendedor

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

    this.serviciovendedor.disparadorDeVendedores.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_vendedor_cliente_modal = data.vendedor;
    });

    this.itemservice.disparadorDeItems.subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data.item;
      this.getEmpaqueItem(this.userConn, this.codigo_item_catalogo);
      this.getDetalleItem(this.userConn, this.codigo_item_catalogo, this.tarifa_get_unico?.codigo, this.descuentos_get_unico?.codigo);

    });

    this.servicioCliente.disparadorDeClientes.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.codigo_cliente_catalogo = data.cliente;
      this.getClientByID(this.userConn, this.codigo_cliente_catalogo);
      this.getDireccionCentral(this.userConn, this.codigo_cliente_catalogo);
    });
  }

  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();

    this.getIdTipo(this.userConn, this.user);
    this.getAlmacenParamUsuario(this.userConn, this.user);
    this.getTarifa(this.userConn, this.user);
    this.getDescuentos(this.userConn);
    this.getAllmoneda(this.userConn);
    this.getTipoDocumentoIdentidadProforma(this.userConn);
    this.getVendedor(this.userConn);
    this.getDescuento(this.userConn);
    this.getAlmacenesSaldos(this.userConn, this.user);
  }

  getIdTipo(userConn, user) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/catalogoNumProf/' + userConn + "/" + user)
      .subscribe({
        next: (datav) => {
          this.id_tipo_view_get = datav.shift();
          // console.log('data', this.id_tipo_view_get.codigo);
          this.getIdTipoNumeracion(userConn, this.id_tipo_view_get.codigo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacenParamUsuario(userConn, user) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getAlmacenUser/";
    return this.api.getAll('/venta/transac/veproforma/getAlmacenUser/' + userConn + "/" + user)
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

  getIdTipoNumeracion(userConn, id_proforma) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getNumActProd/' + userConn + "/" + id_proforma)
      .subscribe({
        next: (datav) => {
          this.id_proforma_numero_id = datav;
          // console.log('data', this.id_proforma_numero_id);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTarifa(useConn, user) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";

    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + useConn + "/" + user)
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

  getDescuentos(useConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --vedescuento/catalogo";

    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + useConn)
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

  getClientByID(userConn, codigo) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/mant/vecliente/ --cliente";
    return this.api.getAll('/venta/mant/vecliente/' + userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          console.log('data', this.cliente);

          this.codigo_cliente = this.cliente.cliente.codigo;
          this.nombre_cliente = this.cliente.cliente.nombre;
          this.nombre_comercial_cliente = this.cliente.cliente.nombre_comercial;
          this.nombre_factura = this.cliente.cliente.nombre_fact;
          this.razon_social = this.cliente.cliente.razonsocial;
          this.complemento_ci = this.cliente.cliente.complemento_ci
          this.nombre_comercial_razon_social = this.nombre_comercial_cliente + "-" + this.razon_social;
          this.tipo_doc_cliente = this.cliente.cliente.tipo_docid;
          this.nit_cliente = this.cliente.cliente.nit;
          this.email_cliente = this.cliente.cliente.email;
          this.whatsapp_cliente = this.cliente.vivienda.celular;
          this.cod_vendedor_cliente = this.cliente.cliente.codvendedor;
          this.moneda = this.cliente.cliente.moneda;
          this.tipo = this.cliente.cliente.tipo;
          this.latitud = this.cliente.vivienda.latitud;
          this.longitud = this.cliente.vivienda.longitud;

          console.log(this.tipo_doc_cliente);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.warning('Usuario Inexiste! ⚠️');
        },
        complete: () => { }
      })
  }

  getAllmoneda(useConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/catalogo/' + useConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get = datav;
          console.log(this.moneda_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTipoDocumentoIdentidadProforma(useConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getTipoDocIdent/' + useConn)
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

  getVendedor(useConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + useConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
          console.log(this.vendedor_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getPrecio(useConn, user) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + useConn + "/" + user)
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

  getDescuento(useConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + useConn)
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

  getDireccionCentral(useConn, cod_usuario) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vetienda/getCentral/' + useConn + "/" + cod_usuario)
      .subscribe({
        next: (datav) => {
          this.direccion_central = datav;
          this.direccion_central_input = this.direccion_central.direccion;
          console.log(this.direccion_central);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getEmpaqueItem(useConn, item) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + useConn + "/" + item)
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

  getDetalleItem(useConn, item, tarifa, descuento) {
    console.log(tarifa, descuento);

    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getItemMatriz/' + useConn + "/" + item + "/" + tarifa + "/" + descuento + "/" + "10")
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

  getAlmacenesSaldos(useConn, cod_usuario) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + useConn + "/" + cod_usuario)
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

    this.getClientByID(userConn, this.cod_cliente_enter);
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
      usuarioreg: [this.user],
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

  guardarCorreo() {
    let ventana = "proforma-edit"
    let detalle = "proforma-actualizoEmail";
    let tipo_transaccion = "transacc-proforma-PUT";
    console.log(this.email_cliente);
    console.log(this.codigo_cliente);


    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let data = {
      codcliente: this.codigo_cliente,
      email: this.email_cliente
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /actualizarCorreoCliente --Update";
    return this.api.update('/venta/transac/veproforma/actualizarCorreoCliente/' + userConn, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(ventana, detalle, tipo_transaccion);
          this.email_save = datav;

          // this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);

          // this._snackBar.open('Se ha editado correctamente!', 'Ok', {
          //   duration: 3000,
          // });

          // location.reload();
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! Ingrese un correo valido ! 📧');
        },
        complete: () => { }
      })



  }


  // itemTabla(){
  //   let errorMessage:string;
  //   errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
  //   return this.api.getAll('/seg_adm/mant/adarea/'+userConn)
  //     .subscribe({
  //       next: (datav) => {
  //         this.item_tabla = datav;

  //         // this.dataSource = new MatTableDataSource(this.area);
  //         // this.dataSource.paginator = this.paginator;
  //         // this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

  //         this.spinner.show();
  //         setTimeout(() => {
  //           this.spinner.hide();
  //         }, 1500);
  //       },

  //       error: (err: any) => { 
  //         console.log(err, errorMessage);
  //       },
  //       complete: () => { }
  //     })
  // }








































  modalTipoID(): void {
    this.dialog.open(ModalIdtipoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  modalVendedor(): void {
    this.dialog.open(ModalVendedorComponent, {
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

  modalCatalogoProductos(): void {
    this.dialog.open(ModalItemsComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalClientes(): void {
    this.dialog.open(ModalClienteComponent, {
      width: 'auto',
      height: 'auto',
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

  modalClientesDireccion(enterAnimationDuration: string, exitAnimationDuration: string, cod_cliente): void {
    this.dialog.open(ModalClienteDireccionComponent, {
      width: 'auto',
      height: 'auto',
      data: { cod_cliente: cod_cliente },
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



  async receiveMessage($event) {
    this.codigo_cliente = $event;
  }
}



