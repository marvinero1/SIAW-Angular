import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
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

  dataform: any = '';
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
  cod_precio: any;
  moneda_get: any;
  transporte: any;
  cod_cliente: any;
  nombre_cliente: any;

  
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

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService, private _formBuilder: FormBuilder,
    private almacenservice: ServicioalmacenService, private excelService: ExceltoexcelService, private datePipe: DatePipe, private router: Router,
    private messageService: MessageService, private spinner: NgxSpinnerService, private servicioCliente: ServicioclienteService,
    public servicioCatalogoSolicitudesUrgentes: CatalogoSolUrgenteService, private serviciovendedor: VendedorService,
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
      this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
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

      this.calcularDetalleItems(this.array_items_carrito_y_f4_catalogo);
    });
    //

    //CATALOGO F4 ITEMS
    //ItemElejidoCatalogoF4Procesados
    this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Item Procesados De Catalogo F4: ", [data]);
      this.item_seleccionados_catalogo_matriz = [data];
      console.log("🚀 ~ ProformaComponent ~ this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe ~ data:", [data]);

      if (this.item_seleccionados_catalogo_matriz.length === 0) {
        this.array_items_carrito_y_f4_catalogo.push(...[data]);
      } else {
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat([data]);
      }

      this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
        ...element,
        codaduana: "0"
      }));
    });
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
      this.nombre_cliente = data.cliente.nombre
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
      this.moneda_get = data.moneda.codigo;
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
      this.cod_precio = data.precio_venta.codigo;

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
    this.cod_precio = "";
    this.transporte = "";
    this.nombre_cliente = "";


    this.array_items_carrito_y_f4_catalogo = [];
    this.item_obj_seleccionado = '';
    this.item_obj_seleccionado_codigo = '';
  }

  getParametrosIniciales() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/docinsolurgente/getParamsIniSolUrg/"
    return this.api.getAll('/docinsolurgente/getParamsIniSolUrg/' + this.userConn + "/" + this.usuarioLogueado + "/"+ this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ PedidoComponent ~ getParametrosIniciales:", datav);
          this.almacen_origen = datav.codalmacen;
          //this.codalmorigenTextDescipcion = datav.codalmacendescripcion;
          this.moneda_get = datav.codmoneda_total
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
        complete: () => {
          //this.getMonedaTipoCambio(this.moneda_get_catalogo);
        }
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
      this.nombre_cliente = encontrado_element.nombre
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

  createForm(): FormGroup {
    return this._formBuilder.group({

    });
  }

  calcularDetalleItems(array) { 
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinsolurgente/calcularDetalle/";
    return this.api.create('/inventario/transac/docinsolurgente/calcularDetalle/' + this.userConn + "/" + this.agencia_logueado + "/" + this.BD_storage + "/" + this.usuarioLogueado + "/" + this.cod_precio, array)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("calcularDetalleItems: ", datav);


        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  recalcularCarritoCompras() { 
    if (this.cod_precio === undefined || this.cod_precio === null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA PRECIO, SELECCIONE PRECIO ANTES' });
      this.spinner.hide();
      return;
    }

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY ITEMS EN EL DETALLE PARA RECALCULAR !' });
      this.spinner.hide();
      return;
    }

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/docinsolurgente/recalcularDetalle/";
    return this.api.create('/docinsolurgente/recalcularDetalle/' + this.userConn + "/" + this.BD_storage + "/" + this.cod_precio + "/" +
      this.agencia_logueado + "/" + this.usuarioLogueado, this.array_items_carrito_y_f4_catalogo)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {

          console.log("recalcularCarritoCompras: ", datav);

        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
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


























  
  modalCatalogoIDSolUrgente() {
    this.dialog.open(CatalogoSolicitudUrgenteComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalProformas() {


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
    if (this.cod_precio === undefined || this.cod_precio === null) {
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
}
