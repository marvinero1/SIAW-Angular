import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { ExceltoexcelComponent } from '@components/uso-general/exceltoexcel/exceltoexcel.component';
import { ExceltoexcelService } from '@components/uso-general/exceltoexcel/servicio-excel-to-excel/exceltoexcel.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';

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


  FormularioData: FormGroup;
  id_sol_urgente: any;
  numero_id_sol_urgente: any;







  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService, private _formBuilder: FormBuilder,
    private almacenservice: ServicioalmacenService, private excelService: ExceltoexcelService, private datePipe: DatePipe, private router: Router,
    private messageService: MessageService, private spinner: NgxSpinnerService) {
    
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
    
  }

  ngOnInit() {
    
  }

  get f() {
    return this.FormularioData.controls;
  }

  limpiar() { 

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
































  modalExcelToExcel() {
    //PARA EL EXCEL TO EXCEL SE LE PASA EL ORIGEN DE LA VENTANA PARA QUE EL SERVICIO SEPA A QUE VENTANA DEVOLVER 
    // LA DATA XDXD
    this.dialog.open(ExceltoexcelComponent, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana_origen: 'solicitud_mercaderia_urgente'
      }
    });
  }

  modalTipoIDSolUrgente() { 
    //PARA EL EXCEL TO EXCEL SE LE PASA EL ORIGEN DE LA VENTANA PARA QUE EL SERVICIO SEPA A QUE VENTANA DEVOLVER 
    // LA DATA XDXD
    this.dialog.open(ExceltoexcelComponent, {
      width: '800px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana_origen: 'solicitud_mercaderia_urgente'
      }
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
}
