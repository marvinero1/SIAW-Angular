
import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { Router } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { MatRadioChange } from '@angular/material/radio';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { LineaProductoCatalogoComponent } from '@components/mantenimiento/inventario/lineaproducto/linea-producto-catalogo/linea-producto-catalogo.component';
import { ServicioLineaProductoService } from '@components/mantenimiento/inventario/lineaproducto/service-linea/servicio-linea-producto.service';
import { GrupoMerCatalogoComponent } from '@components/mantenimiento/inventario/gruposlineas/gruposlineas-catalogo/grupomer-catalogo.component';
import { ServicioGrupoMerService } from '@components/mantenimiento/inventario/gruposlineas/service-gruposmerlineas/servicio-gruposmer.service';
import { CatalogoPedidoComponent } from '@components/mantenimiento/inventario/numpedidomercaderia/catalogo-pedido/catalogo-pedido.component';
import { CatalogoPedidoService } from '@components/mantenimiento/inventario/numpedidomercaderia/catalogo-pedido/servicio-catalogo-pedido/catalogo-pedido.service';
@Component({
  selector: 'app-generar-pedido-automatico',
  templateUrl: './generar-pedido-automatico.component.html',
  styleUrl: './generar-pedido-automatico.component.scss'
})
export class GenerarPedidoAutomaticoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler5(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "input_numero_id_nota_remision":
        // this.getClientByID(this.codigo_cliente);
        //this.generarFacturaNRPOST(this.valProfDespachoForm, this.valFechaRemiHoyForm, this.valFactContadoForm, this.valTipoCamForm);
        //   break;
        // case "input_search":
        //   this.transferirProforma();
        //   break;
      }
    }
  };

  public nombre_ventana: string = "prggenerapedido.vb";
  public ventana: string = "Generar Pedido Automatico";
  public detalle = "Generar Pedido Automatico";
  public tipo = "Generar-Pedido-Automatico-POST";

  selectedItems!: any[];
  fecha_actual: any;
  hora_fecha_server: any;
  txt_codalmacen: any;
  txt_codalmacen2: any;
  txt_id: any;
  txt_grupo_desde: any;
  txt_grupo_hasta: any;
  txt_linea_desde: any;
  txt_linea_hasta: any;
  txt_item_desde: any;
  txt_item_hasta: any;

  codigo_item_catalogo: any = [];

  /* todos: any;
  grupos:any;
  lineas:any;
  items:any;
  grupodesde: string;
  grupohasta: string;
  lineadesde: string;
  lineahasta: string;
  itemdesde: string;
  itemhasta: string; */

  filtro = { seleccionado: "todos" };
  //filtrosDatosDesde = { gruposdesde: '', lineasdesde: '', itemsdesde: '' };
  //filtrosDatosHasta = { gruposhasta: '', lineashasta: '', itemshasta: '' };

  todos: boolean;
  grupos: boolean;
  lineas: boolean;
  items: boolean;

  es_grupo_desde: boolean;
  es_linea_desde: boolean;
  es_item_desde: boolean;

  gruposdesde: string;
  lineasdesde: string;
  itemsdesde: string;
  gruposhasta: string;
  lineashasta: string;
  itemshasta: string;
  almacen_seleccionado: any;

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  codigo_pedido: any;

  valido: any;
  respuesta: any;
  private unsubscribe$ = new Subject<void>();

  constructor(public dialog: MatDialog, private api: ApiService, private datePipe: DatePipe, public nombre_ventana_service: NombreVentanaService,
    private almacenservice: ServicioalmacenService, private servicioCatalogoPedido: CatalogoPedidoService, public itemservice: ItemServiceService,
    public lineaservice: ServicioLineaProductoService, public grupomerservice: ServicioGrupoMerService,
    public router: Router,
    private messageService: MessageService, private spinner: NgxSpinnerService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    //Almacen Desde
    this.getHoraFechaServidorBckEnd();

    // IDTIPO
    this.servicioCatalogoPedido.disparadorDeCatalogoDePedidos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.txt_id = data.pedido.id;
    });
    //

    //Almacen Hasta
    //Almacen
    this.almacenservice.disparadorDeAlmacenes.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Almacen: ", data, this.almacen_seleccionado);
      if (this.almacen_seleccionado === "origen") {
        this.txt_codalmacen = data.almacen.codigo
      }

      if (this.almacen_seleccionado === "destino") {
        this.txt_codalmacen2 = data.almacen.codigo
      }
    });
    //
    //Item Hasta

    this.txt_grupo_desde = "";
    this.txt_grupo_hasta = "";
    this.txt_linea_desde = "";
    this.txt_linea_hasta = "";
    this.txt_item_desde = "";
    this.txt_item_hasta = "";

    this.itemservice.disparadorDeItemsCatalogo.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data;
      if (this.es_item_desde === true) {
        this.itemsdesde = this.codigo_item_catalogo.coditem;
        this.txt_item_desde = this.itemsdesde;
        this.es_item_desde = false;
        console.log("Item en desde: ", this.itemsdesde);
      } else {
        this.itemshasta = this.codigo_item_catalogo.coditem;
        this.txt_item_hasta = this.itemshasta;
        console.log("Item en hasta: ", this.itemshasta);
      }
    });

    this.lineaservice.disparadorDeLineaItem.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Linea: ", data);
      if (this.es_linea_desde === true) {
        this.lineasdesde = data.linea.codigo;
        this.txt_linea_desde = this.lineasdesde;
        this.es_linea_desde = false;
        console.log("Linea en desde: ", this.lineasdesde);
      } else {
        this.lineashasta = data.linea.codigo;
        this.txt_linea_hasta = this.lineashasta;
        console.log("Linea en hasta: ", this.lineashasta);
      }
    });
    this.grupomerservice.disparadorDeGrupoMer.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Grupo: ", data);
      if (this.es_grupo_desde === true) {
        this.gruposdesde = data.linea.codigo.toString();
        //this.gruposdesde = Number(data.linea.codigo);
        this.txt_grupo_desde = this.gruposdesde;
        this.es_grupo_desde = false;
        console.log("Grupo en desde: ", this.gruposdesde);
      } else {
        this.gruposhasta = data.linea.codigo;
        this.txt_grupo_hasta = this.gruposhasta;
        console.log("Grupo en hasta: ", this.gruposhasta);
      }
    });
    //
    console.log("Filtro seleccionado INI: ", this.filtro.seleccionado);  // Debe ser 'todos'
    this.Actualizar_Seleccion()
  }
  
  // Método para manejar cambios si es necesario
  onRadioChange(event: MatRadioChange) {
    this.Actualizar_Seleccion()
  }

  Actualizar_Seleccion() {
    console.log("Filtro seleccionado: ", this.filtro.seleccionado);
    this.todos = this.filtro.seleccionado === "todos";
    this.grupos = this.filtro.seleccionado === "grupos";
    this.lineas = this.filtro.seleccionado === "lineas";
    this.items = this.filtro.seleccionado === "items";
    this.txt_grupo_desde = "";
    this.txt_grupo_hasta = "";
    this.txt_linea_desde = "";
    this.txt_linea_hasta = "";
    this.txt_item_desde = "";
    this.txt_item_hasta = "";
    console.log("Datos seleccionado todos: ", this.todos);
    console.log("Datos seleccionado grupos: ", this.grupos);
    console.log("Datos seleccionado lineas: ", this.lineas);
    console.log("Datos seleccionado items: ", this.items);
  }

  GenerarPedidoAutomatico() {
    this.spinner.show();
    //VALIDACIONES
    if (this.txt_codalmacen === undefined) {
      //console.log("Ingreso a validar ID: ", this.txt_id);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'INGRESE EL ALMACEN' });
      this.spinner.hide();
      return;
    }
    if (this.txt_codalmacen2 === undefined) {
      //console.log("Ingreso a validar ID: ", this.txt_id);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'INGRESE EL ALMACEN A PEDIR' });
      this.spinner.hide();
      return;
    }
    if (this.txt_id === undefined) {
      //console.log("Ingreso a validar ID: ", this.txt_id);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'INGRESE ID DE TIPO' });
      this.spinner.hide();
      return;
    }
    if (this.filtro.seleccionado === "grupos" && this.txt_grupo_desde === "" && this.txt_grupo_hasta === "") {
      //console.log("Ingreso a validar ID: ", this.txt_id);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'DEBE SELECCIONAR LOS GRUPOS.' });
      this.spinner.hide();
      return;
    }
    if (this.filtro.seleccionado === "lineas" && this.txt_linea_desde === "" && this.txt_linea_hasta === "") {
      //console.log("Ingreso a validar ID: ", this.txt_id);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'DEBE SELECCIONAR LAS LINEAS.' });
      this.spinner.hide();
      return;
    }
    if (this.filtro.seleccionado === "items" && this.txt_item_desde === "" && this.txt_item_hasta === "") {
      //console.log("Ingreso a validar ID: ", this.txt_id);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'DEBE SELECCIONAR LOS ITEMS.' });
      this.spinner.hide();
      return;
    }

    let array_post = {
      codalmacen: this.txt_codalmacen,
      codalmacen2: this.txt_codalmacen2,
      id: this.txt_id,
      todos: this.todos,
      grupos: this.grupos,
      lineas: this.lineas,
      items: this.items,
      grupodesde: this.txt_grupo_desde,
      grupohasta: this.txt_grupo_hasta,
      lineadesde: this.txt_linea_desde,
      lineahasta: this.txt_linea_hasta,
      itemdesde: this.txt_item_desde,
      itemhasta: this.txt_item_hasta,
    }

    console.warn("🚀 ~ GenerarPedidoAutomaticoComponent ~ generarpedidoautomatico ~ array_post:", array_post);
    console.warn("🚀 ~ GenerarPedidoAutomaticoComponent ~ generarpedidoautomatico ~ usuario:", this.usuarioLogueado);
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/transac/docinpedido/GenerarPedidoAutomatico/";
    return this.api.create('/inventario/transac/docinpedido/GenerarPedidoAutomatico/' + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado, array_post)
      .subscribe({
        next: async (datav) => {
          console.log("🚀 ~ GenerarPedidoAutomaticoComponent ~ generarpedidoautomatico ~ datav:", datav);
          this.valido = datav.valido;
          this.respuesta = datav.resp;

          console.log("🚀 ~ GenerarPedidoAutomaticoComponent ~ generarpedidoautomatico ~ this.eventosLogs:", this.respuesta)
          if (datav.valido) {
            this.openConfirmacionDialog(datav.resp);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });
          }
          else {
            this.openConfirmacionDialog(datav.resp + "\n");
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
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

  insertarSaltosDeLinea(texto: string, limite: number = 21): string {
    let resultado = '';
    for (let i = 0; i < texto.length; i += limite) {
      resultado += texto.substring(i, i + limite);
    }
    // console.log(resultado);
    return resultado.trim(); // Quita el salto de línea final si no lo deseas
  }

  cortarStringSiEsLargo(texto: string): string {
    if (texto.length >= 27) {
      return texto.slice(0, 27);  // Corta a los primeros 28 caracteres
    }
    return texto;  // Retorna el texto original si tiene menos de 28 caracteres
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

  modalCatalogoIdPedido(): void {
    this.dialog.open(CatalogoPedidoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalCatalogoItemsDesde(): void {
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
        codmoneda: "0",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        descuento_nivel: "ACTUAL",
        tipo_ventana: "inventario",
      },
    });
    this.es_item_desde = true;
  }

  modalCatalogoItemsHasta(): void {
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
        codmoneda: "0",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        descuento_nivel: "ACTUAL",
        tipo_ventana: "inventario",
      },
    });
    this.es_item_desde = false;
  }
  modalCatalogoLineaDesde() {
    this.dialog.open(LineaProductoCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    this.es_linea_desde = true;
  }
  modalCatalogoLineaHasta() {
    this.dialog.open(LineaProductoCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    this.es_linea_desde = false;
  }

  modalCatalogoGrupomerDesde() {
    this.dialog.open(GrupoMerCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    this.es_grupo_desde = true;
  }
  modalCatalogoGrupomerHasta() {
    this.dialog.open(GrupoMerCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    this.es_grupo_desde = false;
  }
}
