import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { SaldoItemMatrizService } from '@components/mantenimiento/ventas/matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { ExceltoexcelComponent } from '@components/uso-general/exceltoexcel/exceltoexcel.component';
import { ExceltoexcelService } from '@components/uso-general/exceltoexcel/servicio-excel-to-excel/exceltoexcel.service';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ItemDetalle } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {
  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}` + this.item_obj_seleccionado.coditem);

      switch (elementTagName) {
        case "":
          this.getAlmacenesSaldos(this.item_obj_seleccionado.coditem);
          break;
      }
    }
  };

  public nombre_ventana: string = "docinpedido.vb";
  public ventana: string = "Pedido";
  public detalle = "Pedido";
  public tipo = "transaccion-docinpedido-POST";

  id: any;
  numeroid: any;
  codalmorigenText: any;
  codalmorigenTextDescipcion: any;
  codalmdestidoText: any;
  observaciones: any;

  //Saldos
  almacenes_saldos: any = [];
  almacn_parame_usuario: any;
  almacn_parame_usuario_almacen: any;
  cod_precio_venta_modal_codigo: any;
  cod_descuento_modal: any;

  item_seleccionados_catalogo_matriz_codigo: any;
  total: any;

  public array_items_carrito_y_f4_catalogo: any = [];
  public item_seleccionados_catalogo_matriz: any = [];
  private numberFormatter_2decimales: Intl.NumberFormat;

  public array_almacenes: any = [];
  private unsubscribe$ = new Subject<void>();

  item: any;
  item_obj_seleccionado: any;
  selectedProducts: ItemDetalle[] = [];

  FormularioData: FormGroup;
  dataform: any = '';
  fecha_actual: any;
  hora_actual: any;
  almacen_seleccionado: any;

  public saldoItem: number;
  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private almacenservice: ServicioalmacenService, private cdr: ChangeDetectorRef, private excelService: ExceltoexcelService,
    private datePipe: DatePipe, private _formBuilder: FormBuilder, private saldoItemServices: SaldoItemMatrizService,
    private messageService: MessageService, private spinner: NgxSpinnerService, private log_module: LogService,
    public nombre_ventana_service: NombreVentanaService, private router: Router) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    this.getParametrosIniciales();
    this.getHoraFechaServidorBckEnd();
    this.getAlmacen();
    this.mandarNombre();

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
        ...element,
        codaduana: "0"
      }));

      this.totabilizar();
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

      this.totabilizar();
    });
    //
  }

  getParametrosIniciales() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/inventario/transac/docinpedido/getParametrosInicialesPedido/"
    return this.api.getAll('/inventario/transac/docinpedido/getParametrosInicialesPedido/' + this.userConn + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ PedidoComponent ~ getParametrosIniciales:", datav);
          this.codalmorigenText = datav.codalmacen;
          this.codalmorigenTextDescipcion = datav.codalmacendescripcion;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  validarGrabar() {

  }

  limpiar() {

  }

  totabilizar() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/copiarAduana/";
    return this.api.create('/inventario/transac/docinmovimiento/Totalizar/' + this.userConn + "/" + true, { tabladetalle: this.array_items_carrito_y_f4_catalogo })
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ codigoAduanaItems ~ datav:", datav)
          this.total = datav.total;
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
          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          // this.hora_fecha_server = datav.horaServidor;
          // console.log(this.fecha_actual, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.getMonedaTipoCambio(this.moneda_get_catalogo);
        }
      })
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

  //Importar to ZIP
  async onFileChangeZIP(event: any) {
    const file = event.target.files[0];
    console.log(file);

    if (file.type === 'application/x-zip-compressed' || file.type === 'application/zip') {
      // Crear un FormData y agregar el archivo
      const formData = new FormData();
      formData.append('file', file, file.name);

      this.api.cargarArchivo('/inventario/transac/docinmovimiento/importNMinJson/', formData)
        .subscribe({
          next: (datav) => {
            // console.log("Data ZIP:", datav);
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
    const array_carrito: any = [];
    this.spinner.show();
    console.log(zip_json);

    // this.id = zip_json.cabeceraList[0]?.id;
    // this.numeroid = zip_json.cabeceraList[0]?.numeroid;
    // this.id_concepto = zip_json.cabeceraList[0]?.codconcepto;
    // this.factor = zip_json.cabeceraList[0]?.factor;
    // //this.codvendedor = zip_json.cabeceraList[0]?.codvendedor;
    // this.observaciones = zip_json.cabeceraList[0]?.obs;
    // this.id_origen = zip_json.cabeceraList[0]?.fid;
    // this.nroid_origen = zip_json.cabeceraList[0]?.fnumeroid;
    // this.cod_cliente = zip_json.cabeceraList[0]?.codcliente;
    // this.id_proforma_catalogo = zip_json.cabeceraList[0]?.idproforma;
    // this.numero_id_catalogo_proforma = zip_json.cabeceraList[0]?.numeroidproforma
    // this.id_proforma_sol_urgente = zip_json.cabeceraList[0]?.idproforma_sol;
    // this.numero_id_proforma_sol_urgente = zip_json.cabeceraList[0]?.numeroidproforma_sol;
    //this.anular = zip_json.cabeceraList[0]?.anulada;
    //this.contabilizada = zip_json.cabeceraList[0]?.contabilizada;

    // documento = zip_json.cabeceraList[0]?.documento
    // if (documento === "NOTA") {
    //   this.validarPorConcepto(zip_json.cabeceraList[0]?.codconcepto === undefined ? "0" : zip_json.cabeceraList[0]?.codconcepto);
    //   const encontrado_objeto = this.array_concepto.find(objeto => objeto.codigo.toString() === zip_json.cabeceraList[0]?.codconcepto.toString());
    //   console.log("🚀 ~ NotamovimientoComponent ~ encontrado_objeto:", encontrado_objeto)
    //   this.id_concepto_descripcion = encontrado_objeto.descripcion;

    //   this.codvendedor = zip_json.cabeceraList[0]?.codvendedor;
    //   this.id_concepto = zip_json.cabeceraList[0]?.codconcepto;
    //   this.id_origen = zip_json.cabeceraList[0]?.id;
    //   this.nroid_origen = zip_json.cabeceraList[0]?.numeroid;

    //   this.codalmacen = zip_json.cabeceraList[0]?.codalmacen;
    //   this.codalmorigenText = zip_json.cabeceraList[0]?.codalmorigen;
    //   // this.codalmdestinoText = zip_json.cabeceraList[0]?.codalmdestino;

    //   this.getDescripcMedidaItem(zip_json.detalleList.map((element) => ({
    //     ...element,
    //     codaduana: "0"
    //   })));

    //   this.observaciones = "NOTA: " + zip_json.cabeceraList[0]?.id + " " + zip_json.cabeceraList[0]?.numeroid + " DE: " + zip_json.cabeceraList[0]?.codalmacen + " " + zip_json.cabeceraList[0]?.obs;
    //   if (this.observaciones.length > 60) {
    //     this.observaciones = this.observaciones.slice(0, 59);
    //   }
    // }

    // if (documento === "SOLURGENTE") {
    //   this.validarPorConcepto(zip_json.cabeceraList[0]?.codconcepto === undefined ? "0" : zip_json.cabeceraList[0]?.codconcepto);
    //   const encontrado_objeto = this.array_concepto.find(objeto => objeto.codigo.toString() === zip_json.cabeceraList[0]?.codconcepto.toString());
    //   console.log("🚀 ~ NotamovimientoComponent ~ encontrado_objeto:", encontrado_objeto)
    //   this.id_concepto_descripcion = encontrado_objeto.descripcion;

    //   this.getDescripcMedidaItem(zip_json.detalleList.map((element) => ({
    //     ...element,
    //     codaduana: "0"
    //   })));

    //   this.observaciones = zip_json.cabeceraList[0]?.obs;
    //   if (this.observaciones.length > 60) {
    //     this.observaciones = this.observaciones.slice(0, 59);
    //   }
    // }

    // if (documento === "PEDIDO") {
    //   this.codalmorigenText = zip_json.cabeceraList[0]?.codalmacen;
    //   console.log("🚀 ~ NotamovimientoComponent ~ this.codalmorigenText:", this.codalmorigenText)
    //   this.getDescripcMedidaItem(zip_json.detalleList.map((element) => ({
    //     ...element,
    //     codaduana: "0"
    //   })));
    //   this.codalmdestinoText = zip_json.cabeceraList[0]?.codalmdestino;
    //   this.observaciones = "PEDIDO: " + zip_json.cabeceraList[0]?.id + " " + zip_json.cabeceraList[0]?.numeroid + " DE: " + zip_json.cabeceraList[0]?.codalmacen + " " + zip_json.cabeceraList[0]?.obs;
    //   if (this.observaciones.length > 60) {
    //     this.observaciones = this.observaciones.slice(0, 59);
    //   }
    // }

    // if (documento === "RECEPCION") {
    //   this.validarPorConcepto(zip_json.cabeceraList[0]?.codconcepto === undefined ? "0" : zip_json.cabeceraList[0]?.codconcepto);
    //   const encontrado_objeto = this.array_concepto.find(objeto => objeto.codigo.toString() === zip_json.cabeceraList[0]?.codconcepto.toString());
    //   console.log("🚀 ~ NotamovimientoComponent ~ encontrado_objeto:", encontrado_objeto)
    //   this.id_concepto_descripcion = encontrado_objeto.descripcion;
    //   this.getDescripcMedidaItem(zip_json.detalleList.map((element) => ({
    //     ...element,
    //     codaduana: "0"
    //   })));

    //   this.codvendedor = zip_json.cabeceraList[0]?.codvendedor;
    //   this.observaciones = zip_json.cabeceraList[0]?.obs;
    //   if (this.observaciones.length > 60) {
    //     this.observaciones = this.observaciones.slice(0, 59)
    //   }
    // }

    // if (this.array_items_carrito_y_f4_catalogo.length > 0) {
    //   console.log("🚀 ~ ModificarNotaMovimientoComponent ~ this.array_items_carrito_y_f4_catalogo.length:", this.array_items_carrito_y_f4_catalogo.length)
    //   this.getDescripcMedidaItem(zip_json.detalleList);
    //   this.array_items_carrito_y_f4_catalogo = array_carrito.concat(
    //     zip_json.detalleList.map((element) => ({
    //       ...element,
    //       cantidad_revisada: element.cantidad,
    //       cantidad: 0,
    //       nuevo: "si"
    //     }))
    //   );
    // } else {
    //   this.getDescripcMedidaItem(zip_json.detalleList);
    //   this.array_items_carrito_y_f4_catalogo = zip_json.detalleList;
    // }
  }
  //FIN Importar ZIP


  onEditComplete(event: any) {
    const updatedElement = event.data; // La fila editada
    const updatedField = event.field; // El campo editado (en este caso, "empaque")
    const newValue = event.newValue;  // El nuevo valor ingresado

    console.log("🚀 ~ onEditComplete ~ Item a editar empaque:", this.item_obj_seleccionado)
    console.log("🚀 ~ onEditComplete ~ updatedField:", event, updatedField, updatedElement, newValue);

    if (updatedField === 'empaque') {
      // this.empaqueChangeMatrix(this.item_obj_seleccionado, newValue);
    }

    if (updatedField === 'cantidad_pedida') {
      // this.copiarValorCantidadPedidaACantidad(this.item_obj_seleccionado, newValue);
    }

    if (updatedField === 'cantidad') {
      // this.cantidadChangeMatrix(this.item_obj_seleccionado, newValue)
    }
  }

  onRowSelect(event: any) {
    console.log('Row Selected:', event);

    this.item = event.coditem;
    this.item_obj_seleccionado = event.data.coditem;

    this.updateSelectedProducts();

    this.getAlmacenesSaldos(event.data.coditem);
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
    // console.log('Row Unselected:', event.data);
    this.updateSelectedProducts();
  }


  updateSelectedProducts() {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);
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

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

    this.totabilizar();
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  getAlmacenesSaldos(codigo) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinpedido/getSaldoStock/";
    return this.api.getAll('/inventario/transac/docinpedido/getSaldoStock/' + this.userConn + "/" + codigo +
      "/" + this.usuarioLogueado + "/" + this.agencia_logueado + "/" + this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.almacenes_saldos = [datav];
          console.log("getAlmacenesSaldos: ", datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }


















































  modalExcelToExcel() {
    //PARA EL EXCEL TO EXCEL SE LE PASA EL ORIGEN DE LA VENTANA PARA QUE EL SERVICIO SEPA A QUE VENTANA DEVOLVER 
    // LA DATA XDXD
    this.dialog.open(ExceltoexcelComponent, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana_origen: 'nota_movimiento'
      }
    });
  }

  modalTipoID(): void {
    // this.dialog.open(CatalogonotasmovimientosComponent, {
    //   width: 'auto',
    //   height: 'auto',
    //   disableClose: true,
    // });
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

  modalMatrizClasica(): void {
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
        tipo_ventana: "inventario"
        // id_proforma: this.id_tipo_view_get_codigo,
        // num_id_proforma:this.id_proforma_numero_id,
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

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  alMenu() {
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
}
