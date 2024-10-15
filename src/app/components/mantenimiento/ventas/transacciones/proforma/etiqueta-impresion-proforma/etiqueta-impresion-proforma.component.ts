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

  cod_cliente_get: any;
  cod_cliente_real_get: any;

  representante_string_acortado: string;
  nom_factura_string_acortado: string;

  constructor(public nombre_ventana_service: NombreVentanaService, private api: ApiService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.data_impresion = sessionStorage.getItem("data_impresion") !== undefined ? JSON.parse(sessionStorage.getItem("data_impresion")) : null;

    this.getDataPDF();
    this.mandarNombre();

    console.log(this.data_impresion);
    this.cod_cliente_get = this.data_impresion[0].cod_cliente;
    this.cod_cliente_real_get = this.data_impresion[0].cod_cliente_real;
  }

  ngOnInit(): void {
  }

  getDataPDF() {
    let array_send={
      codProforma: this.data_impresion[0].codigo_proforma,
      codcliente: this.data_impresion[0].cod_cliente ,
      codcliente_real: this.data_impresion[0].cod_cliente_real,
      codempresa: this.BD_storage,
      cmbestado_contra_entrega: this.data_impresion[0].cmbestado_contra_entrega.toString(),
      paraAprobar: this.data_impresion[0].grabar_aprobar
    };

    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.create('/venta/transac/veproforma/getDataPDF/' + this.userConn, array_send)
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);

          this.data_etiqueta = datav.dt_etiqueta
          let string_representante = datav.dt_etiqueta.representante;
          let string_nom_factura = datav.dt_etiqueta.nom_factura;

          console.warn(string_representante);

          this.nombre_guardar = datav.docveprofCab.titulo + "-" + datav.docveprofCab.rcodcliente;
          this.representante_string_acortado = this.truncateString(string_representante, 55);
          this.nom_factura_string_acortado = this.truncateString(string_nom_factura, 22);

          console.warn("acortado:", string_representante);
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

  truncateString(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }

    // Corta hasta el máximo permitido y luego encuentra el último espacio
    const truncatedText = text.slice(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');

    // Si no hay espacios, retorna el texto truncado tal como está, de lo contrario, corta en el último espacio
    return lastSpaceIndex > 0 ? truncatedText.slice(0, lastSpaceIndex) : truncatedText;
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
