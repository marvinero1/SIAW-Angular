import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-etiqueta-tuercas-proforma',
  templateUrl: './etiqueta-tuercas-proforma.component.html',
  styleUrls: ['./etiqueta-tuercas-proforma.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  //encapsulation: ViewEncapsulation.ShadowDom // O ViewEncapsulation.Emulated
})
export class EtiquetaTuercasProformaComponent implements OnInit {

  codigo_get_proforma: any;
  ventana: string = "etiquetasItemsProforma";
  public data_impresion: any = [];

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  data_cabecera_footer_proforma: any = [];
  data_detalle_proforma: any = [];
  tuercas_detalle: any = [];

  constructor(public nombre_ventana_service: NombreVentanaService, private api: ApiService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.data_impresion = sessionStorage.getItem("data_impresion") !== undefined ? JSON.parse(sessionStorage.getItem("data_impresion")) : null;

    this.mandarNombre();
    this.getDataPDF();
  }

  ngOnInit() {

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
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.docveprofCab

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
          this.tuercas_detalle = datav.ds_tuercas_lista;
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
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/120028/801406/801406/PE/PORCANCELAR")
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
      html2canvas(content, { scale: 5 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1); // Cambiado a JPEG con calidad 0.75

        // Crear un nuevo documento PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'letter' // Formato Carta (Letter)
        });

        // Calcular el ancho y alto del PDF con márgenes
        const margin = 2;
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
        pdf.save(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + "- ETIQUETAS_TUERCAS" + '.pdf');
      });
    }
  }

  printFunction() {
    const content = document.getElementById('content');
    if (content) {
      // // Ajustar la escala para mejorar la calidad de la imagen
      // html2canvas(content, { scale: 7 }).then((canvas) => {
      //   const imgData = canvas.toDataURL('image/jpeg', 1); // Cambiado a JPEG con calidad 0.75
  
      //   // Crear un nuevo documento PDF
      //   const pdf = new jsPDF({
      //     orientation: 'portrait',
      //     unit: 'mm',
      //     format: 'letter', // Formato Carta (Letter)
      //   });
  
      //   // Calcular el ancho y alto del PDF con márgenes
      //   const margin = 10;
      //   const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      //   const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;
  
      //   // Obtener el ancho y alto de la imagen en el canvas
      //   const imgWidth = canvas.width;
      //   const imgHeight = canvas.height;
  
      //   // Calcular la relación de aspecto de la imagen
      //   const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
      //   // Calcular el nuevo ancho y alto de la imagen para mantener la proporción
      //   const newWidth = imgWidth * ratio;
      //   const newHeight = imgHeight * ratio;
  
      //   // Agregar la imagen al PDF con márgenes
      //   pdf.addImage(imgData, 'JPEG', margin, margin, newWidth, newHeight);
  
      //   // Descargar el PDF
      //   const pdfBlob = pdf.output('blob'); // Convertir el PDF a un Blob
      //   const pdfUrl = URL.createObjectURL(pdfBlob); // Crear una URL para el Blob
  
        // Abrir el PDF en una nueva pestaña para imprimir
       // const pdfWindow = window.open(pdfUrl);
        // pdfWindow.onload = function() {
          window.print(); // Imprimir el PDF
          // pdfWindow.close();  // Cerrar la ventana después de imprimir (opcional)
        // };
  
        // También puedes descomentar la línea siguiente para guardar el PDF si es necesario
        // pdf.save(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + "- ETIQUETAS" + '.pdf');
      // });
    }    
  }


  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
