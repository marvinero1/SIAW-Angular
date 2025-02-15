import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '@services/api.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import * as XLSX from 'xlsx';
import { ExceltoexcelService } from './servicio-excel-to-excel/exceltoexcel.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-exceltoexcel',
  templateUrl: './exceltoexcel.component.html',
  styleUrls: ['./exceltoexcel.component.scss']
})
export class ExceltoexcelComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();
  public array_items_carrito_y_f4_catalogo: any = [];
  public array_info_excel: any = [];

  archivo: any;
  nombre_archivo: any;

  columnaItems: string;
  desdeItems: number;
  hastaItems: number;

  columnaValorCantidadItems: string;
  columnaDesdeValorCantidadItems: number;
  columnaHastaValorCantidadItems: number;

  ventana_origen_get: any;

  userConn: any;

  constructor(private api: ApiService, private excelService: ExceltoexcelService,
    public dialogRef: MatDialogRef<ExceltoexcelComponent>, private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public ventana_origen: any) {

    this.ventana_origen_get = ventana_origen.ventana_origen;
    console.log("🚀 ~ ExceltoexcelComponent ~ @Inject ~ this.ventana_origen_get:", this.ventana_origen_get)

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

  }

  ngOnInit() {
  }


  cargarDataExcel(event: any) {
    this.archivo = event.target.files[0];
    this.nombre_archivo = event.target.files[0].name;
    console.log("🚀 ~ ExceltoexcelComponent ~ cargarDataExcel ~ this.archivo:", this.archivo)
    if (!this.archivo) return;
  }

  leerExcel() {
    if (!this.archivo) return; // Asegurar que hay un archivo cargado

    if (this.desdeItems === undefined && this.hastaItems === undefined) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'INGRESE DATOS EN COLUMNA DESDE Y HASTA' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const nombreHoja = workbook.SheetNames[0]; // Tomamos la primera hoja
      const hoja = workbook.Sheets[nombreHoja];

      // 🔥 Definir las coordenadas del rango
      const inicio = { col: this.columnaItems, row: this.desdeItems };
      const fin = { col: this.columnaItems, row: this.hastaItems };
      console.log("🚀 ~ ExceltoexcelComponent ~ leerExcel ~ inicio:", inicio)
      console.log("🚀 ~ ExceltoexcelComponent ~ leerExcel ~ fin:", fin)

      const valores_items_inicio = { col: this.columnaValorCantidadItems, row: this.desdeItems };
      const valores_items_fin = { col: this.columnaValorCantidadItems, row: this.hastaItems };
      console.log("🚀 ~ ExceltoexcelComponent ~ leerExcel ~ valores_items_inicio:", valores_items_inicio)
      console.log("🚀 ~ ExceltoexcelComponent ~ leerExcel ~ valores_items_fin:", valores_items_fin)

      // Extraer el rango de celdas
      const dataExtraida = this.extraerRangoItems(hoja, inicio, fin);
      const dataExtraidaValoresItems = this.extraerRangoItems(hoja, valores_items_inicio, valores_items_fin);

      const array_completo = dataExtraida.map((element, index) => ({
        descripcion: "",
        medida: "",
        udm: "",
        codaduana: "",
        coditem: element,
        cantidad: dataExtraidaValoresItems[index] || 0,
      }));

      //this.array_info_excel = array_completo;
      console.log("🚀 ~ NotamovimientoComponent ~ cargarDataExcel ~ array_completo:", array_completo);
      this.getDescripcMedidaItem(array_completo);
    };

    reader.readAsArrayBuffer(this.archivo);
  }

  // 📌 Función para extraer un rango de celdas
  extraerRangoItems(hoja: XLSX.WorkSheet, inicio: { col: string; row: number }, fin: { col: string; row: number }): any[] {
    const data = [];
    const columnas = this.generarColumnas(inicio.col, fin.col); // Genera ['A'] si es un solo col

    for (let fila = inicio.row; fila <= fin.row; fila++) {
      for (const col of columnas) {
        const celda = hoja[`${col}${fila}`];
        data.push(celda ? celda.v : ''); // 🔥 Mete todo en un solo array
      }
    }

    return data;
  }

  // 📌 Generar un array de columnas (de 'A' a 'Y')
  generarColumnas(inicio: string, fin: string): string[] {
    const cols = [];
    for (let i = XLSX.utils.decode_col(inicio); i <= XLSX.utils.decode_col(fin); i++) {
      cols.push(XLSX.utils.encode_col(i));
    }
    return cols;
  }

  getDescripcMedidaItem(array) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/CargardeProforma/";
    return this.api.create('/inventario/transac/docinmovimiento/getDescMedDetalle/' + this.userConn, array)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ NotamovimientoComponent ~ getDescripcMedidaItem ~ datav:", datav);
          this.array_items_carrito_y_f4_catalogo = datav;

          // ACA DEPENDE DE QUE VENTANA ES ORIGEN PARA PODER ENVIAR A SU VENTANA PADRE CORRESPONDIENTE
          if (this.ventana_origen_get === "nota_movimiento") {
            //ACA EL SERVICIO QUE LO ENVIE
            this.excelService.disparadorDeNotaMovimiento.emit({
              NMDetalle: this.array_items_carrito_y_f4_catalogo,
            });
          }

          if (this.ventana_origen_get === "proforma") {
            //ACA EL SERVICIO QUE LO ENVIE
            this.excelService.disparadorDeProforma.emit({
              PFDetalle: this.array_items_carrito_y_f4_catalogo,
            });
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          this.close();
        }
      })
  }

  close() {
    this.dialogRef.close();
  }

}
