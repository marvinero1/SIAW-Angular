import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { ApiService } from '@services/api.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { LogService } from '@services/log-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { SaldoItemMatrizService } from '@components/mantenimiento/ventas/matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ItemDetalle } from '@services/modelos/objetos';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { MatTableDataSource } from '@angular/material/table';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { CatalogonotasmovimientosComponent } from '../catalogonotasmovimientos/catalogonotasmovimientos.component';
import { CatalogoNotasMovimientoService } from '../catalogonotasmovimientos/servicio-catalogo-notas-movimiento/catalogo-notas-movimiento.service';
import { CatalogoMovimientoMercaderiaComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/catalogo-movimiento-mercaderia/catalogo-movimiento-mercaderia.component';

@Component({
  selector: 'app-notamovimiento',
  templateUrl: './notamovimiento.component.html',
  styleUrls: ['./notamovimiento.component.scss']
})

export class NotamovimientoComponent implements OnInit {

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "inputCatalogoIdTipo":
          this.modalTipoID();
          break;
        case "inputCatalogoVendedor":
          this.modalVendedor();
          break;

        // case "":
        //   this.modalCatalogoProductos();
        //   break;
      }
    }
  };

  //Formulario
  id:any;
  numeroid:any;
  codvendedor:any;


  // fin formulario

  FormularioData: FormGroup;
  dataform: any = '';
  fecha_actual: any;
  hora_actual: any;

  private unsubscribe$ = new Subject<void>();

  //detalleItem
  public array_items_carrito_y_f4_catalogo:any=[];
  selectedProducts: ItemDetalle[] = [];
  item: any;
  item_obj_seleccionado:any;

  displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
    'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
    'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];


  public validacion_post_negativos: any = [];
  
  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();

  
  item_seleccionados_catalogo_matriz_codigo:any;
  total:any;

  //Saldos
  almacenes_saldos:any=[];

  almacn_parame_usuario:any;
  almacn_parame_usuario_almacen:any;
  cod_precio_venta_modal_codigo:any;
  cod_descuento_modal:any;
  public saldoItem: number;

  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  userConn:any;
  usuarioLogueado:any;
  agencia_logueado:any;
  BD_storage:any;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
      private servicioCliente: ServicioclienteService, private almacenservice: ServicioalmacenService, private cdr: ChangeDetectorRef,
      private serviciovendedor: VendedorService, private datePipe: DatePipe, private _formBuilder: FormBuilder, private saldoItemServices: SaldoItemMatrizService,
      private messageService: MessageService, private spinner: NgxSpinnerService, private log_module: LogService, 
      private _snackBar: MatSnackBar,  public nombre_ventana_service: NombreVentanaService, private router: Router, 
      private servicioNotasMovimientoCatalogo:CatalogoNotasMovimientoService) { 

      this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
      this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
      this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  


  }

  ngOnInit() {
    this.getParametrosIniciales();
    this.getHoraFechaServidorBckEnd();
    this.getAlmacenParamUsuario();
    this.getAlmacenesSaldos();

    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data_carrito => {
      // console.log("Recibiendo Item de Carrito Compra: ", data_carrito);
      // console.log("ARRAY COMPLETO DE MATRIZ Y F4: ", this.array_items_carrito_y_f4_catalogo);

      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      } else {
        // this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      }
      this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element)=>({
        ...element,
        codaduana: ""
      }));

      this.codigoAduanaItems(this.array_items_carrito_y_f4_catalogo);
      this.ponerDui(this.array_items_carrito_y_f4_catalogo);
      this.getValidaCantDecimal(this.array_items_carrito_y_f4_catalogo);
    });
    //

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


    //Vendedor
    this.serviciovendedor.disparadorDeVendedores.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Vendedor: ", data);
      this.codvendedor = data.vendedor.codigo;
      //si se cambia de vendedor, los totales tambien se cambian
      this.total = 0.00;
    });
    //finVendedor
    
    // Catalogo Notas de Movimiento
    this.servicioNotasMovimientoCatalogo.disparadorDeCatalogoNotasMovimiento.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
       console.log("Recibiendo ID Catalogo Notas Movimiento: ", data);
       this.id = data.id_nota_movimiento.codigo;
       this.numeroid = data.id_nota_movimiento.nroactual;
    });
    //
  }

  codalmacen:any;
  getParametrosIniciales(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getParametrosInicialesNM/";
    return this.api.getAll('/inventario/transac/docinmovimiento/getParametrosInicialesNM/' + this.userConn+"/"+this.usuarioLogueado+"/"+this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ .getParametrosIniciales ~ getParametrosIniciales:", datav);

          this.id = datav.id;
          this.numeroid = datav.numeroid;
          this.codvendedor = datav.codvendedor;
          this.codalmacen = datav.codalmacen;

          // codalmacendescripcion: "ALMACEN CENTRAL",
          // chkdesglozar_cjtos: false,
          // cargar_proforma: false,
          // cvenumeracion1: false,
          // obtener_cantidades_aprobadas_de_proformas: false,
          // es_ag_local: false,
          // es_tienda: false,
          // ver_ch_es_para_invntario: false
        },


        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getValidaCantDecimal(items){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getValidaCantDecimal/";
    return this.api.create('/inventario/transac/docinmovimiento/getValidaCantDecimal/' + this.userConn, items)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ getValidaCantDecimal ~ datav:", datav)
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

  getAlmacenParamUsuario() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
    return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          // console.log('data', this.almacn_parame_usuario);

          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          this.cod_descuento_modal = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.almacn_parame_usuario_almacen;
    let array_send={
    agencia:agencia_concat,
    codalmacen: this.almacn_parame_usuario_almacen,
    coditem: item,
    codempresa: this.BD_storage,
    usuario: this.usuarioLogueado,
    
    idProforma: "0",
    nroIdProforma: 0
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.create('/venta/transac/veproforma/getsaldoDetalleSP/' + this.userConn, array_send)
      .subscribe({
        next: (datav) => {
        // console.log('data', datav);
        this.saldoItem = datav.totalSaldo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {}
      })
  }

  validarSaldos(){
    let array = {
      codempresa: this.BD_storage,
      usuario: this.usuarioLogueado,
      codalmorigen: 0,
      codalmdestino: 0,
      codconcepto: 0,
      tabladetalle: this.array_items_carrito_y_f4_catalogo
    };

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/copiarAduana/";
    return this.api.create('/inventario/transac/docinmovimiento/validarSaldos/' + this.userConn, array)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ validarSaldos:", datav)
          if(datav.cumple){
            this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;
          }
        
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  codigoAduanaItems(items){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/copiarAduana/";
    return this.api.create('/inventario/transac/docinmovimiento/copiarAduana/' + this.userConn, items)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ codigoAduanaItems ~ datav:", datav)
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  totabilizar(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/copiarAduana/";
    return this.api.create('/inventario/transac/docinmovimiento/Totalizar/' + this.userConn, {tabladetalle:this.array_items_carrito_y_f4_catalogo})
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ codigoAduanaItems ~ datav:", datav)
        this.total = datav.total;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  ponerDui(items){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/ponerDui/";
    return this.api.create('/inventario/transac/docinmovimiento/ponerDui/' + this.userConn + "/" + this.agencia_logueado, items)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ ponerDui ~ datav:", datav)
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  itemDataAll(codigo) {
    this.item_seleccionados_catalogo_matriz_codigo = codigo;
    // this.getSaldoEmpaquePesoAlmacenLocal(codigo);
    // this.getAlmacenesSaldos();
    this.getSaldoItem(codigo);

    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";

    this.total = 0.00;
  }

  onRowSelect(event: any) {
    this.item = event.data.coditem;
    this.item_obj_seleccionado = event.data;

    console.log('Row Selected:', event.data);
    this.updateSelectedProducts();
  }

  onRowSelectForDelete() {
    // console.log('Array de Items para eliminar: ', this.selectedProducts);

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

  eliminarItemTabla(orden, coditem) {
    // Filtrar el array para eliminar el elemento con el número de orden dado y el código de ítem
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return item.orden !== orden || item.coditem !== coditem;
    });

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

   //this.totabilizar();
  }

  onEditComplete(event: any) {
    const updatedElement = event.data; // La fila editada
    const updatedField = event.field; // El campo editado (en este caso, "empaque")
    const newValue = event.newValue;  // El nuevo valor ingresado

    console.log("🚀 ~ onEditComplete ~ Item a editar empaque:", this.item_obj_seleccionado)
    console.log("🚀 ~ onEditComplete ~ updatedField:", event, updatedField, updatedElement, newValue);
  
    if (updatedField === 'empaque') {
      // this.empaqueChangeMatrix(this.item_obj_seleccionado, newValue);
    }

    if(updatedField === 'cantidad_pedida'){
      // this.copiarValorCantidadPedidaACantidad(this.item_obj_seleccionado, newValue);
    }

    if(updatedField === 'cantidad'){
      // this.cantidadChangeMatrix(this.item_obj_seleccionado, newValue)
    }
  }

  updateSelectedProducts() {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);
    }
  }

  calcularTotalCantidadXPU(cantidad_pedida: number, cantidad: number, precioneto: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && precioneto !== undefined && cantidad !== undefined) {
      return this.formatNumberTotalSub(cantidad * precioneto);
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  formatNumberTotalSubTOTALES(numberString: number | string): string {
    if (numberString === null || numberString === undefined || numberString === '') {
      return '0.00'; // Valor predeterminado
    }
    
    // Intentar convertir a número, considerando posibles entradas como cadenas
    const parsedNumber = parseFloat(numberString.toString().replace(',', '.'));
    
    if (isNaN(parsedNumber)){
      return '0.00'; // Manejar entradas no válidas
    }
  
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parsedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(formattedNumber);
  }




  // NEGATIVOS
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];

  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;

  // validarProformaSoloNegativos() {
  //   console.clear();
  //   // 00060 - VALIDAR SALDOS NEGATIVOS
  //   // VACIO - TODOS LOS CONTROLES
  //   this.valor_formulario = [this.FormularioData.value];
  //   console.log("Valor Formulario Original: ", this.valor_formulario);

  //   let tipo_complemento
  //   console.log(this.complementopf);
  //   switch (this.complementopf) {
  //     case 3:
  //       tipo_complemento = "";
  //       break;
  //     case 0:
  //       tipo_complemento = "complemento_mayorista_dimediado";
  //       break;
  //     case 1:
  //       tipo_complemento = "complemento_para_descto_monto_min_desextra";
  //       break;
  //   }

  //   this.valor_formulario.map((element: any) => {
  //     return this.valor_formulario_negativos = {
  //       coddocumento: 0,
  //       id: element.id.toString() || '',
  //       numeroid: element.numeroid?.toString() || '',
  //       codcliente: element.codcliente?.toString() || '',
  //       nombcliente: element.nombcliente?.toString() || '',
  //       nitfactura: element.nit?.toString() || '',
  //       tipo_doc_id: element.tipo_docid?.toString() || '',
  //       codcliente_real: element.codcliente_real?.toString() || '',
  //       nomcliente_real: element.nomcliente_real?.toString() || '',
  //       codmoneda: element.codmoneda?.toString() || '',
  //       subtotaldoc: element.subtotal,
  //       totaldoc: element.total,
  //       tipo_vta: element.tipopago?.toString() || '',
  //       codalmacen: element.codalmacen?.toString() || '',
  //       codvendedor: element.codvendedor?.toString() || '',
  //       preciovta: element.preciovta?.toString() || '',
  //       preparacion: element.preparacion,
  //       contra_entrega: element.contra_entrega?.toString() === true ? "SI" : "NO",
  //       vta_cliente_en_oficina: element.venta_cliente_oficina,
  //       estado_contra_entrega: element.estado_contra_entrega === undefined ? "SI" : "NO",
  //       desclinea_segun_solicitud: element.desclinea_segun_solicitud,
  //       pago_con_anticipo: element.pago_contado_anticipado === null ? false : element.pago_contado_anticipado,
  //       niveles_descuento: element.niveles_descuento,
  //       transporte: element.transporte,
  //       nombre_transporte: element.nombre_transporte,
  //       fletepor: element.fletepor === undefined ? "" : element.fletepor,
  //       tipoentrega: element.tipoentrega === undefined ? "": element.tipoentrega,
  //       direccion: element.direccion,
  //       ubicacion: element.ubicacion,
  //       latitud: element.latitud_entrega,
  //       longitud: element.longitud_entrega,
  //       nroitems: this.array_items_carrito_y_f4_catalogo.length,
  //       fechadoc: element.fecha,
  //       idanticipo: element.idanticipo,
  //       noridanticipo: element.numeroidanticipo?.toString() || '',
  //       monto_anticipo: 0,
  //       nrofactura: "0",
  //       nroticket: "",
  //       tipo_caja: "",
  //       tipo_cliente: this.tipo_cliente,
  //       nroautorizacion: "",
  //       nrocaja: "",
  //       idsol_nivel: "",
  //       nroidsol_nivel: "0",
  //       version_codcontrol: "",
  //       estado_doc_vta: "NUEVO",
  //       codtarifadefecto: this.codTarifa_get?.toString(),
  //       desctoespecial: this.cod_descuento_modal?.toString(),

  //       cliente_habilitado: this.cliente_habilitado_get === true ? "HABILITADO" : "DES-HABILITADO",
  //       totdesctos_extras: this.des_extra,
  //       totrecargos: 0,
  //       idpf_complemento: this.idpf_complemento_view,
  //       nroidpf_complemento: this.input_complemento_view?.toString(),
  //       tipo_complementopf: this.tipo_complementopf_input,

  //       idFC_complementaria: "",
  //       nroidFC_complementaria: "",
  //       fechalimite_dosificacion: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
  //       idpf_solurgente: "0",
  //       noridpf_solurgente: "0",
  //     }
  //   });

  //   this.array_de_descuentos_ya_agregados = this.array_de_descuentos_ya_agregados?.map((element)=>({
  //     ...element,
  //     descripcion: element.descrip,
  //   }))

  //   // boolean que verifica que el formulario este con sus data llenada
  //   this.submitted = true;
  //   if (this.FormularioData.valid) {
  //     this.spinner.show();
  //     console.log("DATOS VALIDADOS");
  //     console.log("Valor Formulario Mapeado: ", this.valor_formulario_negativos);

  //     let proforma_validar = {
  //       datosDocVta: this.valor_formulario_negativos,
  //       detalleAnticipos: [],
  //       detalleDescuentos: this.array_de_descuentos_ya_agregados === undefined ? []:this.array_de_descuentos_ya_agregados,
  //       //detalleEtiqueta: [this.etiqueta_get_modal_etiqueta],
  //       detalleEtiqueta: this.etiqueta_get_modal_etiqueta,
  //       detalleItemsProf: this.array_items_carrito_y_f4_catalogo,
  //       detalleRecargos: [],
  //     }

  //     console.log(proforma_validar);
  //     const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/00060/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
  //     const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

  //     this.api.create(url, proforma_validar).subscribe({
  //       next: (datav) => {
  //         this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'VALIDACION CORRECTA NEGATIVOS ✅' })
  //         if (datav.jsonResult[0].dtnegativos) {
  //           this.validacion_post_negativos = datav.jsonResult[0].dtnegativos;
  //         }

  //         this.abrirTabPorLabel("Negativos");
  //         console.log(this.validacion_post_negativos);

  //         this.toggleTodosNegativos = true;
  //         this.toggleNegativos = false;
  //         this.togglePositivos = false;

  //         this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
  //         this.array_items_carrito_y_f4_catalogo = datav.itemDataMatriz;
  //         setTimeout(() => {
  //           this.spinner.hide();
  //         }, 500);
  //       },
  //       error: (err) => {
  //         console.log(err, errorMessage);
  //         setTimeout(() => {
  //           this.spinner.hide();
  //         }, 500);
  //       },
  //       complete: () => {
  //         setTimeout(() => {
  //           this.spinner.hide();
  //         }, 500);
  //       }
  //     });
  //   } else {
  //     this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'VALIDACION ACTIVA' });
  //     console.log("HAY QUE VALIDAR DATOS");
  //   }
  // }

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

    // this.validacion_post_negativos_filtrados_solo_positivos = this.validacion_post_negativos.filter((element) => {
    //   return element.obs === "Positivo";
    // });

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos_filtrados_solo_positivos);
  }
  //FIN NEGATIVOS




































































  CatalogoMovimientoMercaderiaComponent



  modalTipoID(): void {
    this.dialog.open(CatalogonotasmovimientosComponent, {
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
      data: {
        ventana: "ventana"
      }
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
        posicion_fija: posicion_fija,
        id_proforma: "0",
        numero_id: 0
      },
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

  modalCatalogoConceptos(){
    this.dialog.open(CatalogoMovimientoMercaderiaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
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
        desc_linea_seg_solicitud:"false",
        codmoneda: "BS",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: [ ],
        descuento_nivel: 0,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        
        // id_proforma: this.id_tipo_view_get_codigo,
        // num_id_proforma:this.id_proforma_numero_id,
      }
    });
  }
  
  alMenu(){
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
