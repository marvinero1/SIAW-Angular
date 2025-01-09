import { Component, HostListener, Inject, OnInit, ViewChild, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { Item } from '@services/modelos/objetos';
import { Observable, BehaviorSubject } from 'rxjs';
import { ItemServiceService } from '../serviciosItem/item-service.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-items',
  templateUrl: './modal-items.component.html',
  styleUrls: ['./modal-items.component.scss']
})
export class ModalItemsComponent implements OnInit, AfterViewInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarItem(this.item_view);
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarItem(this.item_view);
  };

  fecha_actual = new Date();
  item_get: any = [];
  items: any = [];
  item_valido: any = [];
  item_obtenido: any = [];
  empaquesItem: any = [];
  item_view: any = [];
  BD_storage: any = [];
  descuento_nivel_get: any = [];
  itemParaTabla: any = [];
  messages: string[] = [];
  array_items_proforma_matriz: any = [];
  array_items_proforma_matriz_concat: any = [];

  userConn: any;
  value: any;
  usuario_logueado: string = "";
  agencia: any;
  btn_confirmar: boolean = false;
  validacion: boolean = false;

  displayedColumns = ['codigo', 'descripcion', 'medida'];

  dataSource = new MatTableDataSource<Item>();
  dataSourceWithPageSize = new MatTableDataSource();  

  options: Item[] = [];
  filteredOptions: Observable<Item[]>;
  myControlCodigo = new FormControl<string | Item>('');
  myControlDescripcion = new FormControl<string | Item>('');
  myControlMedida = new FormControl<string | Item>('');
  myControlMedidaEnLinea = new FormControl<string | Item>('');

  tarifa_get: any;
  descuento_get: any;
  codcliente_get: any;
  codalmacen_get: any;
  desc_linea_seg_solicitud_get: any;
  fecha_get: any;
  codmoneda_get: any;
  
  private selectedIndexSubject = new BehaviorSubject<number>(0);
  selectedIndex$ = this.selectedIndexSubject.asObservable();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  @ViewChildren('rowElement') rowElements: QueryList<ElementRef>;
  
  constructor(private api: ApiService, public dialogRef: MatDialogRef<ModalItemsComponent>, private messageService: MessageService,
    private servicioItem: ItemServiceService, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public tarifa: any,
    @Inject(MAT_DIALOG_DATA) public descuento: any,
    @Inject(MAT_DIALOG_DATA) public codcliente: any,
    @Inject(MAT_DIALOG_DATA) public codalmacen: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea_seg_solicitud: any,
    @Inject(MAT_DIALOG_DATA) public fecha: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any,
    @Inject(MAT_DIALOG_DATA) public itemss: any,
    @Inject(MAT_DIALOG_DATA) public descuento_nivel: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;


    this.tarifa_get = tarifa.tarifa;
    this.descuento_get = descuento.descuento;
    this.codcliente_get = codcliente.codcliente;
    this.codalmacen_get = codalmacen.codalmacen;
    this.desc_linea_seg_solicitud_get = desc_linea_seg_solicitud.desc_linea_seg_solicitud;
    this.fecha_get = fecha.fecha;
    this.codmoneda_get = codmoneda.codmoneda;
    //this.array_items_proforma_matriz = itemss.itemss;
    this.descuento_nivel_get = descuento_nivel.descuento_nivel;

    console.log(
      "COD CLIENTE: " + this.codcliente_get,
      "TARIFA: " + this.tarifa_get,
      "DESCT: " + this.descuento_get,
      "CODALM: " + this.codalmacen_get,
      "DESCT_LINEA: " + this.desc_linea_seg_solicitud_get,
      "FECHA: " + this.fecha_get,
      "CODMONEDA: " + this.codmoneda_get,
      "DESCT. NIVEL: " + this.descuento_nivel_get,
    );
  }

  ngOnInit() {
    this.getCatalogoItems();
  }

  ngAfterViewInit(): void {
    //Add 'implements AfterViewInit' to the class.
    this.selectedIndex$.subscribe(index => {
      const rowElement = this.rowElements.toArray()[index];
      if (rowElement) {
        rowElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Realizamos todas las validaciones
    if (this.codmoneda_get === '') {
      this.validacion = true;
      this.messages.push("SELECCIONE MONEDA");
    }
    if (this.codcliente_get === undefined) {
      this.validacion = true;
      this.messages.push("SELECCIONE CLIENTE EN PROFORMA");
    }
    if (this.codalmacen_get === '') {
      this.validacion = true;
      this.messages.push("SELECCIONE ALMACEN");
    }
    if (this.descuento_nivel_get === undefined) {
      this.validacion = true;
      this.messages.push("SELECCIONE NIVEL DE DESCT.");
    }

    // Mostramos los mensajes de validación concatenados
    if (this.validacion) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡' + this.messages.join(', ') + '!' });
    }
  }

  handleKeydown(event: KeyboardEvent) {
    const dataLength = this.dataSource.data.length; // Obtener la longitud de los datos
    if (event.key === 'ArrowDown') {
      this.selectedIndexSubject.next((this.selectedIndexSubject.value + 1) % dataLength);
    } else if (event.key === 'ArrowUp') {
      this.selectedIndexSubject.next((this.selectedIndexSubject.value - 1 + dataLength) % dataLength);
    }
  }

  selectRow(index: number) {
    this.selectedIndexSubject.next(index);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let a = this.dataSource.filter = filterValue.trim().toUpperCase();

    this.dataSource = this.items.codigo.search(a);
  }

  applyFilterCodigo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toUpperCase();

    if (!filterValue) {
      this.dataSource.data = this.items;
      return;
    }
    const filteredItems = this.items.filter(item =>
      item.codigo.toUpperCase().startsWith(filterValue)
    );
    this.dataSource.data = filteredItems;
  }

  displayFn(user: Item): string {
    return user && user.codigo ? user.codigo : '';
  }

  getCatalogoItems() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/initem/catalogo2/";
    return this.api.getAll('/inventario/mant/initem/catalogo2/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.items = datav;
          this.dataSource = new MatTableDataSource(this.items);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getinMatrizByID(value) {
    console.log(value.codigo);

    this.item_view = value.codigo;
    const cleanText = this.item_view.replace(/\s+/g, "").trim();

    this.value = cleanText.toUpperCase();
    console.log(this.value);

    // this.getlineaProductoID(value);
    this.validarItemParaVenta(cleanText);
    // this.getSaldoItem(userConn, this.value)
  }

  validarItemParaVenta(value) {
    const cleanText = value.replace(/\s+/g, "").trim();
    console.log('item seleccionado:', cleanText);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getItemParaVta/' + this.userConn + "/" + cleanText)
      .subscribe({
        next: (datav) => {
          this.item_valido = datav;
          console.log('item valido: ', this.item_valido);

          if (this.item_valido == true) {
            this.btn_confirmar = true;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: '! ITEM NO VALIDO PARA LA VENTA !' });
            this.btn_confirmar = false;
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'SELECCIONE UN ITEM' });
        },
        complete: () => { }
      })
  }

  getlineaProductoID(value) {
    //se le quita el espacio en blanco que tiene
    const cleanText = value.replace(/\s+/g, "").trim();
    console.log('item seleccionado:', cleanText);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + "311" + "/" + cleanText)
      .subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarItem(item_codigo) {
    console.log(item_codigo);

    let dataItem: any = {
      coditem: item_codigo,
      tarifa: this.tarifa_get,
      descuento: this.descuento_get,
      cantidad_pedida: 0,
      cantidad: 0,
      opcion_nivel: this.descuento_nivel_get,
      codalmacen: this.codalmacen_get,
      codcliente: this.codcliente_get,
      desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
      codmoneda: this.codmoneda_get,
      fecha: this.fecha_get,
    };

    console.log(dataItem);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getItemMatriz_Anadir";
    return this.api.getAll(
      '/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/" + this.usuario_logueado + "/" + item_codigo + "/" + this.tarifa_get + "/" + this.descuento_get + "/" + 0 + "/" + 0 + "/" + this.codcliente_get + "/" + "NO" + "/" + this.agencia + "/" + this.descuento_nivel_get + "/" + this.codmoneda_get + "/" + this.fecha_get)
      .subscribe({
        next: (datav) => {
          this.itemParaTabla = datav;
          console.log(this.itemParaTabla);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => {
          this.enviarItemsAlServicio(this.itemParaTabla, dataItem);
          this.close();
        }
      })
  }

  enviarItemsAlServicio(items: any[], items_sin_proceso: any[]) {
    this.servicioItem.enviarItemCompletoAProformaF4(items);
    this.servicioItem.enviarItemsSinProcesarCatalogo(items_sin_proceso);
  }

  close() {
    this.dialogRef.close();
  }
}