import { Component, OnInit } from '@angular/core';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-etiquetas-item-proforma',
  templateUrl: './etiquetas-item-proforma.component.html',
  styleUrls: ['./etiquetas-item-proforma.component.css']
})
export class EtiquetasItemProformaComponent implements OnInit {

  codigo_get_proforma: any;
  ventana: string = "etiquetasItemsProforma";
  public data_impresion: any = [];

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  data_cabecera_footer_proforma: any = [];
  data_detalle_proforma: any = [];

  constructor(public nombre_ventana_service: NombreVentanaService, private api: ApiService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.data_impresion = localStorage.getItem("data_impresion") !== undefined ? JSON.parse(localStorage.getItem("data_impresion")) : null;

    this.mandarNombre();
    this.getDataPDF();
  }

  ngOnInit() {

  }

  getDataPDF() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/" + this.data_impresion[0].codigo_proforma + "/" + this.data_impresion[0].cod_cliente + "/" + this.data_impresion[0].cod_cliente_real + "/" + this.BD_storage + "/" + "PORCANCELAR")
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.docveprofCab

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.printFunction();
        }
      })
  }

  getDataPDFHardcodiado() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/127601/303529/300012/PE/PORCANCELAR")
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          this.data_cabecera_footer_proforma = datav.docveprofCab
          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          // this.printFunction();
        }
      })
  }

  generatePDF() {
    const content = document.getElementById('content');
    if (content) {
      // Ajustar la escala para mejorar la calidad de la imagen
      html2canvas(content, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.75); // Cambiado a JPEG con calidad 0.75

        // Crear un nuevo documento PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'letter',
        });

        const margin = 4; // Ajustar para los márgenes deseados
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const newWidth = imgWidth * ratio * 0.7; // Reducir en un 0.7 para un 70%
        const newHeight = imgHeight * ratio * 0.7;

        // Agregar la imagen al PDF con márgenes
        pdf.addImage(imgData, 'JPEG', margin, margin, newWidth, newHeight);

        // Configurar la impresión con márgenes mínimos
        pdf.autoPrint(); // Establecer márgenes en mm

        // Desencadenar el diálogo de impresión
        window.print();
      });
    }
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  printFunction() {
    window.print();
  }
}
