import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalVendedorComponent } from '../../modal-vendedor/modal-vendedor.component';
import { MonedaCatalogoComponent } from '@components/mantenimiento/administracion/moneda/moneda-catalogo/moneda-catalogo/moneda-catalogo.component';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { ModalClienteComponent } from '../../modal-cliente/modal-cliente.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { ModalClienteDireccionComponent } from '../../modal-cliente-direccion/modal-cliente-direccion.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { ModalSubTotalComponent } from '../../modal-sub-total/modal-sub-total.component';
import { ModalIvaComponent } from '../../modal-iva/modal-iva.component';
import { ModalDesctExtrasComponent } from '../../modal-desct-extras/modal-desct-extras.component';
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
import { Subject, takeUntil } from 'rxjs';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { SaldoItemMatrizService } from '../../matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ModalSaldosComponent } from '../../matriz-items/modal-saldos/modal-saldos.component';

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
        // case "inputCatalogoIdTipo":
        //   this.modalTipoID();
        //   break;
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
          this.modalClientes();
          //this.enterCliente();
          break;
        case "inputCatalogoPrecioVentaDetalle":
          this.modalPrecioVentaDetalle();
          break;
        case "inputMoneda":
          this.modalCatalogoMoneda();
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
  num_caja:any;
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



  // Datos TOTALES de footer
  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;
  public total_X_PU: boolean = false;


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

  constructor(private api: ApiService, private dialog: MatDialog, private _formBuilder: FormBuilder, 
    private datePipe: DatePipe, private spinner: NgxSpinnerService, private log_module: LogService,
    private saldoItemServices: SaldoItemMatrizService, private serviciMoneda: MonedaServicioService,
    private servicioPrecioVenta: ServicioprecioventaService,private servicioDesctEspecial: DescuentoService,
    private servicioCliente: ServicioclienteService,private itemservice: ItemServiceService,
    public nombre_ventana_service: NombreVentanaService,
    private toastr: ToastrService,  private almacenservice: ServicioalmacenService,  ) {
    
    
    this.FormularioData = this.createForm();
    
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  
    if (this.agencia_logueado === 'Loc') {
      this.agencia_logueado = '311'
    }



  }

  ngOnInit() {
    this.getHoraFechaServidorBckEnd();
    this.getAlmacen();
    this.getAlmacenParamUsuario();
    this.getAllmoneda();
    this.getTipoDocumentoIdentidadProforma();
    this.getIDScomplementarProforma();
    this.getTarifa();
    this.getDescuentos();
    this.mandarNombre();


    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
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
    this.servicioCliente.disparadorDeClientes.subscribe(data => {
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
    this.serviciMoneda.disparadorDeMonedas.subscribe(data => {
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
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
    });
    // fin_precio_venta

    // descuentos
      this.servicioDesctEspecial.disparadorDeDescuentos.subscribe(data => {
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
    this.itemservice.disparadorDeItems.subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data.item;
      this.cantidad_item_matriz = data.cantidad;
      
      this.getEmpaqueItem(this.codigo_item_catalogo);
    });
    //

    //Item Sin Procesar DEL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsSeleccionadosSinProcesar.subscribe(data => {
      //console.log("Recibiendo Item Sin Procesar: ", data);
      //this.item_seleccionados_catalogo_matriz_sin_procesar = data;
      this.total = 0.00;
      this.subtotal = 0.00;
      this.recargos = 0.00;
      this.des_extra = 0.00;
      this.iva = 0.00;
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

  getAlmacenParamUsuario() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
    return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          // console.log('data', this.almacn_parame_usuario);

          this.almacn_parame_usuario_almacen = datav.codalmacen;
          // this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          // this.cod_descuento_modal = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {

        }
      })
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

  getAllmoneda() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get_fuction = datav;
          // console.log(this.moneda_get_fuction);
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

  getMonedaTipoCambio(moneda) {
    let moned = moneda;

    console.log(moneda);
    let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adtipocambio/getmonedaValor/";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getmonedaValor/' + this.userConn + "/" + this.moneda_base + "/" + moned + "/" + fechareg)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio_moneda_catalogo = datav;
          // console.log(this.tipo_cambio_moneda_catalogo);
          this.tipo_cambio_moneda_catalogo = this.tipo_cambio_moneda_catalogo.valor;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTarifa() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          // console.log("Precio Venta: ", datav );

          this.cod_precio_venta_modal_codigo = datav[0].codigo;
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
    console.warn("HOLA LOLA");
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
          this.toastr.warning("NO HAY CUFD GENERADO PARA HOY DIA ❌ 🗓️");

          console.log(err, errorMessage);
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









































































  get f() {
    return this.FormularioData.controls;
  }

  createForm(): FormGroup {
    // console.log(this.tipo_complementopf_input, this.input_complemento_view);
    let fecha_actual = this.fecha_actual;

    // if(this.tipo_complementopf_input === 0) {
    //   this.dataform.tipo_complementopf === tipo_complementopf_val0;
    // }

    // if (this.input_complemento_view === null) {
    //   this.input_complemento_view = valor_cero;
    // }



    return this._formBuilder.group({
      //data de la primera fila
      num_caja: this.dataform.num_caja,
      CUFD: this.dataform.CUFD,
      codigo_control_get:this.dataform.codigo_control_get,
      dtpfecha_limite_get:this.dataform.dtpfecha_limite_get,
      nrolugar_get:this.dataform.nrolugar_get,


      fechareg: [fecha_actual],
      horareg: this.dataform.horareg,
      hora: this.dataform.hora,
      usuarioreg: this.usuarioLogueado,
      horaaut: this.dataform.horaaut,
      hora_inicial: this.dataform.hora_inicial,

      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      fecha: [this.fecha_actual],
      celular: this.dataform.celular,

      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: [this.des_extra],
      tipopago: [this.dataform.tipopago === 1 ? 1 : 0, Validators.required],
      transporte: [this.dataform.transporte, Validators.compose([Validators.required])],
      nombre_transporte: [this.dataform.nombre_transporte, Validators.compose([Validators.required])],
      tipo_docid: [this.dataform.tipo_docid, Validators.compose([Validators.required])],
      preparacion: [this.dataform.preparacion, Validators.compose([Validators.required])],
      tipoentrega: [this.dataform.tipoentrega === undefined ? "ENTREGAR" : this.dataform.tipoentrega, Validators.compose([Validators.required])],
      fletepor: [this.dataform.fletepor === "CLIENTE", Validators.compose([Validators.required])],

      fecha_inicial: [this.fecha_actual],
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

      obs: this.dataform.obs === null ? " " : this.dataform.obs,
      obs2: [""],
      direccion: [this.dataform.direccion],
      peso: Number(this.peso),
      codcliente_real: this.codigo_cliente,
      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],
      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email, Validators.compose([Validators.required])],

      venta_cliente_oficina: this.dataform.venta_cliente_oficina === undefined ? false : true,
      tipo_venta: ["0"],

      contra_entrega: this.contra_entrega,
      estado_contra_entrega: [this.dataform.estado_contra_entrega === undefined ? "" : this.dataform.estado_contra_entrega],

      odc: "",
      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud === undefined ? 0 : this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud

      idanticipo: [""], //anticipo VentasL
      numeroidanticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [this.dataform.pago_contado_anticipado === null ? false : this.dataform.pago_contado_anticipado], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      //complementar input
      idpf_complemento: this.dataform.idpf_complemento === undefined ? " " : this.dataform.idpf_complemento, //aca es para complemento de proforma
      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? 0 : this.dataform.nroidpf_complemento,


      idsoldesctos: "0", // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [0], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024
      monto_anticipo: 0, //anticipo Ventas
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
    });
  }

  mandarCodCliente(cod_cliente) {
    this.total = 0.00;
    this.subtotal = 0.00;

    this.getClientByID(cod_cliente);
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
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.warning('Usuario Inexiste! ⚠️');
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

  guardarNombreCliente() {
    // let tipo_doc_cliente_parse_string = this.tipo_doc_cliente.toString();
    // let nit_string;
    // let cliente_nuevo: any = [];
    // let detalle: string = "Nombre Cliente";

    // if (this.valor_nit !== undefined) {
    //   nit_string = this.valor_nit.toString();
    // }

    // cliente_nuevo = {
    //   codSN: this.codigo_cliente,
    //   nomcliente_casual: this.nombre_comercial_razon_social,
    //   nit_cliente_casual: nit_string,
    //   tipo_doc_cliente_casual: tipo_doc_cliente_parse_string,
    //   email_cliente_casual: this.email_cliente === undefined ? this.email : this.email_cliente,
    //   celular_cliente_casual: this.whatsapp_cliente === undefined ? " " : this.whatsapp_cliente,
    //   codalmacen: this.agencia_logueado,
    //   codvendedor: this.cod_vendedor_cliente,
    //   usuarioreg: this.usuarioLogueado,
    // };
    // console.log(cliente_nuevo);

    // this.spinner.show();
    // let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/crearCliente/";
    // return this.api.create('/venta/transac/veproforma/crearCliente/' + this.userConn, cliente_nuevo)
    //   .subscribe({
    //     next: (datav) => {
    //       this.usuario_creado_save = datav;
    //       console.log(this.usuario_creado_save);
    //       this.toastr.success('!CLIENTE GUARDADO!');
    //       this.log_module.guardarLog(this.ventana, "Creacion" + detalle, "POST", this.id_tipo_view_get_codigo, this.id_proforma_numero_id);

    //       this._snackBar.open('!CLIENTE GUARDADO!', 'Ok', {
    //         duration: 2000,
    //        panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
    //       });

    //       setTimeout(() => {
    //         this.spinner.hide();
    //       }, 500);
    //     },

    //     error: (err: any) => {
    //       console.log(err, errorMessage);

    //       setTimeout(() => {
    //         this.spinner.hide();
    //       }, 500);
    //     },
    //     complete: () => {
    //       setTimeout(() => {
    //         this.spinner.hide();
    //       }, 500);
    //     }
    //   })
  }

  verificarNit() {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "VERIFICANDO NIT...." },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
      }
    });
  }

  onPaste(event: any) {
    event.preventDefault();
    // También puedes mostrar un mensaje al usuario indicando que el pegado está bloqueado
    alert("EVENTO BLOQUEADO, NO PEGAR");
  }

  setEmailDefault() {
    this.email_cliente = "facturasventas@pertec.com.bo";
  }

  guardarCorreo() {
    let ventana = "proforma"
    let detalle = "proforma-actualizoEmail";
    let tipo_transaccion = "transacc-proforma-PUT";

    console.log(this.email_cliente);
    console.log(this.codigo_cliente);

    let data = {
      codcliente: this.codigo_cliente,
      email: this.email_cliente
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: -/venta/transac/veproforma/actualizarCorreoCliente/ --Update";
    // return this.api.update('/venta/transac/veproforma/actualizarCorreoCliente/' + this.userConn, data)
    //   .subscribe({
    //     next: (datav) => {
    //       this.log_module.guardarLog(ventana, detalle, tipo_transaccion, "", "");
    //       this.email_save = datav;
    //       this.toastr.success('!CORREO GUARDADO!');
    //       this.log_module.guardarLog(this.ventana, "Creacion" + detalle, "POST", this.id_tipo_view_get_codigo, this.id_proforma_numero_id);

    //       this._snackBar.open('!CORREO GUARDADO!', 'Ok', {
    //         duration: 3000,
    //         panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
    //       });
    //     },

    //     error: (err: any) => {
    //       console.log(err, errorMessage);
    //       this.toastr.error('! Ingrese un correo valido ! 📧');
    //     },
    //     complete: () => {

    //     }
    //   })
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
  
  totabilizar() {
    let total_proforma_concat: any = [];
    //valor del check en el mat-tab complementar proforma
    // if (this.disableSelectComplemetarProforma === false) { //valor del check en el mat-tab complementar proforma this.disableSelectComplemetarProforma.value 
    //   this.complementopf = 0;
    // } else {
    //   this.complementopf = 1;
    // }

    // let tamanio_array_descuentos = this.array_de_descuentos_ya_agregados?.length === undefined ? [] : this.array_de_descuentos_ya_agregados.length;
    // console.warn("tamanio array descuentos", this.array_de_descuentos_ya_agregados?.length);

    // if (tamanio_array_descuentos === 0 || tamanio_array_descuentos === undefined) {
    //   this.array_de_descuentos_ya_agregados = [];
    // };

    // if (this.array_items_carrito_y_f4_catalogo.length === 0) {
    //   this.toastr.error("NO HAY ITEM'S EN EL DETALLE DE PROFORMA");
    // };

    // if (this.habilitar_desct_sgn_solicitud === undefined) {
    //   this.habilitar_desct_sgn_solicitud = false;
    // };

    // this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
    //   ...element,
    //   empaque: element.empaque === undefined ? 0 : element.empaque,
    // }));

    // // console.log(this.FormularioData.valid);
    // total_proforma_concat = {
    //   veproforma: this.FormularioData.value, //este es el valor de todo el formulario de proforma
    //   veproforma1_2: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
    //   veproforma_valida: [],
    //   veproforma_anticipo: this.tabla_anticipos,
    //   vedesextraprof: this.array_de_descuentos_ya_agregados === undefined ? [] : this.array_de_descuentos_ya_agregados, //array de descuentos
    //   verecargoprof: this.recargo_de_recargos, //array de recargos
    //   veproforma_iva: this.veproforma_iva, //array de iva
    // };

    // console.log("🚀 ~ ProformaComponent ~ totabilizar ~ total_proforma_concat:", total_proforma_concat)
    // if (this.habilitar_desct_sgn_solicitud != undefined && this.tipo_complementopf_input != undefined) {
    //   console.log("DATOS VALIDADOS");
    //   this.spinner.show();
    //   let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
    //   return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
    //     this.habilitar_desct_sgn_solicitud + "/" + this.tipo_complementopf_input + "/" + this.desct_nivel_actual + "/" + this.codigo_cliente_catalogo_real, total_proforma_concat)
    //     .subscribe({
    //       next: (datav) => {
    //         this.totabilizar_post = datav;
    //         console.log("totabilizado llegando del backend: ", this.totabilizar_post);
    //         this.toastr.success('! TOTALIZADO EXITOSAMENTE !');

    //         setTimeout(() => {
    //           this.spinner.hide();
    //         }, 50);
    //       },

    //       error: (err) => {
    //         console.log(err, errorMessage);
    //         this.toastr.error('! NO SE TOTALIZO !');

    //         setTimeout(() => {
    //           this.spinner.hide();
    //         }, 50);
    //       },
    //       complete: () => {
    //         this.mandarEntregar();
    //         this.total = this.totabilizar_post.totales?.total;
    //         this.subtotal = this.totabilizar_post.totales?.subtotal;
    //         this.recargos = this.totabilizar_post.totales?.recargo;
    //         this.des_extra = this.totabilizar_post.totales?.descuento;
    //         this.iva = this.totabilizar_post.totales?.iva;
    //         this.peso = Number(this.totabilizar_post.totales?.peso);
    //         this.tablaIva = this.totabilizar_post.totales?.tablaIva;

    //         this.getNombreDeDescuentos(this.totabilizar_post.totales?.tablaDescuentos);

    //         //aca se pinta con la info q llega del backend
    //         this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf;

    //         // Agregar el número de orden a los objetos de datos
    //         this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
    //           element.nroitem = index + 1;
    //           element.orden = index + 1;
    //         });

    //         this.dataSource = new MatTableDataSource(this.array_items_carrito_y_f4_catalogo);
    //       }
    //     })
    // } else {
    //   this.toastr.info("VALIDACION ACTIVA 🚨");
    //   console.log("HAY QUE VALIDAR DATOS");
    //   setTimeout(() => {
    //     this.spinner.hide();
    //   }, 50);
    // }
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


  transferirProforma() {
    console.log(this.num_idd, this.num_id);

    this.spinner.show()
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/obtProfxModif/";

    return this.api.getAll('/venta/modif/docmodifveproforma/obtProfxModif/' + this.userConn + "/" + this.num_idd + "/" + this.num_id + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          //this.imprimir_proforma_tranferida(datav);
          this.toastr.success('! TRANSFERENCIA EXITOSA !');

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
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
    let agencia = this.agencia_logueado;
    //this.item_seleccionados_catalogo_matriz_codigo = item;

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

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getsaldosCompleto/";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', datav, "+++ MENSAJE SALDO VPN: " + this.id_tipo[0].resp);
          // this.letraSaldos = this.id_tipo[0].resp;
          // this.saldo_variable = this.id_tipo[2];

          // LETRA
          this.id_tipo[1].forEach(element => {
            if (element.descripcion === 'Total Saldo') {
              if (element.valor < 0) {
                this.saldoItem = 0;
              } else {
                this.saldoItem = element.valor;
              }

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

  // CATALOGOS ITEMS
  modalMatrizProductos(): void {
    // Realizamos todas las validaciones
    // if (this.moneda_get_catalogo === '') {
    //   this.dialog.open(VentanaValidacionesComponent, {
    //     width: 'auto',
    //     height: 'auto',
    //     disableClose: true,
    //     data: {
    //       message: "SELECCIONE MONEDA",
    //     }
    //   });
    //   return; // Detenemos la ejecución de la función si la validación falla
    // }

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

    // if (this.desct_nivel_actual === undefined) {
    //   this.dialog.open(VentanaValidacionesComponent, {
    //     width: 'auto',
    //     height: 'auto',
    //     disableClose: true,
    //     data: {
    //       message: "SELECCIONE NIVEL DE DESCT.",
    //     }
    //   });
    //   return;
    // }

    console.log(this.agencia_logueado);
    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      // data: {
      //   //esta info tarifa ya esta en la matriz xd
      //   // tarifa: this.cod_precio_venta_modal_codigo,
      //   descuento: this.cod_descuento_modal,
      //   codcliente: this.codigo_cliente,
      //   codcliente_real: this.codigo_cliente_catalogo_real,
      //   codalmacen: this.agencia_logueado,
      //   // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
      //   // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
      //   desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
      //   codmoneda: this.moneda_get_catalogo,
      //   fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
      //   items: this.array_items_carrito_y_f4_catalogo,
      //   descuento_nivel: this.desct_nivel_actual,
      //   tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
      //   // tamanio_carrito_compras: ultimo_valor?.nroitem,
      // }
    });
  }
  public habilitar_desct_sgn_solicitud: boolean = false;
 
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

    if (this.cod_descuento_modal === undefined) {
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
        //esta info tarifa ya esta en la matriz xd
        // tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.cod_descuento_modal,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        // tamanio_carrito_compras: ultimo_valor?.nroitem,
      }
    });
  }

  modalCatalogoProductos(): void {
    this.dialog.open(ModalItemsComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        // tarifa: this.cod_precio_venta_modal_codigo,
        // descuento: this.cod_descuento_modal,
        // codcliente: this.codigo_cliente,
        // codalmacen: this.agencia_logueado,
        // desc_linea_seg_solicitud: "",
        // codmoneda: this.moneda_get_catalogo,
        // fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        // //itemss: this.item_seleccionados_catalogo_matriz_sin_procesar,
        // descuento_nivel: this.desct_nivel_actual,
      },
    });
  }
  // FIN CATALOGOS ITEMS






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
      this.cantidadChangeMatrix(products, value);
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
    // this.total_X_PU = true;

    // this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
    //   + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad_pedida +
    //   "/" + elemento.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
    //   .subscribe({
    //     next: (datav) => {
    //       //this.almacenes_saldos = datav;
    //       console.log("Total al cambio de DE en el detalle: ", datav);
    //       // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
    //       elemento.coddescuento = Number(datav.coddescuento);
    //       elemento.preciolista = Number(datav.preciolista);
    //       elemento.preciodesc = Number(datav.preciodesc);
    //       elemento.precioneto = Number(datav.precioneto);
    //     },

    //     error: (err: any) => {
    //       console.log(err, errorMessage);
    //     },
    //     complete: () => {
    //     }
    //   });
  }



  // PRECIO VENTA DETALLE
  TPChangeMatrix(element: any, newValue: number) {
    console.log(element);
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    element.codtarifa = Number(newValue);
    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    // console.log(this.dataSource.filteredData);
    // this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

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
        return this.formatNumberTotalSub(cantidad * precioneto);
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


























    mandarNombre() {
      this.nombre_ventana_service.disparadorDeNombreVentana.emit({
        nombre_vent: this.ventana,
      });
    }

    //SECCION DE TOTALES
    modalSubTotal() {
      this.dialog.open(ModalSubTotalComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          // descuento_nivel: this.desct_nivel_actual,
          cod_cliente: this.codigo_cliente,
          cod_almacen: this.agencia_logueado,
          cod_moneda: this.moneda_get_catalogo,
          // desc_linea: this.habilitar_desct_sgn_solicitud,
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
          // cliente_real: this.codigo_cliente_catalogo_real
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
          // tablaIva: this.tablaIva
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
  
      // if (this.tipopago === undefined || this.tipopago === '') {
      //   this.dialog.open(VentanaValidacionesComponent, {
      //     width: 'auto',
      //     height: 'auto',
      //     disableClose: true,
      //     data: {
      //       message: "SELECCIONE TIPO PAGO EN PROFORMA",
      //     }
      //   });
      //   return;
      // }
  
      // if (this.tipopago === 0) {
      //   this.tipopago = 0;
      // } else {
      //   this.tipopago = 1;
      // }
  
      this.submitted = true;
      // console.log("Array de descuentos que ya estaban en proforma: ", this.array_de_descuentos_ya_agregados);
      let a = {
        // cabecera: this.FormularioData.value,
        // desct: this.cod_descuento_total,
        // contra_entrega: this.contra_entrega,
        // items: this.array_items_carrito_y_f4_catalogo,
        // recargos_del_total: this.recargos,
        // cod_moneda: this.moneda_get_catalogo,
        // recargos_array: this.recargo_de_recargos,
        // array_de_descuentos_ya_agregados_a_modal: this.array_de_descuentos_ya_agregados,
        // cmtipo_complementopf: this.disableSelectComplemetarProforma === false ? 0 : 1,
        // cliente_real: this.codigo_cliente_catalogo_real,
      }
  
      if (this.FormularioData.valid) {
        this.dialog.open(ModalDesctExtrasComponent, {
          width: 'auto',
          height: 'auto',
          data: {
            // cabecera: this.FormularioData.value,
            // desct: this.cod_descuento_total,
            // contra_entrega: this.contra_entrega,
            // items: this.array_items_carrito_y_f4_catalogo,
            // recargos_del_total: this.recargos,
            // cod_moneda: this.moneda_get_catalogo,
            // recargos_array: this.recargo_de_recargos,
            // array_de_descuentos_ya_agregados_a_modal: this.array_de_descuentos_ya_agregados,
            // cmtipo_complementopf: this.disableSelectComplemetarProforma === false ? 0 : 1,
            // cliente_real: this.codigo_cliente_catalogo_real,
          }
  
        });
        console.log("Valor Formulario Para ver Descuentos:", a);
      } else {
        console.log("Valor Formulario Para ver Descuentos ValidacionVentana FormData.value createForm:", this.FormularioData.value);
        this.toastr.warning("REVISE FORMULARIO");
      }
    }



  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_almacen: cod_almacen,
        //cod_item: this.item_seleccionados_catalogo_matriz_codigo,
        posicion_fija: posicion_fija,
        //id_proforma: this.id_tipo_view_get_codigo,
        //numero_id: this.id_proforma_numero_id
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

  modalClientes(): void {
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

  modalClientesDireccion(cod_cliente): void {
    this.dialog.open(ModalClienteDireccionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { cod_cliente: cod_cliente },
    });
  }
  
}
