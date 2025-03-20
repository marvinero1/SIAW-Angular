import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MonedaCatalogoComponent } from '@components/mantenimiento/administracion/moneda/moneda-catalogo/moneda-catalogo/moneda-catalogo.component';
import { MonedaServicioService } from '@components/mantenimiento/administracion/moneda/servicio-moneda/moneda-servicio.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { CatalogoSolicitudUrgenteComponent } from '@components/mantenimiento/inventario/numsolicitudurgente/catalogo-solicitud-urgente/catalogo-solicitud-urgente.component';
import { CatalogoSolUrgenteService } from '@components/mantenimiento/inventario/numsolicitudurgente/catalogo-solicitud-urgente/servicio-catalogo-sol-urgente/catalogo-sol-urgente.service';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { SaldoItemMatrizService } from '@components/mantenimiento/ventas/matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ModalClienteComponent } from '@components/mantenimiento/ventas/modal-cliente/modal-cliente.component';
import { ModalDetalleObserValidacionComponent } from '@components/mantenimiento/ventas/modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { CatalogoProformasComponent } from '@components/mantenimiento/ventas/transacciones/proforma/catalogo-proformas/catalogo-proformas.component';
import { ServicioCatalogoProformasService } from '@components/mantenimiento/ventas/transacciones/proforma/sevicio-catalogo-proformas/servicio-catalogo-proformas.service';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { ExceltoexcelComponent } from '@components/uso-general/exceltoexcel/exceltoexcel.component';
import { ExceltoexcelService } from '@components/uso-general/exceltoexcel/servicio-excel-to-excel/exceltoexcel.service';
import { ApiService } from '@services/api.service';
import { ItemDetalle } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-solicitud-mercaderia-urgente',
  templateUrl: './solicitud-mercaderia-urgente.component.html',
  styleUrls: ['./solicitud-mercaderia-urgente.component.scss']
})
export class SolicitudMercaderiaUrgenteComponent implements OnInit {

  public nombre_ventana: string = "docinpedido.vb";
  public ventana: string = "Pedido";
  public detalle = "Pedido";
  public tipo = "transaccion-docinpedido-POST";

  dataform: any = {};
  fecha_actual: any;
  fecha_servidor: any;
  hora_actual: any;
  almacen_seleccionado: any;

  public array_items_carrito_y_f4_catalogo: any = [];
  public item_seleccionados_catalogo_matriz: any = [];
  private numberFormatter_2decimales: Intl.NumberFormat;
  private numberFormatter_6decimales: Intl.NumberFormat;

  products!: ItemDetalle[];
  selectedProducts: ItemDetalle[] = [];


  FormularioData: FormGroup;
  id_sol_urgente: any;
  numero_id_sol_urgente: any;
  cod_vendedor: any;
  almacen_origen: any;
  almacen_destino: any;
  codigo_cliente: any;
  razon_social: any;
  codtarifa: any;
  codmoneda: any;
  transporte: any;
  cod_cliente: any;
  nomcliente: any;
  especial: any;
  tipocliente: any;
  tipopago: any;
  totalventa: any;
  total: any;
  tpollegada: any;
  obs: any;
  flete: any;
  idproforma: any;
  numeroidproforma: any;
  peso_pedido: any;
  codigo_proforma: any;
  codigo: any;



  array_almacenes: any = [];
  item_obj_seleccionado: any;
  item_obj_seleccionado_codigo: any = '0';

  //catalogos
  id_tipo_sol_urgente: any = [];
  vendedors_array: any = [];
  array_precios: any = [];
  array_clientes: any = [];

  //Saldos
  almacenes_saldos: any = [];
  almacn_parame_usuario: any;
  almacn_parame_usuario_almacen: any;
  cod_precio_venta_modal_codigo: any;
  cod_descuento_modal: any;

  public saldoItem: number;
  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;
  
  private unsubscribe$ = new Subject<void>();

  // NEGATIVOS
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];

  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;
  public validacion_post_negativos: any = [];

  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
    'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
    'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];
  // FIN NEGATIVOS

  // MAX DE VENTAS
  dataSourceLimiteMaximoVentas = new MatTableDataSource();
  dataSourceWithPageSize_LimiteMaximoVentas = new MatTableDataSource();
  public validacion_post_max_ventas: any = [];
  
  displayedColumnsLimiteMaximoVentas = ['codigo', 'descripcion', 'cantidad_pf_anterior', 'cantidad', 'saldo',
    'porcen_venta', 'cod_desct_esp', 'saldo', 'porcen_maximo', 'cantidad_max_venta', 'empaque_precio', 'obs']
  
  validacion_post_max_venta_filtrados_si_sobrepasa: any = [];
  validacion_post_max_venta_filtrados_no_sobrepasa: any = [];

  toggleTodosMaximoVentas: boolean = false;
  toggleMaximoVentaSobrepasan: boolean = false;
  toggleMaximoVentasNoSobrepasan: boolean = false;
  // FIN DE MAX VENTAS

  // TABS
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  // FIN TABS

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService, private _formBuilder: FormBuilder,
    private almacenservice: ServicioalmacenService, private excelService: ExceltoexcelService, private datePipe: DatePipe, private router: Router,
    private messageService: MessageService, private spinner: NgxSpinnerService, private servicioCliente: ServicioclienteService,
    public servicioCatalogoSolicitudesUrgentes: CatalogoSolUrgenteService, private serviciovendedor: VendedorService, public servicioCatalogoProformas: ServicioCatalogoProformasService,
    private serviciMoneda: MonedaServicioService, private servicioPrecioVenta: ServicioprecioventaService, private saldoItemServices: SaldoItemMatrizService) {
    
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;


    this.FormularioData = this.createForm();
    
    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_6decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }); 
  }

  ngOnInit() {
    this.getParametrosIniciales();
    this.getHoraFechaServidorBckEnd();
    this.getIdTipoSolUrgente();
    this.getVendedorCatalogo();
    this.getAlmacen();
    this.getTarifa();
    this.getClienteCatalogo();

    this.getAlmacenesSaldos();

    //ID TIPO
    this.servicioCatalogoSolicitudesUrgentes.disparadorDeCatalogoDeSolicitudesUrgentes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID Sol Urgente: ", data);
      this.id_sol_urgente = data.id_sol_urgente;
      this.numero_id_sol_urgente = data.nro_actual;
    });
    //

    //ID PROFORMAS
    this.servicioCatalogoProformas.disparadorDeIDProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID Proforma: ", data);
      this.idproforma = data.proforma.id;
    });
    //

    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data_carrito => {
      console.log("Recibiendo Item de Carrito Compra: ", data_carrito);
      // console.log("ARRAY COMPLETO DE MATRIZ Y F4: ", this.array_items_carrito_y_f4_catalogo);

      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      } else {
        // this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      }

      let modifica = this.array_items_carrito_y_f4_catalogo.map((element) => ({
        codsolurgente: 0,
        coditem: element.coditem,
        descripcion: element.descripcion,
        medida: element.medida,
        cantidad: element.cantidad,
        saldoag: 0,
        stockmax: 0,
        udm: element.udm,
        precio: element.preciolista,
        total: element.total,
        saldodest: 0,
        pedtotal: 0,
        saldoarea: 0,
        cantidad_pedido: element.cantidad_pedida
      }));

      this.calcularDetalleItems(modifica);
    });
    //

    //CATALOGO F4 ITEMS
    //ItemElejidoCatalogoF4Procesados
    // this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
    //   console.log("Recibiendo Item Procesados De Catalogo F4: ", [data]);
    //   this.item_seleccionados_catalogo_matriz = [data];
    //   console.log("🚀 ~ ProformaComponent ~ this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe ~ data:", [data]);

    //   if (this.item_seleccionados_catalogo_matriz.length === 0) {
    //     this.array_items_carrito_y_f4_catalogo.push(...[data]);
    //   } else {
    //     this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat([data]);
    //   }

    //   this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
    //     ...element,
    //     codaduana: "0"
    //   }));
    // });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Almacen: ", data, this.almacen_seleccionado);
      if (this.almacen_seleccionado === "origen") {
        this.almacen_origen = data.almacen.codigo
      }

      if (this.almacen_seleccionado === "destino") {
        this.almacen_destino = data.almacen.codigo
      }
    });
    //

    //Clientes
    this.servicioCliente.disparadorDeClientes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.cod_cliente = data.cliente.codigo;
      this.nomcliente = data.cliente.nombre
      //this.getClientByID(data.cliente.codigo);
    });
    //

    //Vendedor
    this.serviciovendedor.disparadorDeVendedores.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_vendedor = data.vendedor.codigo;
    });
    //finvendedor

    //Monedas
    this.serviciMoneda.disparadorDeMonedas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Moneda: ", data);
      this.codmoneda = data.moneda.codigo;
      //this.tipo_cambio_moneda_catalogo = data.tipo_cambio;
    });
    //

    //Servicio ExcelToExcel
    this.excelService.disparadorDeSolicitudUrgente.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("🚀 ~ SolicitudMercaderiaUrgenteComponent ~ this.excelService.disparadorDePedido.pipe ~ data:", data)
      this.array_items_carrito_y_f4_catalogo = data.UrgenteDetalle;


    });
    //

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      // this.cod_precio_venta_modal = data.precio_venta;
      this.codtarifa = data.precio_venta.codigo;

    });
    // fin_precio_venta

    //SALDOS ITEM PIE DE PAGINA
    this.saldoItemServices.disparadorDeSaldoAlm1.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_1 = data.saldo1;
    });

    this.saldoItemServices.disparadorDeSaldoAlm2.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_2 = data.saldo2;
    });

    this.saldoItemServices.disparadorDeSaldoAlm3.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_3 = data.saldo3;
    });

    this.saldoItemServices.disparadorDeSaldoAlm4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_4 = data.saldo4;
    });

    this.saldoItemServices.disparadorDeSaldoAlm5.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_5 = data.saldo5;
    });
    //FIN SALDOS ITEM PIE DE PAGINA
    
  }

  get f() {
    return this.FormularioData.controls;
  }

  limpiar() { 
    this.id_sol_urgente = "";
    this.numero_id_sol_urgente = "";
    this.cod_vendedor = "";
    this.almacen_origen = "";
    this.almacen_destino = "";
    this.codigo_cliente = "";
    this.razon_social = "";
    this.codtarifa = "";
    this.transporte = "";
    this.nomcliente = "";


    this.array_items_carrito_y_f4_catalogo = [];
    this.validacion_post_negativos = [];
    this.item_obj_seleccionado = '';
    this.item_obj_seleccionado_codigo = '';



  }

  getParametrosIniciales() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/transac/docinsolurgente/getParamsIniSolUrg/"
    return this.api.getAll('/inventario/transac/docinsolurgente/getParamsIniSolUrg/' + this.userConn + "/" + this.usuarioLogueado + "/"+ this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ PedidoComponent ~ getParametrosIniciales:", datav);
          this.almacen_origen = datav.codalmacen;
          //this.codalmorigenTextDescipcion = datav.codalmacendescripcion;
          this.codmoneda = datav.codmoneda_total
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
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.array_almacenes = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // console.log(datav);
          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
          this.hora_actual = datav.horaServidor;
          this.fecha_servidor = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIdTipoSolUrgente() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/intiposolurgente/catalogo/";
    return this.api.getAll('/inventario/mant/intiposolurgente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // console.log("🚀 ~ SolicitudMercaderiaUrgenteComponent ~ getIdTipoSolUrgente ~ datav:", datav)
          this.id_tipo_sol_urgente = datav;

          console.log('data', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getVendedorCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          this.vendedors_array = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTarifa() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.array_precios = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getClienteCatalogo() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vecliente/catalogo/";
    return this.api.getAll('/venta/mant/vecliente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.array_clientes = datav;
          // console.log('data', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveIDSolUrgente(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.id_tipo_sol_urgente.some(objeto => objeto.id === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  onLeaveVendedor(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.vendedors_array.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.array_almacenes.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.array_precios.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      // console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  onLeaveCliente(event: any) {
    const inputValue = event.target.value.toString();
    let entero = inputValue;
    console.log("🚀 ~ SolicitudMercaderiaUrgenteComponent ~ onLeaveCliente ~ entero:", entero, this.array_clientes)
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.array_clientes.some(objeto => objeto.codigo === entero);
    const encontrado_element = this.array_clientes.find(objeto => objeto.codigo === entero);

    console.log("🚀 ~ SolicitudMercaderiaUrgenteComponent ~ onLeaveCliente ~ encontrado:", encontrado, encontrado_element)

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = "";
      // console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
      this.nomcliente = encontrado_element.nombre
    }
  }

  //Importar to ZIP
  async onFileChangeZIP(event: any) {
    const file = event.target.files[0];
    console.log(file);

    if (file.type === 'application/x-zip-compressed' || file.type === 'application/zip') {
      // Crear un FormData y agregar el archivo
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.api.cargarArchivo('/inventario/transac/docinpedido/importPedidoinJson/', formData)
        .subscribe({
          next: (datav) => {
            console.log("Data ZIP:", datav);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'ARCHIVO ZIP CARGADO EXITOSAMENTE ✅' })
            this.imprimir_zip_importado(datav);

            setTimeout(() => {
              this.spinner.hide();
            }, 500);
          },
          error: (err: any) => {
            console.log(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ERROR AL CARGAR EL ARCHIVO ❌' });
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
    } else {
      console.error('Please upload a valid ZIP file.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SOLO SELECCIONAR FORMATO .ZIP ❌' });
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

  imprimir_zip_importado(zip_json) {
    let documento: any;
    this.spinner.show();

    console.log(zip_json);

    // this.id = zip_json.cabeceraList[0]?.id;
    // this.numeroid = zip_json.cabeceraList[0]?.numeroid;
    // this.observaciones = zip_json.cabeceraList[0]?.obs;

    // documento = zip_json.cabeceraList[0]?.documento

    // if (documento === "PEDIDO") {
    //   this.fecha_actual = this.datePipe.transform(zip_json.cabeceraList[0]?.fechareg, "yyyy-MM-dd");
    //   this.codalmdestidoText = zip_json.cabeceraList[0]?.codalmdestino;
    //   this.observaciones = zip_json.cabeceraList[0]?.obs;

    //   this.array_items_carrito_y_f4_catalogo = zip_json.detalleList;
    // }

    this.array_items_carrito_y_f4_catalogo = zip_json.detalleList;
    setTimeout(() => {
      this.spinner.hide();
    }, 110);
  }
  //FIN Importar ZIP

  calcularDetalleItems(array) { 
    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinsolurgente/calcularDetalle/";
    return this.api.create('/inventario/transac/docinsolurgente/calcularDetalle/' + this.userConn + "/" + this.agencia_logueado + "/" + this.BD_storage + "/" + this.usuarioLogueado + "/" + this.codtarifa, array)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("calcularDetalleItems: ", datav.detalle);
          
          setTimeout(() => {
            this.spinner.hide()
          }, 1000);
          return this.array_items_carrito_y_f4_catalogo = datav.detalle;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  recalcularCarritoCompras() { 
    if (this.codtarifa === undefined || this.codtarifa === null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA PRECIO, SELECCIONE PRECIO ANTES' });
      this.spinner.hide();
      return;
    }

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY ITEMS EN EL DETALLE PARA RECALCULAR !' });
      this.spinner.hide();
      return;
    }

    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/docinsolurgente/recalcularDetalle/";
    return this.api.create('/inventario/transac/docinsolurgente/recalcularDetalle/' + this.userConn + "/" + this.BD_storage + "/" + this.codtarifa + "/" +
      this.agencia_logueado + "/" + this.usuarioLogueado, this.array_items_carrito_y_f4_catalogo)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("recalcularCarritoCompras: ", datav);
          this.array_items_carrito_y_f4_catalogo = datav.detalle;

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

  // SALDOS
  getAlmacenesSaldos() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCodAlmSlds/";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          // console.log("Almacenes: ", this.almacenes_saldos);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.agencia_logueado;
    let array_send = {
      agencia: agencia_concat,
      codalmacen: this.agencia_logueado,
      coditem: item,
      codempresa: this.BD_storage,
      usuario: this.usuarioLogueado,

      idProforma: this.id_sol_urgente,
      nroIdProforma: this.numero_id_sol_urgente
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.create('/venta/transac/veproforma/getsaldoDetalleSP/' + this.userConn, array_send)
      .subscribe({
        next: (datav) => {
          console.log('data', datav);
          this.saldoItem = datav.totalSaldo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  // FIN SALDOS



  // eventos de seleccion en la tabla
  onRowSelect(event: any) {
    this.item_obj_seleccionado = event.data;
    this.item_obj_seleccionado_codigo = event.data?.coditem;

    console.log('Row Selected:', event.data, this.item_obj_seleccionado_codigo);

    this.getSaldoItem(event.data.coditem);

  }

  onRowSelectForDelete() {
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

    // Limpiar el array de productos seleccionados
    this.selectedProducts = [];
  }

  onRowUnselect(event: any) {
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);
    }
  }
  // FIN eventos de seleccion en la tabla

  //Evento Tabla
  onEditComplete(event: any) {
    const updatedElement = event.data; // La fila editada
    const updatedField = event.field; // El campo editado (en este caso, "empaque")

    console.log("🚀 ~ onEditComplete ~ Item a editar:", this.item_obj_seleccionado)
    console.log("🚀 ~ onEditComplete ~ updatedField:", event, updatedField, "valor:", updatedElement);

    // if (updatedField === 'empaque') {
    //   this.empaqueChangeMatrix(this.item_obj_seleccionado, updatedElement);
    // }

    // if (updatedField === 'cantidad_pedida') {
    //   this.copiarValorCantidadPedidaACantidad(this.item_obj_seleccionado, updatedElement);
    // }

    // if (updatedField === 'cantidad') {
    //   this.cantidadChangeMatrix(this.item_obj_seleccionado, updatedElement)
    // }
  }
  // fin eventos de seleccion en la tabla

  // NEGATIVOS
  validarProformaSoloNegativos() {
    this.spinner.show();
    // 00060 - VALIDAR SALDOS NEGATIVOS
    // VACIO - TODOS LOS CONTROLES

    if (this.almacen_destino === undefined || this.almacen_destino === null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ALMACEN DESTINO, SELECCIONE ALMACEN DESTINO'});
      this.spinner.hide();
      return;
    }

    const url = `/inventario/transac/docinsolurgente/validarNegativ/${this.userConn}/${this.BD_storage}/${this.almacen_destino}/${this.usuarioLogueado}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;
    this.api.create(url, this.array_items_carrito_y_f4_catalogo).subscribe({
      next: (datav) => {
        console.log("🚀 ~ SolicitudMercaderiaUrgenteComponent ~ this.api.create ~ datav:", datav);

        if (datav.valido) {
          this.messageService.add({ severity: 'success', summary: 'Alerta', detail: datav.msg });
        } else { 
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.msg });
        }

       
        this.validacion_post_negativos = datav.negativos;
        this.abrirTabPorLabel("Negativos");

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
  validarProformaSoloMaximoVenta() {
    console.clear();
    // 00058 - VALIDAR MAXIMO DE VENTA
    // VACIO - TODOS LOS CONTROLES
    this.spinner.show();
    let valores = this.FormularioData?.value;

    if (valores.totalventa === undefined || null) {
      valores.totalventa = 0
    };

    if (valores.especial === undefined || null) {
      valores.especial = false;
    };

    if (valores.flete === undefined || null) {
      valores.flete = "";
    };

    if (valores.tpollegada === undefined || null) {
      valores.tpollegada = "";
    };

    if (valores.codproforma_almacen === undefined || null) {
      valores.codproforma_almacen = 0;
    };    

    if (valores.peso_pedido === undefined || null) {
      valores.peso_pedido = 0;
    };

    if (valores.idproforma === undefined || null) {
      valores.idproforma = "";
    };

    if (valores.numeroidproforma === undefined || null) {
      valores.numeroidproforma = 0;
    };
    
    if (valores.id === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ELEGIR ID' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.numeroid === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA NUMERO ID' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.codtarifa === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ELEGIR PRECIO' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.codalmacen === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ELEGIR ALMACEN ORIGEN' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.codalmdestino === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ELEGIR ALMACEN DESTINO' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.codcliente === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ELEGIR CLIENTE' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.obs === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA OBSERVACIONES' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.tipocliente === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA TIPO CLIENTE' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.tipopago === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA TIPO PAGO' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.transporte === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA TRANSPORTE' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    if (valores.codmoneda === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA COD MONEDA' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    // if (valores.total === undefined || null) {
    //   this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA TOTAL' });
    //   setTimeout(() => {
    //     this.spinner.hide();
    //   }, 0);
    //   return;
    // }

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY ITEMS EN EL DETALLE' });
      setTimeout(() => {
        this.spinner.hide();
      }, 0);
      return;
    }

    let array_submitData = {
      cabecera: valores,
      tablaDetalle: this.array_items_carrito_y_f4_catalogo
    };

    console.log("🚀 ~ SolicitudMercaderiaUrgenteComponent ~ submitData ~ array_submitData:", array_submitData)
    console.log("DATOS VALIDADOS");
    
    const url = `/inventario/transac/docinsolurgente/validarMaximoVta/${this.userConn}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;
    this.api.create(url, array_submitData).subscribe({
      next: (datav) => {
        console.log("🚀 ~ SolicitudMercaderiaUrgenteComponent ~ this.api.create ~ datav:", datav);
        if (datav.valido) {
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });
        } else { 
          this.validacion_post_max_ventas = datav.dtnocumplenMaxVta;
          this.dataSourceLimiteMaximoVentas = new MatTableDataSource(this.validacion_post_max_ventas);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: datav.resp });
        };
        setTimeout(() => {
          this.spinner.hide();
        }, 0);
      },
      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE VALIDO MAX VENTAS, OCURRIO UN PROBLEMA !' });
        setTimeout(() => {
          this.spinner.hide();
        }, 0);
      },
      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 0);
      }
    });
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

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    // console.log(tabs);
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }
  
  eliminarItemTabla(orden, coditem) {
    // Filtrar el array para eliminar el elemento con el número de orden dado y el código de ítem
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {

      return item.orden !== orden || item.coditem !== coditem;
    });
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      codaduana: element.codaduana === undefined ? "0" : element.codaduana
    }));
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString?.toString().replace(',', '.'));
    return this.numberFormatter_2decimales?.format(formattedNumber);
  }

  formatNumberTotalSub6Decimales(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número

    const formattedNumber = parseFloat(numberString?.toString().replace(',', '.'));
    return this.numberFormatter_6decimales?.format(Number(formattedNumber));
  }
















  createForm(): FormGroup {
    return this._formBuilder.group({
      codigo: [(this.dataform?.codigo ?? 0)],
      id: [this.dataform?.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform?.numeroid, Validators.compose([Validators.required])],
      fecha: [this.dataform?.fecha_actual, Validators.compose([Validators.required])],
      fechareg: this.dataform?.fecha_actual,
      horareg: this.hora_actual,
      codvendedor: [this.dataform?.codvendedor, Validators.compose([Validators.required])],
      codalmacen: [Number(this.dataform?.codalmacen), Validators.compose([Validators.required])],
      codalmdestino: [Number(this.dataform?.codalmdestino), Validators.compose([Validators.required])],
      especial: this.dataform?.especial ?? false,
      tipocliente: [this.dataform?.tipocliente, Validators.compose([Validators.required])],
      codcliente: [this.dataform?.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.dataform?.nomcliente, Validators.compose([Validators.required])],
      tipopago: [this.dataform?.tipopago, Validators.compose([Validators.required])],
      codtarifa: this.dataform?.codtarifa,

      codmoneda: [this.dataform?.codmoneda, Validators.compose([Validators.required])],
      total: this.dataform?.total,
      transporte: this.dataform.transporte,
      idproforma: this.dataform.idproforma,
      numeroidproforma: this.dataform.numeroidproforma,
      peso_pedido: this.dataform?.peso_pedido,

      tpollegada: this.dataform?.tpollegada,
      obs: [this.dataform?.obs, Validators.compose([Validators.required])],
      totalventa: this.dataform.totalventa,
      flete: this.dataform?.flete,
      anulada: false, // en documento nuevo el anulado siempre es false
      usuarioreg: this.usuarioLogueado,
      
      codproforma_almacen: this.dataform?.codalmacen, // es el codigo de la proforma a la cual se ah 
      niveles_descuento:"ACTUAL",
      
      // datos de uso antiguo hardcodeado a espera de cambion 27-2-2025
      idnm: "null",
      numeroidnm: 0,

      idfc: "null",
      numeroidfc: 0,

      fid: "null",
      fnumeroid: 0,

      id_comple: "null",
      numeroid_comple: 0,
    });
  }

  valida_aceptaSolUrgBoolean: boolean = false;
  solUrgcubreSaldoValidoBolean: boolean = false;
  solUrgVtaMaxValidoBolean: boolean = false;
    
  async submitData() {
    
  }






























  
  modalCatalogoIDSolUrgente() {
    this.dialog.open(CatalogoSolicitudUrgenteComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalProformas() {
    this.dialog.open(CatalogoProformasComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });

  }

  modalExcelToExcel() {
    //PARA EL EXCEL TO EXCEL SE LE PASA EL ORIGEN DE LA VENTANA PARA QUE EL SERVICIO SEPA A QUE VENTANA DEVOLVER 
    // LA DATA XDXD
    this.dialog.open(ExceltoexcelComponent, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana_origen: 'sol_urgente'
      }
    });
  }

  modalMatrizClasica(): void {
    if (this.codtarifa === undefined || this.codtarifa === null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA PRECIO, SELECCIONE PRECIO ANTES' });
      this.spinner.hide();
      return;
    }

    if (this.id_sol_urgente === undefined || this.id_sol_urgente === null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ID, SELECCIONE ID ANTES' });
      this.spinner.hide();
      return;
    }

    if (this.numero_id_sol_urgente === undefined || this.numero_id_sol_urgente === null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA NUEMERO ID, VERIFIQUE CON SISTEMAS' });
      this.spinner.hide();
      return;
    }

    // Realizamos todas las validaciones
    this.dialog.open(MatrizItemsClasicaComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        descuento: "0",
        codcliente: "0",
        codcliente_real: "0",
        codalmacen: this.agencia_logueado,
        desc_linea_seg_solicitud: "false",
        codmoneda: "BS",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: [],
        descuento_nivel: 0,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        tipo_ventana: "inventario",
        id_proforma: this.id_sol_urgente,
        num_id_proforma: this.numero_id_sol_urgente,
      }
    });
  }

  //modal amarrillo donde salen los mensajes largos de las OBS de las validaciones
  modalDetalleObservacionesAmarrillo(obs: string, obsDetalle: string): Promise<void> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(ModalDetalleObserValidacionComponent, {
        width: '700px',
        height: 'auto',
        disableClose: true,
        data: {
          obs_titulo: obs,
          obs_contenido: obsDetalle,
        },
      });

      // Se ejecuta cuando el modal se cierra
      dialogRef.afterClosed().subscribe(() => {
        resolve(); // Resolvemos la promesa
      });
    });
  }

  modalCatalogoProductos(): void {
    this.dialog.open(ModalItemsComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        tarifa: 1,
        descuento: 0,
        codcliente: 0,
        codalmacen: this.agencia_logueado,
        desc_linea_seg_solicitud: "",
        codmoneda: "BS",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        descuento_nivel: "ACTUAL",
        tipo_ventana: "inventario",
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
  
  modalAlmacen(almacen): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { almacen: "almacen" }
    });

    this.almacen_seleccionado = almacen;
    console.log("🚀 ~ NotamovimientoComponent ~ modalAlmacen ~ this.almacen_seleccionado:", this.almacen_seleccionado)
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: false }
    });
  }

  modalCatalogoMoneda(): void {
    this.dialog.open(MonedaCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_almacen: cod_almacen,
        cod_item: this.item_obj_seleccionado_codigo,
        posicion_fija: posicion_fija,
        id_proforma: this.id_sol_urgente,
        numero_id: this.numero_id_sol_urgente,
      },
    });
  }

  //modal amarrillo donde salen los mensajes largos de las OBS de las validaciones
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
}
