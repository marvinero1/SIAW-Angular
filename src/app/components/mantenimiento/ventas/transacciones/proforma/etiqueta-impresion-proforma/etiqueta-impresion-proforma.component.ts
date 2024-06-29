import { Component, OnInit } from '@angular/core';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-etiqueta-impresion-proforma',
  templateUrl: './etiqueta-impresion-proforma.component.html',
  styleUrls: ['./etiqueta-impresion-proforma.component.css']
})
export class EtiquetaImpresionProformaComponent implements OnInit {

  codigo_get_proforma: any;
  ventana: string = "etiquetaImpresionProforma";
  public data_impresion: any = [];

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  nombre_guardar: string;

  data_etiqueta: any = [];
  data_detalle_proforma: any = [];
  data_cabecera_footer_proforma: any = [];

  constructor(public nombre_ventana_service: NombreVentanaService, private api: ApiService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.data_impresion = localStorage.getItem("data_impresion") !== undefined ? JSON.parse(localStorage.getItem("data_impresion")) : null;

    this.getDataPDF();
    this.mandarNombre();
  }

  ngOnInit(): void {
  }

  getDataPDF() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/" + this.data_impresion[0].codigo_proforma + "/" +
      this.data_impresion[0].cod_cliente + "/" + this.data_impresion[0].cod_cliente_real + "/" + this.BD_storage + "/" + this.data_impresion[0].estado_contra_entrega_input)
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_etiqueta = datav.dt_etiqueta

          this.nombre_guardar = datav.docveprofCab.titulo + "-" + datav.docveprofCab.rcodcliente;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.printFunction();
        }
      })
  }

  getDataPDFHARDCORE() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/120028/801406/801406/PE/PORCANCELAR")
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_etiqueta = datav.dt_etiqueta

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
          console.log("tamanio data: ", [datav].length);
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
          format: 'letter' // Formato Carta (Letter)
        });

        // Calcular el ancho y alto del PDF con márgenes
        const margin = 10;
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

        // Obtener el ancho y alto de la imagen en el canvas
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calcular la relación de aspecto de la imagen
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        // Calcular el nuevo ancho y alto de la imagen para mantener la proporción
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        // Agregar la imagen al PDF con márgenes
        pdf.addImage(imgData, 'JPEG', margin, margin, newWidth, newHeight);

        // Descargar el PDF
        pdf.save(this.nombre_guardar + '.pdf');
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
