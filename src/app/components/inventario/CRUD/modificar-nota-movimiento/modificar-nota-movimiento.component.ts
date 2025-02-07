import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { MovimientomercaderiaService } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/serviciomovimientomercaderia/movimientomercaderia.service';
import { ServicePersonaService } from '@components/mantenimiento/persona-catalogo/service-persona/service-persona.service';
import { SaldoItemMatrizService } from '@components/mantenimiento/ventas/matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ServicioCatalogoProformasService } from '@components/mantenimiento/ventas/transacciones/proforma/sevicio-catalogo-proformas/servicio-catalogo-proformas.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ItemDetalle } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CatalogoNotasMovimientoService } from '../servicio-catalogo-notas-movimiento/catalogo-notas-movimiento.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { ModalClienteComponent } from '@components/mantenimiento/ventas/modal-cliente/modal-cliente.component';
import { PersonaCatalogoComponent } from '@components/mantenimiento/persona-catalogo/persona-catalogo.component';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { CatalogoProformasComponent } from '@components/mantenimiento/ventas/transacciones/proforma/catalogo-proformas/catalogo-proformas.component';
import { CatalogonotasmovimientosComponent } from '../catalogonotasmovimientos/catalogonotasmovimientos.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { CatalogoMovimientoMercaderiaComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/catalogo-movimiento-mercaderia/catalogo-movimiento-mercaderia.component';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { NotaMovimientoBuscadorAvanzadoComponent } from '../../../uso-general/nota-movimiento-buscador-avanzado/nota-movimiento-buscador-avanzado.component';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { DialogTarifaImpresionComponent } from '../dialog-tarifa-impresion/dialog-tarifa-impresion.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-modificar-nota-movimiento',
  templateUrl: './modificar-nota-movimiento.component.html',
  styleUrls: ['./modificar-nota-movimiento.component.scss']
})
export class ModificarNotaMovimientoComponent implements OnInit {

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
      }
    }
  };

  @HostListener("document:keydown.enter", []) unloadHandler4(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;

      switch (elementTagName) {
        case "input_search":
          this.permisoParaTransferirNM();
          break;
      }
    }
  };

  catalogo_proforma_seleccionado:any;

  //array
  array_vendedores:any=[];
  array_almacenes:any=[];
  array_proformas:any=[];
  array_concepto:any=[];
  array_persona:any=[];

  public validacion_post_negativos: any = [];
  // fin array

  // parametros Iniciales
  almacen_seleccionado:any;
  cod_almacen:any;
  cargar_proforma:boolean;
  cvenumeracion1:boolean;
  chkdesglozar_cjtos:boolean;

  codalmdestinoReadOnly:boolean;
  codalmorigenReadOnly:boolean;
  fidEnable:boolean;
  fnumeroidEnable:boolean;
  codpersonadesdeReadOnly:boolean;
  codclienteReadOnly:boolean;
  cargar_proformaEnabled:boolean;
  cvenumeracion1Enabled:boolean;
  id_proforma_solReadOnly:boolean;
  numeroidproforma_solReadOnly:boolean;
  esAjuste:boolean;

  codalmdestinoText:any;
  codalmorigenText:any;
  cumple:any;

  factor:any;
  traspaso:boolean;
  es_tienda:boolean;
  es_ag_local:boolean;
  ver_ch_es_para_invntario:boolean;
  obtener_cantidades_aprobadas_de_proformas:boolean;
  //Fin parametros iniciales

  //Formulario
  id:any;
  numeroid:any;
  codvendedor:any;

  id_concepto:any;
  id_concepto_descripcion:any;

  FormularioData: FormGroup;
  dataform: any = '';
  fecha_actual: any;
  hora_actual: any;

  codpersonadesde: any;
  id_proforma_catalogo:any;
  numero_id_catalogo_proforma:any;
  observaciones:any;
  descripcion_id_catalogo_proforma:any;
  codalmacen:any;
  hora_fecha_server:any;
  cod_cliente:any;
  cod_cliente_descripcion:any;
  id_origen:any;
  nroid_origen:any;
  id_proforma_sol_urgente:any;
  numero_id_proforma_sol_urgente:any;


  btnAnularReadOnly:any;
  btnGrabarReadOnly:any;
  btnHabilitarReadOnly:any;
  fecha_origen:any;
  fecha:any;
  anular:any;
  contabilizada:any;
  // fin formulario

  // TAB OBSERVACIONES
  eventosLogs:any=[];
  // FIN TAB OBSERVACIONES

  item_seleccionados_catalogo_matriz: any = [];
  // Validacion Negativos
  validacion_post_negativos_filtrados_solo_negativos: any = [];
  validacion_post_negativos_filtrados_solo_positivos: any = [];

  toggleTodosNegativos: boolean = false;
  toggleNegativos: boolean = false;
  togglePositivos: boolean = false;
  // Fin Validacion Negativos

  private unsubscribe$ = new Subject<void>();

  //detalleItem
  public array_items_carrito_y_f4_catalogo:any=[];
  selectedProducts: ItemDetalle[] = [];
  item: any;
  item_obj_seleccionado:any;
  descripcion_usuario_final:any;

  displayedColumnsNegativos = ['kit', 'nro_partes', 'coditem_cjto', 'coditem_suelto', 'codigo',
    'descitem', 'cantidad', 'cantidad_conjunto', 'cantidad_suelta', 'saldo_sin_descontar_reservas',
    'cantidad_reservada_para_cjtos', 'saldo_descontando_reservas', 'obs'];
  
  dataSource_negativos = new MatTableDataSource();
  dataSourceWithPageSize_negativos = new MatTableDataSource();
  
  item_seleccionados_catalogo_matriz_codigo:any;
  total:any;
  total_revisado:any;
  codigo_ultm_NM:any;

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
  // fin saldos

  //BUSCADOR GENERAL
  array_notas_movimiento:any=[];
  id_ntmv_buscador:any;
  num_id_ntmv_buscador:any;
  valido_en_validar_funcion:boolean;

  private numberFormatter_5decimales: Intl.NumberFormat;
  private numberFormatter_2decimales: Intl.NumberFormat;
  
  userConn:any;
  usuarioLogueado:any;
  agencia_logueado:any;
  BD_storage:any;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private almacenservice: ServicioalmacenService, private cdr: ChangeDetectorRef,
    private serviciovendedor: VendedorService, private datePipe: DatePipe, private saldoItemServices: SaldoItemMatrizService,
    private messageService: MessageService, private spinner: NgxSpinnerService, private log_module: LogService, public movimientoMercaderia: MovimientomercaderiaService,
    public nombre_ventana_service: NombreVentanaService, private router: Router, private servicioPersona: ServicePersonaService,
    public servicioCatalogoProformas: ServicioCatalogoProformasService, private servicioNotasMovimientoCatalogo:CatalogoNotasMovimientoService) { 

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_5decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    });

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    this.getParametrosIniciales();
    this.getHoraFechaServidorBckEnd();
    this.getAlmacenParamUsuario();
    this.getAlmacenesSaldos();
    this.getIdNumeroIdNotasMovimiento();
    
    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data_carrito => {
      console.log("Recibiendo Item de Carrito Compra: ", data_carrito);
      // console.log("ARRAY COMPLETO DE MATRIZ Y F4: ", this.array_items_carrito_y_f4_catalogo);

      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito.map((element)=>({
          ...element,
          nuevo:"si",
          codaduana: "0",
          diferencia: 0,
          cantidad_revisada: element.cantidad
        })));
      } else {
        // this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito.map((element)=>({
          ...element,
          nuevo:"si",
          codaduana: "0",
          diferencia: 0,
          cantidad_revisada: element.cantidad
        })));
      }

      this.totabilizar();
      this.totabilizarRevisado();
    });
    //

    // CATALOGO F4 ITEMS
    // ItemElejidoCatalogoF4Procesados
    this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Item Procesados De Catalogo F4: ", [data]);
      this.item_seleccionados_catalogo_matriz = [data];
      console.log("🚀 ~ ProformaComponent ~ this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe ~ data:", [data]);

      if (this.item_seleccionados_catalogo_matriz.length === 0) {
        this.array_items_carrito_y_f4_catalogo.push(...[data]);
      } else {
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat([data].map((element)=>({
          ...element,
          nuevo:"si",
          codaduana: "0",
          diferencia: 0,
        })));
      }

      this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element)=>({
        ...element,
        codaduana: "0",
        cantidad_revisada: element.cantidad
      }));

      this.totabilizar();
      this.totabilizarRevisado();
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

    // Catalogo Conceptos
    this.movimientoMercaderia.disparadorDeConceptos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID de Concepto: ", data);
      this.id_concepto = data.concepto.codigo;
      this.id_concepto_descripcion = data.concepto.descripcion;

      this.validarPorConcepto(data.concepto.codigo);
    });
    //

    // Catalogo Proformas
    this.servicioCatalogoProformas.disparadorDeIDProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID de Proforma: ", data);
      // this.id_proforma_catalogo = data.proforma.id.toUpperCase();
      // this.descripcion_id_catalogo_proforma = data.proforma.descripcion;

      if(this.catalogo_proforma_seleccionado === "proforma_almacen"){
        this.id_proforma_catalogo = data.proforma.id.toUpperCase();
      }

      if(this.catalogo_proforma_seleccionado === "solicitud_urgente"){
        this.id_proforma_sol_urgente = data.proforma.id.toUpperCase();
      }
    });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Almacen: ", data,  this.almacen_seleccionado);
      if(this.almacen_seleccionado === "Origen"){
        this.codalmorigenText = data.almacen.codigo;
      }

      if(this.almacen_seleccionado === "Destino"){
        this.codalmdestinoText = data.almacen.codigo;
      }

      if(this.almacen_seleccionado === "Almacen"){
        this.cod_almacen = data.almacen.codigo;
      }
    });
    //

    //Persona
    this.servicioPersona.disparadorDePersonas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Persona: ", data);
      this.codpersonadesde = data.persona.codigo;
      this.descripcion_usuario_final= data.persona.descrip;
    });
    //

    //Clientes
    this.servicioCliente.disparadorDeClientes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.cod_cliente = data.cliente.codigo;
      this.cod_cliente_descripcion = data.cliente.nombre;

      //si se cambia de cliente, los totales tambien se cambian
      this.total = 0.00;
    });
    //

    this.getVendedorCatalogo();
    this.getAlmacen();
    this.getProforma();
    this.getAllConceptoCatalogo();
    this.getPersona();
    this.getUltimaNotaMovimientoID();
  }

  getUltimaNotaMovimientoID(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/modif/docmodifinmovimiento/getUltiNMId/";
    return this.api.getAll('/inventario/modif/docmodifinmovimiento/getUltiNMId/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarNotaMovimientoComponent ~ getUltiNMId ~ datav:", datav);

          this.getValidoNotaMovimiento(datav.id, datav.numeroid);

          this.codigo_ultm_NM = datav.codigo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {  }
      })
  }

  getValidoNotaMovimiento(id:string, numeroid:number){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/modif/docmodifinmovimiento/permModifNMAntInventario/";
    return this.api.getAll('/inventario/modif/docmodifinmovimiento/permModifNMAntInventario/' + this.userConn +"/"+ id +"/"+ numeroid)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ ModificarNotaMovimientoComponent ~ getValidoNotaMovimiento:", datav)
          if(datav.valido){
            this.getDataUltimNotaRemision(id, numeroid, datav.valido);
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ NO VALIDO PARA TRANSFERENCIA !' });
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {  }
      })
  }

  getDataUltimNotaRemision(id:string, numeroid:number, permiso:boolean){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/modif/docmodifinmovimiento/obtNMxModif/";
    return this.api.getAll('/inventario/modif/docmodifinmovimiento/obtNMxModif/' + this.userConn +"/"+ id +"/"+ numeroid+"/"+permiso)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarNotaMovimientoComponent ~ getDataUltimNotaRemision:", datav)

          this.btnAnularReadOnly = datav.btnAnularReadOnly;
          this.btnGrabarReadOnly = datav.btnGrabarReadOnly;
          this.btnHabilitarReadOnly = datav.btnHabilitarReadOnly;
          this.codalmdestinoReadOnly = datav.codalmdestinoReadOnly;
          this.codalmorigenReadOnly = datav.codalmorigenReadOnly;
          this.codclienteReadOnly = datav.codclienteReadOnly;
          this.id_concepto_descripcion = datav.codconceptodescripcion;
          this.codpersonadesde = datav.codpersonadesde;
          this.descripcion_usuario_final = datav.codpersonadesdedesc;
          this.es_tienda = datav.esTienda;
      
          this.id = datav.cabecera?.id;
          this.numeroid = datav.cabecera?.numeroid;
          
          this.id_concepto = datav.cabecera?.codconcepto;
          this.validarPorConceptoDescripcion(datav.cabecera?.codconcepto);

          this.factor = datav.cabecera?.factor;
          this.codalmorigenText = datav.cabecera?.codalmorigen;
          this.codalmdestinoText = datav.cabecera?.codalmdestino;
          this.codvendedor = datav.cabecera?.codvendedor;
          this.fecha_origen = this.datePipe.transform(datav.cabecera?.fecha_inicial, "yyyy-MM-dd");
          this.fecha = this.datePipe.transform(datav.cabecera?.fecha, "yyyy-MM-dd");
          this.observaciones = datav.cabecera?.obs;
          this.id_origen = datav.cabecera?.fid;
          this.nroid_origen = datav.cabecera?.fnumeroid;
          this.cod_cliente = datav.cabecera?.cod_cliente;
          this.id_proforma_catalogo = datav.cabecera?.idproforma;
          this.numero_id_catalogo_proforma = datav.cabecera?.numeroidproforma
          this.id_proforma_sol_urgente = datav.cabecera?.idproforma_sol;
          this.numero_id_proforma_sol_urgente = datav.cabecera?.numeroidproforma_sol;  
          this.anular = datav.cabecera?.anulada;
          this.contabilizada = datav.cabecera?.contabilizada;

          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          if(this.anular){
            this.btnAnularReadOnly = true;
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {  }
      })
  }

  getParametrosIniciales(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getParametrosInicialesNM/";
    return this.api.getAll('/inventario/transac/docinmovimiento/getParametrosInicialesNM/'+this.userConn+"/"+this.usuarioLogueado+"/"+this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // console.log("🚀 ~ NotamovimientoComponent ~ .getParametrosIniciales ~ getParametrosIniciales:", datav);
          this.id = datav.id;
          this.numeroid = datav.numeroid;
          this.codvendedor = datav.codvendedor;
          this.codalmacen = datav.codalmacen;

          //this.cargar_proforma = datav.cargar_proforma; omitido
          this.cvenumeracion1 = datav.cvenumeracion1;
          this.chkdesglozar_cjtos = datav.chkdesglozar_cjtos;

          this.es_tienda = datav.es_tienda;
          this.es_ag_local = datav.es_ag_local;
          this.ver_ch_es_para_invntario = datav.ver_ch_es_para_invntario;
          this.obtener_cantidades_aprobadas_de_proformas = datav.obtener_cantidades_aprobadas_de_proformas;

          this.fidEnable = datav.dataPorConcepto.fidEnable;
          this.fnumeroidEnable = datav.dataPorConcepto.fnumeroidEnable;
          this.codpersonadesdeReadOnly = datav.dataPorConcepto.codpersonadesdeReadOnly;
          this.codclienteReadOnly = datav.dataPorConcepto.codclienteReadOnly;

          this.cargar_proformaEnabled = datav.dataPorConcepto.cargar_proformaEnabled;

          this.codalmorigenReadOnly = datav.dataPorConcepto.codalmorigenReadOnly;
          this.codalmorigenText = datav.dataPorConcepto.codalmorigenText;

          this.codalmdestinoReadOnly = datav.dataPorConcepto.codalmdestinoReadOnly;
          this.codalmdestinoText = datav.dataPorConcepto.codalmdestinoText;

          this.cvenumeracion1Enabled = datav.dataPorConcepto.cvenumeracion1Enabled;
          this.id_proforma_solReadOnly = datav.dataPorConcepto.id_proforma_solReadOnly;
          this.numeroidproforma_solReadOnly = datav.dataPorConcepto.numeroidproforma_solReadOnly;

          this.traspaso = datav.dataPorConcepto.traspaso;
          this.factor = datav.dataPorConcepto.factor;
        },


        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getValidaCantDecimal(){
    let item_a_revisar;

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getValidaCantDecimal/";
    return this.api.create('/inventario/transac/docinmovimiento/getValidaCantDecimal/' + this.userConn +"/"+ false, this.array_items_carrito_y_f4_catalogo)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ getValidaCantDecimal ~ datav:", datav);
          this.cumple = datav.cumple;
          
          datav.detalleObs.forEach(element => {
            item_a_revisar = element;
          });

          if(item_a_revisar === undefined){
            // si no hay observaciones entra aca
            this.openConfirmacionDialog("EL DETALLE CUMPLE");
          }else{
            this.openConfirmacionDialog(datav.cabecera+"\n"+datav.resp+"\n"+"Item a Revisar: "+item_a_revisar);
            this.eventosLogs = datav.detalleObs;
            this.eventosLogs = this.eventosLogs.map(log => ({ label: log }));
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {  }
      })
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
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

  getVendedorCatalogo() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // console.log("🚀 ~ .pipe ~ datav:", datav)
          this.array_vendedores = datav;
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
    const encontrado = this.array_vendedores.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
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

  getProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/venumeracion/catalogo/";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "2")
      .subscribe({
        next: (datav) => {
          this.array_proformas = datav;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveCatalogoProforma(event: any) {
    const inputValue = event.target.value.toUpperCase();
    // console.log("🚀 ~ NotamovimientoComponent ~ onLeaveCatalogoProforma ~ inputValue :", inputValue )
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.array_proformas.some(objeto => objeto.id === inputValue.toString());
    if(!encontrado){
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      this.id_proforma_catalogo = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    }else{
      event.target.value = inputValue;
    }
  }

  getAllConceptoCatalogo() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inconcepto/";
    return this.api.getAll('/inventario/mant/inconcepto/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.array_concepto = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveConceptoCatalogo(event: any) {
    const inputValue = event.target.value.toString();
    console.log("🚀 ~ NotamovimientoComponent ~ onLeaveCatalogoProforma ~ inputValue :", this.array_concepto )

    console.log("🚀 ~ NotamovimientoComponent ~ onLeaveCatalogoProforma ~ inputValue :", inputValue )
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.array_concepto.some(objeto => objeto.codigo.toString() === inputValue);
    if(!encontrado){
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    }else{
      
      event.target.value = inputValue;
      const encontrado_objeto = this.array_concepto.find(objeto => objeto.codigo.toString() === inputValue);
      this.id_concepto_descripcion = encontrado_objeto.descripcion
      this.validarPorConcepto(inputValue);

    }
  }

  getPersona(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/pers_plan/mant/pepersona/catalogo/"
    return this.api.getAll('/pers_plan/mant/pepersona/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.array_persona = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  async validarSaldos(){
    if (this.id_concepto === undefined) {
      const resultid_concepto = await this.openConfirmacionDialog(`FALTA CODIGO CONCEPTO`);
      if (resultid_concepto) {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        return;
      }
    }

    if (this.codalmorigenText === undefined || this.codalmorigenText === 0 ) {
      const resultcodalmorigenText = await this.openConfirmacionDialog(`FALTA ORIGEN Y/O EL ORIGEN NO PUEDE SER 0`);
      if (resultcodalmorigenText) {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        return;
      }
    }

    if (this.codalmdestinoText === undefined || this.codalmdestinoText === 0 ) {
      const resultcodalmdestinoText = await this.openConfirmacionDialog(`FALTA DESTINO Y/O EL DESTINO NO PUEDE SER 0`);
      if (resultcodalmdestinoText) {
        setTimeout(() => {
          this.spinner.hide();
        }, 500);
        return;
      }
    }

    let array = {
      codempresa: this.BD_storage,
      usuario: this.usuarioLogueado,
      codalmorigen: this.codalmorigenText,
      codalmdestino: parseInt(this.codalmdestinoText),
      codconcepto: this.id_concepto,
      tabladetalle: this.array_items_carrito_y_f4_catalogo
    };

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/copiarAduana/";
    return this.api.create('/inventario/transac/docinmovimiento/validarSaldos/' + this.userConn+"/"+false, array)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ validarSaldos:", datav)
          this.cumple = datav.cumple;
          if(datav.cumple){
            this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;
            this.messageService.add({ severity: 'info', summary: 'Informacion', detail: "SALDOS VALIDADOS ✅" });
            //aca mensaje datav.alerta
            if(datav.alerta){
              this.openConfirmacionDialog(datav.alerta);
            }
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: "OCURRIO UN ERROR" });
        },
        complete: () => {
        }
      })
  }

  codigoAduanaItems(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/copiarAduana/";
    return this.api.create('/inventario/transac/docinmovimiento/copiarAduana/' + this.userConn, this.array_items_carrito_y_f4_catalogo)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ codigoAduanaItems ~ datav:", datav);
        this.messageService.add({ severity: 'info', summary: 'Informacion', detail: "CODIGO ADUANA CON EXITO ✅" });
        this.array_items_carrito_y_f4_catalogo = datav;
        },

        error: (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "FALLO CODIGO ADUANA" });
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  totabilizar(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/Totalizar/";
    return this.api.create('/inventario/transac/docinmovimiento/Totalizar/' + this.userConn+"/"+true, {tabladetalle:this.array_items_carrito_y_f4_catalogo})
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ codigoAduanaItems ~ datav:", datav)
          this.total = datav.total;
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'TOTALIZADO EXITOSAMENTE' });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  totabilizarRevisado(){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/Totalizar/";
    return this.api.create('/inventario/transac/docinmovimiento/Totalizar/' + this.userConn+"/"+false, {tabladetalle:this.array_items_carrito_y_f4_catalogo})
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ codigoAduanaItems ~ datav:", datav)
          this.total_revisado = datav.total;
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'TOTALIZADO REVISADO EXITOSAMENTE' });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  validarPorConcepto(concepto){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/eligeConcepto/";
    return this.api.getAll('/inventario/transac/docinmovimiento/eligeConcepto/'+this.userConn+"/"+concepto+"/"+this.agencia_logueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ validarPorConcepto:", datav)
          this.codalmorigenReadOnly = datav.codalmorigenReadOnly;
          this.codalmdestinoReadOnly = datav.codalmdestinoReadOnly;
          this.traspaso = datav.traspaso;
          this.fidEnable = datav.fidEnable;
          this.fnumeroidEnable = datav.fnumeroidEnable;
          this.codpersonadesdeReadOnly = datav.codpersonadesdeReadOnly;
          this.codalmdestinoText = datav.codalmdestinoText;
          this.codalmorigenText = datav.codalmorigenText;
          this.factor = datav.factor;
          this.codclienteReadOnly = datav.codclienteReadOnly;
          this.cargar_proformaEnabled = datav.cargar_proformaEnabled;
          this.cvenumeracion1Enabled = datav.cvenumeracion1Enabled;
          this.id_proforma_solReadOnly = datav.id_proforma_solReadOnly;
          this.numeroidproforma_solReadOnly = datav.numeroidproforma_solReadOnly; 
          this.esAjuste = datav.conceptoEsAjuste;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  validarPorConceptoDescripcion(concepto){
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/eligeConcepto/";
    return this.api.getAll('/inventario/transac/docinmovimiento/eligeConcepto/'+this.userConn+"/"+concepto+"/"+this.agencia_logueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ validarPorConcepto:", datav)
          this.codalmorigenReadOnly = datav.codalmorigenReadOnly;
          this.codalmdestinoReadOnly = datav.codalmdestinoReadOnly;
          this.fidEnable = datav.fidEnable;
          this.fnumeroidEnable = datav.fnumeroidEnable;
          this.codpersonadesdeReadOnly = datav.codpersonadesdeReadOnly;
          this.factor = datav.factor;
          this.codclienteReadOnly = datav.codclienteReadOnly;
          this.cargar_proformaEnabled = datav.cargar_proformaEnabled;
          this.cvenumeracion1Enabled = datav.cvenumeracion1Enabled;
          this.id_proforma_solReadOnly = datav.id_proforma_solReadOnly;
          this.numeroidproforma_solReadOnly = datav.numeroidproforma_solReadOnly; 
          this.esAjuste = datav.conceptoEsAjuste;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  ponerDui(){
    this.spinner.show();
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/ponerDui/";
    return this.api.create('/inventario/transac/docinmovimiento/ponerDui/' + this.userConn + "/" + this.agencia_logueado, this.array_items_carrito_y_f4_catalogo)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ NotamovimientoComponent ~ ponerDui ~ datav:", datav)
        this.array_items_carrito_y_f4_catalogo = datav;

        this.messageService.add({ severity: 'success', summary: 'Informacion', detail: "PONER DUI COMPLETADO ✅" });
        setTimeout(() => {
          this.spinner.hide();
        }, 0);
        },

        error: (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "PONER DUI COMPLETADO" });
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        },
        complete: () => { 
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
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
    // this.item = event.data.coditem;
    // this.item_obj_seleccionado = event.data;

    // // this.getSaldoItem(this.item);
    // console.log('Row Selected:', event.data);
    // this.updateSelectedProducts();
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

   this.totabilizar();
   this.totabilizarRevisado();
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

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_5decimales.format(formattedNumber);
  }

  cargarProformaSolicitudUrgente(){
    if (this.id_proforma_catalogo === undefined || this.numero_id_catalogo_proforma === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'ID O NUM ID EN BLANCO, FAVOR COLOCAR PROFORMA DE ALMACEN'}) 
      return;
    }

    let array_PF = {
      codempresa: this.BD_storage,
      usuario: this.usuarioLogueado,
      id_proforma_sol: this.id_proforma_sol_urgente,
      numeroidproforma_sol: this.numero_id_proforma_sol_urgente,
      codconcepto: this.id_concepto,
      desglozar_cjtos: this.chkdesglozar_cjtos
    }
    console.log("🚀 ~ NotamovimientoComponent ~ cargarProformaSolicitudUrgente ~ array_PF:", array_PF)

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/CargardeProforma/";
    return this.api.create('/inventario/transac/docinmovimiento/CargardeProforma/'+this.userConn, array_PF)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ cargarProformaSolicitudUrgente:", datav);
          if(datav.resultado){
            this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;
            this.codalmacen = datav.codalmorigen;
            this.observaciones = datav.obs;
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  limpiar(){
    this.array_items_carrito_y_f4_catalogo = [];
    this.eventosLogs = [];

    this.total = 0;
    this.id_concepto = "";
    this.id_concepto_descripcion = "";
    this.observaciones = "";
    this.id_proforma_catalogo= "";
    this.descripcion_id_catalogo_proforma = "";
    this.numero_id_catalogo_proforma = 0;
    this.chkdesglozar_cjtos = false;
    this.codalmorigenText = "";
    this.codalmdestinoText = "";
    this.codpersonadesde = 0;
    this.cod_cliente = "";

    this.messageService.add({ severity: 'success', summary: 'Informacion', detail: "Nota de Movimiento Limpia ✅" });
    this.getParametrosIniciales();
  }

  solicitarPermisoDatoADatoB(){
    const dialogRefParams = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: '450px',
      height: 'auto',
      data: {
        dataA: this.id,
        dataB: this.numeroid,
        dataPermiso: "",
        dataCodigoPermiso: "13",
      },
    });

    dialogRefParams.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.fidEnable = false;
        this.fnumeroidEnable = false;
        this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'HABILITADO ✅'});
      }
    });
  }

  validarGrabar(){
    console.log(this.fecha);
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/grabarDocumento/";
    return this.api.getAll('/inventario/transac/docinmovimiento/permGrabarAntInventario/'+this.userConn+"/"+this.codalmacen+"/"+this.fecha+"/"+this.id+"/"+this.numeroid)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ datav:", datav)
          if(datav.valido){
            this.guardarNotaMovimiento();
          }else{
            const dialogRefParams = this.dialog.open(PermisosEspecialesParametrosComponent, {
              width: '450px',
              height: 'auto',
              data: {
                dataA: datav.datoA,
                dataB: datav.datoB,
                dataPermiso: "",
                dataCodigoPermiso: datav.servicio.toString(),
              },
            });
        
            dialogRefParams.afterClosed().subscribe((result: Boolean) => {
              if (result) {
                console.log("LOLAAAAAA");
                this.guardarNotaMovimiento();
              }else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'SERVICIO CANCELADO' });
              }
            });
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  async guardarNotaMovimiento(){
    if (this.id_concepto === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL CONCEPTO NO PUEDE ESTAR EN BLANCO'});
      return;
    }

    if (this.codvendedor === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL CODIGO VENDEDOR NO PUEDE ESTAR EN BLANCO'});
      return;
    }

    if (this.codalmorigenText === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY CODIGO DE ORIGEN'});
      return;
    }

    if (this.codalmorigenText === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL CODIGO ORIGEN NO PUEDE SER 0'});
      return;
    }

    if (this.codalmdestinoText === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY CODIGO DE DESTINO'});
      return;
    }

    if (this.codalmdestinoText === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL CODIGO DE DESTINO NO PUEDE SER 0'});
      return;
    }
    

    if (this.codalmdestinoText === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO HAY CODIGO DE DESTINO'});
      return;
    }

    if (this.observaciones === undefined || null) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'LA OBSERVACION NO PUEDE ESTAR EN BLANCO'});
      return;
    }

    if (this.observaciones.length > 60) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'LA OBSERVACION ES DEMASIADA LARGA'});
      return;
    }

    if (this.id === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL ID NO PUEDE ESTAR EN BLANCO'});
      return;
    }

    if (this.numeroid === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL NUMERO ID NO PUEDE ESTAR EN BLANCO'});
      return;
    }

    if (this.codalmacen === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL CODIGO ALMACEN NO PUEDE ESTAR EN BLANCO'});
      return;
    }

    if (this.fecha_actual === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'LA FECHA NO PUEDE ESTAR EN BLANCO, SELECCIONE UNA FECHA'});
      return;
    }

    if (this.total === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL TOTAL NO PUEDE SER 0, TOTALICE'});
      return;
    }

    if (this.id_concepto === 10 && this.id_proforma_catalogo === undefined && this.numero_id_catalogo_proforma === undefined || 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'SI EL CONCEPTO ES EL 10 NO PUEDE DEJAR EL ID Y NUM ID DE PROFORMA EN BLANCO'})
      return;
    }

    if (this.fidEnable === false && this.fnumeroidEnable === false) {
      if(this.id_origen === undefined && this.nroid_origen === undefined){
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'SE HABILITO EL ORIGEN, FAVOR COLOCAR ID Y NUM ID DE PROFORMA'})
      }
    }

    let array_PF = {
      cabecera:{
        id: this.id,
        numeroid: this.numeroid,
        fecha: this.fecha_actual,
        codalmacen: this.codalmacen,
        codalmorigen: this.codalmorigenText,
        codalmdestino: this.codalmdestinoText,
        obs: this.observaciones === undefined ? "":this.observaciones,
        codvendedor: this.codvendedor,
        codcliente: this.cod_cliente === undefined ? "":this.cod_cliente,
        usuarioreg: this.usuarioLogueado,
        factor: this.factor,
        fid: this.id_origen === undefined || null ? "":this.id_origen,
        fnumeroid: this.nroid_origen === undefined || null ? 0:this.nroid_origen,
        
        idproforma: this.id_proforma_catalogo === undefined ? "":this.id_proforma_catalogo,
        numeroidproforma: this.numero_id_catalogo_proforma === undefined || null ? 0:this.numero_id_catalogo_proforma,

        horareg: this.hora_fecha_server,
        fechareg: this.fecha_actual,
        fecha_inicial: this.fecha_actual,

        contabilizada: false,
        anulada: false,
        peso: 0,

        codpersona: this.codpersonadesde === undefined || null ? 0:this.codpersonadesde,
        idproforma_sol: this.id_proforma_sol_urgente === undefined ? "":this.id_proforma_sol_urgente.toUpperCase(),
        numeroidproforma_sol: this.numero_id_proforma_sol_urgente === undefined ? 0:this.numero_id_proforma_sol_urgente,
        codconcepto: this.id_concepto,

        //este datos nay ni en parametroIniciales
        comprobante: null,
      },

      tablaDetalle:this.array_items_carrito_y_f4_catalogo
    }
    console.log("🚀 ~ NotamovimientoComponent ~ guardarNotaMovimiento ~ array_PF:", array_PF)

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/grabarDocumento/";
    return this.api.create('/inventario/transac/docinmovimiento/grabarDocumento/'+this.userConn+"/"+this.BD_storage+"/"+this.traspaso, array_PF)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: async (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ guardarNotaMovimiento:", datav);
          if(datav.codigoNM){
            let result = await this.openConfirmationDialog(`${datav.resp}\n\n${datav.alertas.join('\n\n')}`);
              if (result) {
                //exportar ZIP
                await this.exportarZIPNMGrabar(datav.codigoNM);
                this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'GUARDADO EXITOSAMENTE ✅' });

                //window.location.reload();
              }else{
                this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'GUARDADO EXITOSAMENTE ✅ SIN EXPORTAR'});
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
          }

          if(datav.negativos){
            //hay negativos
            await this.openConfirmacionDialog(datav.resp)
            this.dataSource_negativos = new MatTableDataSource(datav.negativos);
            this.abrirTabPorLabel("Saldos Negativos");
          }

          if(datav.valido){
            // if(datav.resp){
            //   let result = await this.openConfirmacionDialogArray(datav.resp, datav.alertas);
            //   if (result) {
            //     //exportar ZIP
            //     this.exportarZIPNM(datav.codigoNM);
            //     this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'GUARDADO EXITOSAMENTE ✅' });
            //     //window.location.reload();
            //   }else{
            //     //window.location.reload();
            //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'OCURRIO UN PROBLEMA AL GUARDAR' });
            //   }
            // }
               
            // const resultcodalmdestinoText = await this.openConfirmacionDialog(datav.resp);
            // if (resultcodalmdestinoText) {
            //   setTimeout(() => {
            //     this.spinner.hide();
            //   }, 500);
            //   return;
            // }
          }else{
            // if(datav.resp){
            //   let result = await this.openConfirmacionDialog(datav.resp)
            // }
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  exportarZIPNMGrabar(codigo_NM){
    this.api.descargarArchivo('/inventario/transac/docinmovimiento/exportNM/' + this.userConn + "/" +codigo_NM, { responseType: 'arraybuffer' })
      .subscribe({
        next: (datav: ArrayBuffer) => {
          console.log(datav);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'DESCARGA EN PROCESO' })

          // Convertir ArrayBuffer a Blob
          const blob = new Blob([datav], { type: 'application/zip' });
          const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Formato: YYYYMMDDTHHMMSS

          // Crear el objeto URL para el Blob recibido
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = timestamp + "-" + this.id + "-" + this.numeroid + '.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
            window.location.reload()
          }, 500);
        }
      });
  }

  exportarZIPNM(codigo_NM){
    this.api.descargarArchivo('/inventario/transac/docinmovimiento/exportNM/' + this.userConn + "/" +codigo_NM, { responseType: 'arraybuffer' })
      .subscribe({
        next: (datav: ArrayBuffer) => {
          console.log(datav);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'DESCARGA EN PROCESO' })

          // Convertir ArrayBuffer a Blob
          const blob = new Blob([datav], { type: 'application/zip' });
          const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');  // Formato: YYYYMMDDTHHMMSS

          // Crear el objeto URL para el Blob recibido
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = timestamp + "-" + this.id + "-" + this.numeroid + '.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err);
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

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    // console.log(tabs);
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }












  // NEGATIVOS
  validarNegativos(){
     let proforma_validar = {
        datosDocVta: {
          estado_doc_vta: "string",
          coddocumento: 0,
          id: "",
          numeroid: "0",
          fechadoc: this.fecha_actual,
          codcliente: "",
          nombcliente: "",
          nitfactura: "",
          tipo_doc_id: "",
          codcliente_real: "",
          nomcliente_real: "",
          codtarifadefecto: 0,
          codmoneda: "",
          subtotaldoc: 0,
          totaldoc: 0,
          tipo_vta: "",
          codalmacen: this.codalmacen.toString(),
          codvendedor: "",
          preciovta: "",
          desctoespecial: "",
          preparacion: "",
          tipo_cliente: "",
          cliente_habilitado: "",
          contra_entrega: "",
          vta_cliente_en_oficina: true,
          estado_contra_entrega: "",
          desclinea_segun_solicitud: true,
          idsol_nivel: "",
          nroidsol_nivel: "",
          pago_con_anticipo: true,
          niveles_descuento: "",
          transporte: "",
          nombre_transporte: "",
          fletepor: "",
          tipoentrega: "",
          direccion: "",
          ubicacion: "",
          latitud: "",
          longitud: "",
          nroitems: 0,
          totdesctos_extras: 0,
          totrecargos: 0,
          tipo_complemento: "",
          idpf_complemento: "",
          nroidpf_complemento: "",
          idFC_complementaria: "",
          nroidFC_complementaria: "",
          nrocaja: "",
          nroautorizacion: "",
          fechalimite_dosificacion: this.fecha_actual,
          tipo_caja: "",
          version_codcontrol: "",
          nrofactura: "",
          nroticket: "",
          idanticipo: "",
          noridanticipo: "",
          monto_anticipo: 0,

          idpf_solurgente: this.id_proforma_sol_urgente === undefined ? "":this.id_proforma_sol_urgente,
          noridpf_solurgente: this.numero_id_proforma_sol_urgente === undefined ? "0":this.numero_id_proforma_sol_urgente.toString(),

        },
        detalleAnticipos: [],
        detalleDescuentos: [],
        detalleEtiqueta: [],
        detalleItemsProf: this.array_items_carrito_y_f4_catalogo.map((element)=>({
          ...element,
          niveldesc:"ACTUAL"
        })),

        detalleRecargos: [],
      }
    
      console.log(proforma_validar);
      const url = `/venta/transac/veproforma/validarProforma/${this.userConn}/00060/proforma/grabar_aprobar/${this.BD_storage}/${this.usuarioLogueado}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creacion Ruta:- ${url}`;

      this.api.create(url, proforma_validar).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ this.api.create ~ datav:", datav)
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'VALIDACION CORRECTA NEGATIVOS ✅' })

          if (datav.jsonResult[0]?.dtnegativos) {
            this.validacion_post_negativos = datav.jsonResult[0]?.dtnegativos;
          }

          this.abrirTabPorLabel("Negativos");

          this.toggleTodosNegativos = true;
          this.toggleNegativos = false;
          this.togglePositivos = false;

          this.validacion_post_negativos = this.validacion_post_negativos.map(element => ({
            ...element,
            cantidad: this.formatNumberTotalSubTOTALES(element.cantidad),
            cantidad_conjunto: this.formatNumberTotalSubTOTALES(element.cantidad_conjunto),
            saldo_sin_descontar_reservas: this.formatNumberTotalSubTOTALES(element.saldo_sin_descontar_reservas),
            cantidad_suelta: this.formatNumberTotalSubTOTALES(element.cantidad_suelta),
            cantidad_reservada_para_cjtos: this.formatNumberTotalSubTOTALES(element.cantidad_reservada_para_cjtos),
            saldo_descontando_reservas: this.formatNumberTotalSubTOTALES(element.saldo_descontando_reservas),
          }));

          this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
          this.array_items_carrito_y_f4_catalogo = datav.itemDataMatriz;
    
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

  negativosTodosFilterToggle(){
    this.toggleTodosNegativos = true;
    this.toggleNegativos = false;
    this.togglePositivos = false;

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos);
  }

  negativosNegativosFilterToggle(){
    this.toggleTodosNegativos = false;
    this.toggleNegativos = true;
    this.togglePositivos = false;

    this.validacion_post_negativos_filtrados_solo_negativos = this.validacion_post_negativos.filter((element) => {
      return element.obs === "Genera Negativo";
    });

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos_filtrados_solo_negativos);
  }

  negativosPositivosFilterToggle(){
    this.toggleTodosNegativos = false;
    this.toggleNegativos = false;
    this.togglePositivos = true;

    // this.validacion_post_negativos_filtrados_solo_positivos = this.validacion_post_negativos.filter((element) => {
    //   return element.obs === "Positivo";
    // });

    this.dataSource_negativos = new MatTableDataSource(this.validacion_post_negativos_filtrados_solo_positivos);
  }
  //FIN NEGATIVOS

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
    const array_carrito:any=[];
    this.spinner.show();
    console.log(zip_json);

    this.id = zip_json.cabeceraList[0]?.id;
    this.numeroid = zip_json.cabeceraList[0]?.numeroid;
    this.id_concepto = zip_json.cabeceraList[0]?.codconcepto;
    this.factor = zip_json.cabeceraList[0]?.factor;
    this.codalmorigenText = zip_json.cabeceraList[0]?.codalmdestino;
    this.codalmdestinoText = zip_json.cabeceraList[0]?.codalmorigen;
    this.codvendedor = zip_json.cabeceraList[0]?.codvendedor;
    this.fecha_origen = this.datePipe.transform(zip_json.cabeceraList[0]?.fecha_inicial, "yyyy-MM-dd");
    this.fecha = this.datePipe.transform(zip_json.cabeceraList[0]?.fecha, "yyyy-MM-dd");
    this.observaciones = zip_json.cabeceraList[0]?.obs;
    this.id_origen = zip_json.cabeceraList[0]?.fid;
    this.nroid_origen = zip_json.cabeceraList[0]?.fnumeroid;
    this.cod_cliente = zip_json.cabeceraList[0]?.codcliente;
    this.id_proforma_catalogo = zip_json.cabeceraList[0]?.idproforma;
    this.numero_id_catalogo_proforma = zip_json.cabeceraList[0]?.numeroidproforma
    this.id_proforma_sol_urgente = zip_json.cabeceraList[0]?.idproforma_sol;
    this.numero_id_proforma_sol_urgente = zip_json.cabeceraList[0]?.numeroidproforma_sol;  
    this.anular = zip_json.cabeceraList[0]?.anulada;
    this.contabilizada = zip_json.cabeceraList[0]?.contabilizada;


    if(this.array_items_carrito_y_f4_catalogo.length > 0){
      console.log("🚀 ~ ModificarNotaMovimientoComponent ~ this.array_items_carrito_y_f4_catalogo.length:", this.array_items_carrito_y_f4_catalogo.length)
      
      this.array_items_carrito_y_f4_catalogo = array_carrito.concat(
        zip_json.detalleList.map((element) => ({
          ...element,
          cantidad_revisada: element.cantidad,
          cantidad: 0,
          nuevo: "si"
        }))
      );
    }else{
      this.array_items_carrito_y_f4_catalogo = zip_json.detalleList;
    }


  }
  //FIN Importar ZIP

  // BUSCADOR ID NUMID
  async permisoParaTransferirNM(){
    if(this.id_ntmv_buscador === undefined || this.num_id_ntmv_buscador === undefined){
      this.id_ntmv_buscador = "";
      this.num_id_ntmv_buscador = 0;
    }

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/modif/docmodifinmovimiento/permModifNMAntInventario/";
    return this.api.getAll('/inventario/modif/docmodifinmovimiento/permModifNMAntInventario/' + this.userConn +"/"+ this.id_ntmv_buscador +"/"+ this.num_id_ntmv_buscador)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: async (datav) => {
        console.log("🚀 ~ ModificarNotaMovimientoComponent ~ getValidoNotaMovimiento:", datav);
          this.valido_en_validar_funcion = datav.valido;

          this.getTransferirProforma(true);
          
          if(datav.valido){
            this.getTransferirProforma(true);
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ NO VALIDO PARA TRANSFERENCIA !' });
            this.btnGrabarReadOnly = true;
            this.btnAnularReadOnly = true;

            const dialogRefAnulacion = await this.dialog.open(DialogConfirmActualizarComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: "Esta Nota es anterior al ultimo inventario fisico, para poder modificarla necesita autorización ¿ Desea Continuar ?" },
              disableClose: true,
            });
        
            dialogRefAnulacion.afterClosed().subscribe((result: Boolean) => {
              if(result){
                const dialogRefParams = this.dialog.open(PermisosEspecialesParametrosComponent, {
                  width: '450px',
                  height: 'auto',
                  data: {
                    dataA: this.id_ntmv_buscador,
                    dataB: this.num_id_ntmv_buscador,
                    dataPermiso: "",
                    dataCodigoPermiso: datav.servicio,
                  },
                });

                dialogRefParams.afterClosed().subscribe((result: Boolean) => {
                  console.log("🚀 ~ ModificarNotaMovimientoComponent ~ dialogRefParams.afterClosed ~ result:", result)
                  if (result) {
                    this.btnGrabarReadOnly = false;
                    this.btnAnularReadOnly = false;
                  }else{
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ NO TIENE PERMISO !' });
                    this.btnGrabarReadOnly = true;
                    this.btnAnularReadOnly = true;
                  }
                })}else{
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ ACCION CANCELADA !' });
                  this.btnGrabarReadOnly = true;
                  this.btnAnularReadOnly = true;
                };
            });
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {  }
      })
  }
  
  getTransferirProforma(permiso:boolean){
    if(this.id_ntmv_buscador === undefined || this.num_id_ntmv_buscador === undefined){
      this.id_ntmv_buscador = "";
      this.num_id_ntmv_buscador = 0;
    }

    console.log("🚀 ~ ModificarNotaMovimientoComponent ~ transferirProforma ~ transferirProforma:", this.id_ntmv_buscador, this.num_id_ntmv_buscador);
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/modif/docmodifinmovimiento/obtNMxModif/";
    return this.api.getAll('/inventario/modif/docmodifinmovimiento/obtNMxModif/' + this.userConn +"/"+  this.id_ntmv_buscador +"/"+ this.num_id_ntmv_buscador+"/"+permiso)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarNotaMovimientoComponent ~ transferirProforma:", datav)

          this.btnAnularReadOnly = datav.btnAnularReadOnly;
          this.btnGrabarReadOnly = datav.btnGrabarReadOnly;
          this.btnHabilitarReadOnly = datav.btnHabilitarReadOnly;
          this.codalmdestinoReadOnly = datav.codalmdestinoReadOnly;
          this.codalmorigenReadOnly = datav.codalmorigenReadOnly;
          this.codclienteReadOnly = datav.codclienteReadOnly;
          this.id_concepto_descripcion = datav.codconceptodescripcion;
          this.codpersonadesde = datav.codpersonadesde;
          this.descripcion_usuario_final = datav.codpersonadesdedesc;
          this.es_tienda = datav.esTienda;
      
          this.id = datav.cabecera?.id;
          this.numeroid = datav.cabecera?.numeroid;
          
          this.id_concepto = datav.cabecera?.codconcepto;
          this.validarPorConcepto(datav.cabecera?.codconcepto);

          this.factor = datav.cabecera?.factor;
          this.codalmorigenText = datav.cabecera?.codalmdestino;
          this.codalmdestinoText = datav.cabecera?.codalmorigen;
          this.codvendedor = datav.cabecera?.codvendedor;
          this.fecha_origen = this.datePipe.transform(datav.cabecera?.fecha_inicial, "yyyy-MM-dd");
          this.fecha = this.datePipe.transform(datav.cabecera?.fecha, "yyyy-MM-dd");
          this.observaciones = datav.cabecera?.obs;
          this.id_origen = datav.cabecera?.fid;
          this.nroid_origen = datav.cabecera?.fnumeroid;
          this.cod_cliente = datav.cabecera?.cod_cliente;
          this.id_proforma_catalogo = datav.cabecera?.idproforma;
          this.numero_id_catalogo_proforma = datav.cabecera?.numeroidproforma
          this.id_proforma_sol_urgente = datav.cabecera?.idproforma_sol;
          this.numero_id_proforma_sol_urgente = datav.cabecera?.numeroidproforma_sol;  
          this.anular = datav.cabecera?.anulada;
          this.contabilizada = datav.cabecera?.contabilizada;

          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          if(this.anular){
            this.btnAnularReadOnly = true;
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {  }
      })
  
  
  
  
  
  
  }
  //FIN BUSCADOR ID NUMID
  
  //BUSCADOR GENERAL
  getIdNumeroIdNotasMovimiento() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intipomovimiento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // console.log("🚀 ~ ModificarNotaMovimientoComponent ~ getIdNumeroIdNotasMovimiento ~ datav:", datav)
          this.array_notas_movimiento = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  anularNM(){
    const dialogRefAnulacion = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿ Desea Anular el Documento ?" },
      disableClose: true,
    });

    dialogRefAnulacion.afterClosed().subscribe((result: Boolean) => {
      if(result){
        // Llamada a la API para obtener nuevos datos
        this.api.update(`/inventario/modif/docmodifinmovimiento/anularNotaMovimiento/${this.userConn}/${this.codigo_ultm_NM}/${this.usuarioLogueado}/${this.BD_storage}`, [])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (datav) => {
            console.log("Respuesta API:", datav);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });

            // traerlo de nuevo
            this.id_ntmv_buscador = this.id;
            this.num_id_ntmv_buscador = this.numeroid;
            this.permisoParaTransferirNM();
          },
          error: (err) => {
            console.error("Error al consultar la API:", err);
          },
          complete:()=>{ }
        });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "ACCION CANCELADA" });
      }

    });
  }

  habilitarNM(){
    const dialogRefAnulacion = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿ Desea Habilitar el Documento ?" },
      disableClose: true,
    });

    dialogRefAnulacion.afterClosed().subscribe((result: Boolean) => {
      if(result){
        // Llamada a la API para obtener nuevos datos
        this.api.update(`/inventario/modif/docmodifinmovimiento/habilitarNotaMovimiento/${this.userConn}/${this.codigo_ultm_NM}/${this.usuarioLogueado}/${this.BD_storage}`, [])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (datav) => {
            console.log("Respuesta API:", datav);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });

            // traerlo de nuevo
            this.id_ntmv_buscador = this.id;
            this.num_id_ntmv_buscador = this.numeroid;
            this.permisoParaTransferirNM();
          },
          error: (err) => {
              console.error("Error al consultar la API:", err);
          },
          complete:()=>{ }
        });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "ACCION CANCELADA" });
      }
    });
  }

  async getValidacionSaldosModificar(){
      if (this.id_concepto === undefined) {
        const resultid_concepto = await this.openConfirmacionDialog(`FALTA CODIGO CONCEPTO`);
        if (resultid_concepto) {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          return;
        }
      }
    
      if (this.codalmorigenText === undefined || this.codalmorigenText === 0 ) {
        const resultcodalmorigenText = await this.openConfirmacionDialog(`FALTA ORIGEN Y/O EL ORIGEN NO PUEDE SER 0`);
        if (resultcodalmorigenText) {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          return;
        }
      }
    
      if (this.codalmdestinoText === undefined || this.codalmdestinoText === 0 ) {
        const resultcodalmdestinoText = await this.openConfirmacionDialog(`FALTA DESTINO Y/O EL DESTINO NO PUEDE SER 0`);
        if (resultcodalmdestinoText) {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
          return;
        }
      }
    
      let array = {
        codempresa: this.BD_storage,
        usuario: this.usuarioLogueado,
        codalmorigen: this.codalmorigenText,
        codalmdestino: parseInt(this.codalmdestinoText),
        codconcepto: this.id_concepto,
        tabladetalle: this.array_items_carrito_y_f4_catalogo
      };
  
      let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/copiarAduana/";
      return this.api.create('/inventario/transac/docinmovimiento/validarSaldos/' + this.userConn+"/"+false, array)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ validarSaldos:", datav)
            this.cumple = datav.cumple;
            if(datav.cumple){
              this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;
              this.messageService.add({ severity: 'info', summary: 'Informacion', detail: "SALDOS VALIDADOS ✅" });
              //aca mensaje datav.alerta
              if(datav.alerta){
                this.openConfirmacionDialog(datav.alerta);
              }
            }
          },
  
          error: (err: any) => {
            console.log(err, errorMessage);
            this.messageService.add({ severity: 'info', summary: 'Informacion', detail: "OCURRIO UN ERROR" });
          },
          complete: () => { }
        })
  }

  verificarItemsRepetidos(){
    // Llamada a la API para obtener nuevos datos
    this.api.create(`/inventario/modif/docmodifinmovimiento/hayRepetidos/${this.userConn}`, {tablaDetalle:this.array_items_carrito_y_f4_catalogo})
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (datav) => {
      console.log("🚀 ~ ModificarNotaMovimientoComponent ~ verificarItemsRepetidos ~ datav:", datav)
      this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });
      },

      error: (err) => {
        console.error("Error", err);
      },
      complete:()=>{ }
    });
  }









  imprimirNM(){
    //colocar el cudrito con el dialogo de intarifa
    this.modalBtnImpresiones();


    // const dialogRefAnulacion = this.dialog.open(DialogConfirmActualizarComponent, {
    //   width: '450px',
    //   height: 'auto',
    //   data: { mensaje_dialog: "¿ Desea Imprimir el Documento ?" },
    //   disableClose: true,
    // });

    // dialogRefAnulacion.afterClosed().subscribe((result: Boolean) => {
    //   if(result){
    //     // Llamada a la API para obtener nuevos datos
    //     this.api.update(`/inventario/modif/docmodifinmovimiento/habilitarNotaMovimiento/${this.userConn}/${this.codigo_ultm_NM}/${this.usuarioLogueado}/${this.BD_storage}`, [])
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe({
    //       next: (datav) => {
    //         console.log("Respuesta API:", datav);

    //       },
    //       error: (err) => {
    //           console.error("Error al consultar la API:", err);
    //       },
    //       complete:()=>{ }
    //     });
    //   }else{
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: "ACCION CANCELADA" });
    //   }
    // });
  }

  //ModalPrecioVentaComponent
  modalBtnImpresiones() {
    this.dialog.open(DialogTarifaImpresionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });

  }





























  modalBuscadorAvanzado(){
    this.dialog.open(NotaMovimientoBuscadorAvanzadoComponent, {
      width: '794px',
      height: '600px',
      disableClose: true,
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

  modalPepersona(): void {
    this.dialog.open(PersonaCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
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
  
  catalogoProformas(origen){
    this.dialog.open(CatalogoProformasComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    
    this.catalogo_proforma_seleccionado = origen;
    console.log("🚀 ~ NotamovimientoComponent ~ catalogoProformas ~ this.catalogo_proforma_seleccionado:", this.catalogo_proforma_seleccionado)
  }

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
        tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: 0,
        codalmacen: this.agencia_logueado,
        desc_linea_seg_solicitud: "",
        codmoneda: "0",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        descuento_nivel: "ACTUAL",
        tipo_ventana:"inventario",
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

  openConfirmationDialog(message: string): Promise<boolean> {
    //btn si/no
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  openConfirmacionDialogArray(message: string, array): Promise<boolean> {
    //btn aceptar
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message, msj_array: array },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  openConfirmacionDialog(message: string): Promise<boolean> {
    //btn aceptar
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
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
        items: [],
        descuento_nivel: 0,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        tipo_ventana:"inventario",
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
