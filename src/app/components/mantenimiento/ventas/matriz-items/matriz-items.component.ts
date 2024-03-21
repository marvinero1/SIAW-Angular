import { Component, ElementRef, HostListener, OnInit, ViewChild, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ItemServiceService } from '../serviciosItem/item-service.service';
import { ToastrService } from 'ngx-toastr';
import { ModalSaldosComponent } from './modal-saldos/modal-saldos.component';
import { StockActualF9Component } from './stock-actual-f9/stock-actual-f9.component';
import { SaldoItemMatrizService } from './services-saldo-matriz/saldo-item-matriz.service';
import { ItemSeleccionCantidadComponent } from './item-seleccion-cantidad/item-seleccion-cantidad.component';
import { ServicioF9Service } from './stock-actual-f9/servicio-f9.service';
import { DatePipe } from '@angular/common';
import Handsontable from 'handsontable';

@Component({
  selector: 'app-matriz-items',
  templateUrl: './matriz-items.component.html',
  styleUrls: ['./matriz-items.component.scss']
})
export class MatrizItemsComponent implements OnInit, AfterViewInit {

  // @HostListener("document:keydown.F9", []) unloadHandler(event: Event) {
  //   // Verificar si la tecla F9 ya ha sido presionada
  //   this.modalStockActualF9();
  // };

  @HostListener("document:keydown.enter", []) unloadHandler1(event: Event) {
    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    console.log(`Elemento enfocado Matriz: ${nombre_input}`);

    switch (nombre_input) {
      case 'focusPedido':
        this.addItemArray();
        this.pedido = undefined;
        break;
      case 'focusCantidad':
        // ACA SE COLOCA AL ARRAY DE ITEMS SELECCIONADOS PARA LA VENTA
        // UNA VEZ YA EN EN ARRAY, VUELVE A LA ULTIMA POSICION DE LA MATRIZ
        this.addItemArray();
        this.pedido = undefined;
        break;
      case 'idBuscadorHoja':
        this.getHoja();
        break;
    }
  }

  @HostListener("document:keydown.tab", []) unloadHandler2(event: Event) {
    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    console.log(`Elemento enfocado TAB: ${nombre_input}`);

    switch (nombre_input) {
      case 'focusPedido':
        this.focusMyInput();
        break;
    }
  }

  FormularioBusqueda: FormGroup
  dataform: any = '';
  num_hoja: number;
  cantidad: number;
  pedido: number;
  pedidoInicial: number;
  empaque_view = false;
  item_valido: boolean;
  validacion: boolean = false;
  empaque_item_codigo: string;
  empaque_item_descripcion: string;
  empaque_descripcion_concat: string;
  messages: any = [];
  BD_storage: any;
  agencia: any;
  userConn: any;
  precio_input: any;
  usuario_logueado: string = "";
  valorCelda: any;
  tamanio_lista_item_pedido: any;

  item: any = 0;
  item_set: any;
  codigo_item: any;
  descripcion_item: string = "";
  medida_item: string = "";
  porcen_item: string = "";
  no_venta: string = "";
  si_venta: string = "";

  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  id_tipo: any = [];
  hojas: any = [];
  item_obtenido: any = [];
  almacenes_saldos: any = [];
  empaquesItem: any = [];
  data_almacen_local: any = [];
  array_items_seleccionados: any = [];
  array_items_proforma_matriz: any = [];
  array_items_seleccionados_length: number = 0;
  array_items_completo: any = [];
  dataItemsSeleccionadosMultiple: any = [];
  items_post: any = [];
  lista_hojas: any = [];
  elementoActual = this.lista_hojas[0];
  item_seleccionados_catalogo_matriz: any = [];
  array_items_completo_multiple: any = [];

  tarifa_get: any;
  descuento_get: any;
  codcliente_get: any;
  codalmacen_get: any;
  desc_linea_seg_solicitud_get: any;
  fecha_get: any;
  codmoneda_get: any;
  descuento_nivel_get: any;

  contador: number = 0;
  codigo_item_celda: any;

  izquierda: string = "izquierda";
  derecha: string = "derecha";

  output: string;

  @ViewChild("focusPedido") focusPedido1: ElementRef;

  constructor(private api: ApiService, public dialog: MatDialog, public dialogRef: MatDialogRef<MatrizItemsComponent>,
    public itemservice: ItemServiceService, public renderer: Renderer2,
    private toastr: ToastrService, public saldoItemServices: SaldoItemMatrizService,
    public serviciof9: ServicioF9Service, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public tarifa: any, @Inject(MAT_DIALOG_DATA) public descuento: any,
    @Inject(MAT_DIALOG_DATA) public codcliente: any, @Inject(MAT_DIALOG_DATA) public codalmacen: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea_seg_solicitud: any, @Inject(MAT_DIALOG_DATA) public fecha: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any, @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public descuento_nivel: any) {

    this.array_items_proforma_matriz = items.items;
    console.log(this.array_items_proforma_matriz);

    this.pedidoInicial = 0;
    this.cantidad = this.pedido;

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.agencia = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;

    if (this.BD_storage.bd === 'Loc') {
      this.BD_storage.bd = '311'
    }

    if (this.agencia === 'Loc') {
      this.agencia = '311'
    }

    this.tarifa_get = tarifa.tarifa;
    this.descuento_get = descuento.descuento;
    this.codcliente_get = codcliente.codcliente;
    this.codalmacen_get = codalmacen.codalmacen;
    this.desc_linea_seg_solicitud_get = desc_linea_seg_solicitud.desc_linea_seg_solicitud;
    this.fecha_get = fecha.fecha;
    this.codmoneda_get = codmoneda.codmoneda;
    this.descuento_nivel_get = descuento_nivel.descuento_nivel;

    console.log(
      "CODCLIENTE" + this.codcliente_get,
      "TARIFA: " + this.tarifa_get,
      "DESCT: " + this.descuento_get,
      "CODALM: " + this.codalmacen_get,
      "DESCT_LINEA: " + this.desc_linea_seg_solicitud_get,
      "FECHA: " + this.fecha_get,
      "CODMONEDA: " + this.codmoneda_get,
    );

    console.log(this.num_hoja);

    this.num_hoja = this.num_hoja;

    if (this.num_hoja === undefined || this.num_hoja === 0) {
      this.getHojaPorDefecto();
    }
    this.listaHojas();
  }

  ngOnInit() {
    this.dataItemsSeleccionadosMultiple = [];
    console.log(this.dataItemsSeleccionadosMultiple);
    // this.setFocus();

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

    //Items seleccionados
    this.itemservice.disparadorDeItemsSeleccionadosAProforma.subscribe(datav => {
      console.log("Recibiendo Items Seleccionados Multiple Procesados Para El Carrito: ", datav);
      this.item_seleccionados_catalogo_matriz = datav;

      console.log(this.item_seleccionados_catalogo_matriz);

      this.addItemArraySeleccion(this.item_seleccionados_catalogo_matriz);
    });
    //

    //Items seleccionados
    // this.itemservice.disparadorDeItemsSeleccionadosAProforma.subscribe(datav => {
    //   console.log("Recibiendo Items Seleccionados Multiple Procesados Para El Carrito: ", datav);
    //   this.item_seleccionados_catalogo_matriz = datav;

    //   this.item_seleccionados_catalogo_matriz;

    //   this.addItemArraySeleccion(this.item_seleccionados_catalogo_matriz);
    // });
    //

    this.tamanio_lista_item_pedido = this.array_items_proforma_matriz.length;
    this.array_items_seleccionados_length = this.array_items_seleccionados.length;

    console.log(this.tamanio_lista_item_pedido, this.array_items_seleccionados_length);


  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    // Realizamos todas las validaciones
    if (this.codmoneda_get === '') {
      this.validacion = true;
      this.messages.push("SELECCIONE MONEDA");
    }
    if (this.codcliente_get === undefined || this.codcliente_get === '') {
      this.validacion = true;
      this.messages.push("SELECCIONE CLIENTE EN PROFORMA");
    }
    if (this.codalmacen_get === '') {
      this.validacion = true;
      this.messages.push("SELECCIONE ALMACEN");
    }

    // Mostramos los mensajes de validación concatenados
    if (this.validacion) {
      this.toastr.error('¡' + this.messages.join(', ') + '!');
    }

    console.log(this.array_items_completo);

    const focusedElement = document.activeElement as HTMLElement;
    let nombre_input = focusedElement.id;
    console.log(`Elemento Enfocado: ${nombre_input}`);

    //this.myInputField.nativeElement.focus();
    this.focusMyInput();
  }

  onCellClick1(item: any): void {
    console.log("adentro");
    // aca llega el item y se guarda en la varialbe this.item
    // se le quita el espacio del final
    // this.getSaldoItem(this.item);

    const cleanText = item.replace(/\s+/g, "").trim();
    this.codigo_item_celda = cleanText;
    console.log(this.codigo_item);

    this.item = cleanText.toUpperCase();
    this.getlineaProductoID(cleanText);
    this.validarItemParaVenta(cleanText);
    this.getEmpaqueItem(cleanText);
    this.getAlmacenesSaldos();
    this.getSaldoEmpaquePesoAlmacenLocal(cleanText);
    //this.mandarItemF9(cleanText);
  }

  getSaldoEmpaquePesoAlmacenLocal(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/pesoEmpaqueSaldo/' + this.userConn + "/" + this.descuento_get + "/" + this.codalmacen_get + "/" + item + "/" + this.codalmacen_get + "/" + this.BD_storage.bd)
      .subscribe({
        next: (datav) => {
          this.data_almacen_local = datav;
          console.log(this.data_almacen_local);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.data_almacen_local.saldo = 0;
          //this.toastr.error('¡CELDA NO VALIDA!');
        },
        complete: () => {
        }
      })
  }

  // tableSettings: any = {
  //   rowHeaders: true,
  //   enterBeginsEditing:false,
  //   // colHeaders: true,
  //   // viewportColumnRenderingOffset: 27,
  //   // viewportRowRenderingOffset: 'auto',
  //   // colWidths: 150,
  //   // height: 450,
  //   // allowInsertColumn: false,
  //   // allowInsertRow: false,
  //   // allowRemoveColumn: false,
  //   // allowRemoveRow: false,
  //   //autoWrapRow: true,
  //   //autoWrapCol: true,
  //   // stretchH: "all",
  //   // width: 1000,
  //   // height: 1000,
  //   maxRows: 60,
  //   manualRowResize: true,
  //   manualColumnResize: true,
  //   licenseKey: 'non-commercial-and-evaluation',
  //   beforeKeyDown: function(e) {
  //     console.log(e);
  //     switch (e.key) { 
  //       case 'Enter':
  //         console.log("Hola lola ENTER");
  //         break;
  //       case 'F9':
  //         console.log("Hola lola F9");
  //       break;
  //     }
  //   },

  //   afterChange: function (hotInstance, changes, source) {
  //     console.log('CAMBIOS: ', hotInstance);
  //     console.log('CAMBIOS: ', changes);
  //     console.log('CAMBIOS: ', source);
  //   },

  //   colHeaders: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
  //   manualRowMove: false,
  //   manualColumnMove: false,
  //   contextMenu: true,
  //   filters: true,
  //   dropdownMenu: true,
  //   afterValidate: function (isValid, value, row, prop) {
  //     if (value == false) {
  //       console.log(value);
  //       alert('Invalid');
  //       //Value = isValid
  //       // row = inserted invalid value
  //       //prop = row index changed
  //     }
  //   },
  // };

  getHoja() {
    console.log(this.num_hoja);

    if (this.num_hoja != 0 || this.num_hoja != undefined) {
      let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/";
      return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/" + this.num_hoja)
        .subscribe({
          next: (datav) => {
            this.hojas = datav;
            console.log(this.hojas);
            this.initHandsontable(this.hojas);
          },

          error: (err: any) => {
            console.log(err, errorMessage);
          },
          complete: () => { }
        })
    } else {
      console.log("el this.num_hoja es 0");
    }
  }

  getHojaPorDefecto() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/01")
      .subscribe({
        next: (datav) => {
          this.hojas = datav;
          //console.log(this.hojas);
          this.initHandsontable(this.hojas);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  listaHojas() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/hojas/";
    return this.api.getAll('/inventario/mant/inmatriz/hojas/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.lista_hojas = datav;
          //console.log(this.lista_hojas);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  initHandsontable(hojas): void {
    var self = this;

    const container = document.getElementById('example');
    const hot = new Handsontable(container, {

      data: hojas,
      manualRowResize: false,
      manualColumnResize: false,
      dropdownMenu: true,
      contextMenu: false,
      filters: true,
      licenseKey: 'non-commercial-and-evaluation',
      rowHeaders: false,
      colHeaders: true,
      selectionMode: 'multiple',
      columns: [
        {
          data: 'a',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'b',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'c',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'd',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'e',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'f',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'f',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'g',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'h',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'i',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'j',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'l',
          type: 'text',
          readOnly: true,
        },
        {
          data: 'm',
          type: 'text',
          readOnly: true,
        },
      ],
      className: 'my-custom-row-class',

      beforeKeyDown: function (e) {
        switch (e.key) {
          case 'Enter':
            console.log("ENTER PARA ENVIAR ITEM A CARRITO");
            // this.focusPedido();
            // this.focusPedido.nativeElement.focus();
            // this.render.selectRootElement('#focusPedido').focus();
            // this.input1.nativeElement.focus();
            // this.setFocus();
            self.focusPedido();
            this.focusPedido();
            break;
          case 'backspace':
            console.log("Hola lola BACKSPACE");
            break;
          case 'F9':
            self.modalStockActualF9();
            console.log("Hola lola modalStockActualF9");
        }
      }
    });

    hot.addHook('afterSelectionEnd', () => {
      const selectedCoords = hot.getSelected();
      if (selectedCoords) {
        const [startRow, startCol] = selectedCoords[0];
        // console.log('Coordenada de la celda seleccionada:', startRow, startCol);
        // Obtener la data de la celda seleccionada
        const cellData = hot.getDataAtCell(startRow, startCol);
        this.valorCelda = cellData;
        console.log('Data de la celda seleccionada:', cellData);

        this.onCellClick1(cellData);
      }
    });

    hot.addHook('afterSelectionEndByProp', () => {
      const selectedRanges = hot.getSelectedRange();
      // Verificar si se ha seleccionado algún rango
      if (selectedRanges && selectedRanges.length > 0) {
        const data = [];

        // Iterar sobre cada rango seleccionado
        selectedRanges.forEach((selectedRange) => {
          const startRow = Math.min(selectedRange.from.row, selectedRange.to.row);
          const endRow = Math.max(selectedRange.from.row, selectedRange.to.row);
          const startCol = Math.min(selectedRange.from.col, selectedRange.to.col);
          const endCol = Math.max(selectedRange.from.col, selectedRange.to.col);

          // Iterar sobre las celdas dentro del rango y agregar sus valores al array
          for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
              const cellValue = hot.getDataAtCell(row, col);
              data.push(cellValue.replace(/\s+/g, " ").trim());
            }
          }
        });

        this.dataItemsSeleccionadosMultiple = data;
        console.log('Valores de los rangos seleccionados:', this.dataItemsSeleccionadosMultiple);
      } else {
        console.log('No se ha seleccionado ningún rango.');
      }
    });
  }

  focusPedido() {
    this.renderer.selectRootElement('#focusPedido').focus();
  }

  focusCantidad() {
    this.renderer.selectRootElement('#focusCantidad').focus();
  }

  focusMyInput() {
    this.focusPedido1.nativeElement.focus();
  }

















  addItemArray() {
    //aca es cuando el focus esta en pedido y se le da enter para que agregue al carrito
    const cleanText = this.valorCelda.replace(/\s+/g, " ").trim();

    this.array_items_seleccionados;
    let array = {
      coditem: cleanText,
      tarifa: this.tarifa_get,
      descuento: this.descuento_get,
      cantidad_pedida: this.pedido,
      cantidad: this.cantidad === undefined ? this.pedido : this.cantidad,
      opcion_nivel: "",
      codalmacen: this.codalmacen_get,
      codcliente: this.codcliente_get === undefined ? "0" : this.codcliente_get,
      desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
      codmoneda: this.codmoneda_get,
      fecha: this.fecha_get,
    };
    console.log(array);

    let existe = this.array_items_completo.some(item => item.coditem === array.coditem);
    console.log(this.valorCelda, cleanText);

    // if (this.valorCelda === undefined) {
    //   this.toastr.warning('¡CELDA NO VALIDA!');
    //   return;
    // }

    if (existe) {
      console.log("El item ya existe en el array.");
      //this.toastr.warning('¡EL ITEM YA ESTA EN PEDIDO!');
      return;
    }

    if (!this.item_valido) {
      console.log('¡EL ITEM NO ESTA EN VENTA!');
      //this.toastr.error('¡EL ITEM NO ESTA EN VENTA!');
      return;
    }

    if (this.pedido === 0 || this.pedido === undefined) {
      // this.toastr.warning('¡La cantidad y el pedido no pueden ser 0!');
      return;
    }

    if (this.array_items_seleccionados_length === undefined) {
      this.array_items_seleccionados.push(array);
    }
    // else {
    //   this.array_items_proforma_matriz.push(array);
    // }

    //ACA SE AGREGA CUANDO ELIJES SOLO 1 ITEM
    this.array_items_completo = this.array_items_seleccionados.concat(this.array_items_proforma_matriz);

    //LONGITUD DEL CARRITO DE COMPRAS
    this.tamanio_lista_item_pedido = this.array_items_completo.length;

    console.log("ITEM SELECCIONADO UNITARIO:" + JSON.stringify(this.array_items_seleccionados), "ITEM'S SELECCION MULTIPLE:" + JSON.stringify(this.array_items_proforma_matriz));
    console.log("ARRAY CONCATENADO: " + this.array_items_completo);
  }

  addItemArraySeleccion(items_seleccionados_seleccion) {
    this.item_seleccionados_catalogo_matriz = items_seleccionados_seleccion;

    //aca se agregan los items de seleccion multiple al carrito ya mapeado
    this.array_items_completo_multiple = items_seleccionados_seleccion;

    //ACA SE AGREGA CUANDO ELIJES SOLO 1 ITEM al carrito concatenando cuando elijes solo 1 xD
    this.array_items_completo = this.array_items_seleccionados.concat(this.array_items_completo_multiple);

    //aca se pone el numerito que indica el total de los items que hay en el carrito
    this.tamanio_lista_item_pedido = this.array_items_completo.length;


    // this.item_seleccionados_catalogo_matriz.forEach(element => {
    //   console.log("ITEMS DEL CARRO BTN CONFRIMAR: " + JSON.stringify(element));
    // });
  }

  eliminarItemArrayPedido(item) {
    console.log("Item a eliminar:", item);
    this.array_items_completo = this.array_items_completo.filter(i => i.coditem !== item);
    this.tamanio_lista_item_pedido = this.array_items_completo.length;

    this.array_items_proforma_matriz = this.array_items_proforma_matriz.filter(i => i.coditem !== item);
    this.array_items_seleccionados = this.array_items_seleccionados.filter(i => i.coditem !== item);
  }

  mandarItemaProforma() {
    //ESTE FUNCION ES DEL BOTON CONFIRMAR DEL CARRITO
    //aca se tiene q mapear los items que me llegan en la funcion

    let a = this.array_items_completo.map((elemento) => {
      console.log(elemento);
      // console.log(elemento.niveldesc);
      return {
        coditem: elemento.coditem,
        tarifa: this.tarifa_get,
        descuento: this.descuento_get,
        cantidad_pedida: elemento.cantidad_pedida,
        cantidad: elemento.cantidad,
        codcliente: this.codcliente_get,
        opcion_nivel: elemento.niveldesc === undefined ? "ACTUAL" : "ANTERIOR",
        codalmacen: this.codalmacen_get,
        desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
        codmoneda: this.codmoneda_get,
        fecha: this.fecha_get,
      }
    });

    console.log(a);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";
    return this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn, a)
      .subscribe({
        next: (datav) => {
          this.items_post = datav;
          console.log("BOTON CONFIRMAR DEL CARRITO INFO: ", datav);
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          // ACA SE ENVIA A LA PROFORMA EN EL SERVICIO enviarItemsAlServicio();
          this.enviarItemsAlServicio(this.items_post, this.array_items_completo);
          this.dialogRef.close();
          this.num_hoja = 0;
        }
      })
  }






























  enviarItemsAlServicio(items: any[], items_sin_proceso: any[]) {
    this.itemservice.enviarItems(items);

    this.itemservice.enviarItemsSinProcesar(items_sin_proceso);
  }

  limpiarMatriz() {
    this.data_almacen_local = [];
    this.item_obtenido = [];
    this.empaquesItem = [];
    this.almacenes_saldos = [];
    this.array_items_seleccionados = [];
    this.array_items_completo = [];

    this.item_set = "";
    this.descripcion_item = "";
    this.medida_item = "";
    this.porcen_item = "";

    this.pedido = undefined;
    this.cantidad = undefined;
    this.num_hoja = undefined;
    this.tamanio_lista_item_pedido = 0;
  }

  validarItemParaVenta(value) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getItemParaVta/' + this.userConn + "/" + value)
      .subscribe({
        next: (datav) => {
          this.item_valido = datav;
          console.log('item valido: ', this.item_valido);
          if (this.item_valido == true) {
            this.getlineaProductoID(value);
          } else {
            // this.toastr.warning('!ITEM NO VALIDO PARA LA VENTA!');
            this.no_venta = "ITEM NO VENTA";
            this.si_venta = "";
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          // this.toastr.warning('SELECCIONE UN ITEM');
          this.si_venta = "ITEM VENTA";
          this.no_venta = "";
          this.descripcion_item = '';
          this.medida_item = '';
          this.porcen_item = '';

          this.empaquesItem = [];
        },
        complete: () => { }
      })
  }

  getlineaProductoID(value) {
    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";

    const cleanText = value.replace(/\s+/g, "").trim();
    let item1 = cleanText.toUpperCase();

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inmatriz/infoItemRes/";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + this.agencia + "/" + item1)
      .subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
          console.log('item seleccionado: ', this.item_obtenido);

          this.codigo_item = this.item_obtenido.codigo;
          this.descripcion_item = this.item_obtenido.descripcion;
          this.medida_item = this.item_obtenido.medida;
          this.porcen_item = this.item_obtenido.porcen_maximo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.item_valido = false;
          console.log(this.item_valido);
        },
        complete: () => {
        }
      })
  }

  getEmpaqueItem(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .subscribe({
        next: (datav) => {
          this.empaquesItem = datav;
          //console.log(this.empaquesItem);
          this.empaque_view = true;

          this.empaque_item_codigo = this.empaquesItem.codigo;
          this.empaque_item_descripcion = this.empaquesItem.descripcion;
          this.cantidad = this.empaquesItem.cantidad;

          this.empaque_descripcion_concat = "(" + this.empaque_item_codigo + ")" + this.empaque_item_descripcion + "-" + this.cantidad + " | ";
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacenesSaldos() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCodAlmSlds/";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          console.log("Almacenes Parametros: ", this.almacenes_saldos);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  pasarHoja(lado: string, numero_hoja) {
    console.log(numero_hoja);

    switch (lado) {
      case "derecha":
        const indiceActual1 = this.lista_hojas.indexOf(numero_hoja);
        const siguienteIndice1 = (indiceActual1 + 1) % this.lista_hojas.length;
        this.elementoActual = this.lista_hojas[siguienteIndice1];
        this.num_hoja = this.elementoActual;

        console.log(this.elementoActual);
        this.getAllHojaControls(this.elementoActual);
        break;
      case "izquierda":
        const indiceActual = this.lista_hojas.indexOf(numero_hoja);
        const siguienteIndice = (indiceActual - 1) % this.lista_hojas.length;
        this.elementoActual = this.lista_hojas[siguienteIndice];
        this.num_hoja = this.elementoActual;

        console.log(this.elementoActual);
        this.getAllHojaControls(this.elementoActual);
    }
  }

  getAllHojaControls(hoja) {
    console.log(hoja);
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inmatriz/";
    return this.api.getAll('/inventario/mant/inmatriz/' + this.userConn + "/" + hoja)
      .subscribe({
        next: (datav) => {
          this.hojas = datav;
          console.log(this.hojas);
          this.initHandsontable(this.hojas);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      data: { cod_almacen: cod_almacen, cod_item: this.item, posicion_fija: posicion_fija },
    });
  }

  modalStockActualF9() {
    this.dialog.open(StockActualF9Component, {
      width: 'auto',
      height: '55vh',
      data: { cod_item_celda: this.codigo_item }
    });
  }

  seleccionMultipleItemHotTable() {
    this.dialog.open(ItemSeleccionCantidadComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataItemSeleccionados: this.dataItemsSeleccionadosMultiple,
        tarifa: this.tarifa_get,
        descuento: this.descuento_get,
        codcliente: this.codcliente_get,
        codalmacen: this.codalmacen_get,
        desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
        codmoneda: this.codmoneda_get,
        fecha: this.datePipe.transform(this.fecha_get, "yyyy-MM-dd"),
      },
    });

    console.log(this.dataItemsSeleccionadosMultiple);
  }

  close() {
    let tamanio = this.array_items_completo.length;
    console.log(tamanio);

    if (tamanio > 0) {
      const resultado: boolean = window.confirm("HAY ITEMS EN EL CARRITO!, SEGURO QUE DESEA SALIR?");
      if (resultado) {
        console.log("El usuario hizo clic en Aceptar.");
        this.dialogRef.close();
      } else {
        console.log("El usuario hizo clic en Cancelar.");
      }
    } else {
      this.dialogRef.close();
    }
  }
}