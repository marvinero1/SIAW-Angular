import { Component, OnInit } from '@angular/core';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-proforma-pdf-email',
  templateUrl: './proforma-pdf-email.component.html',
  styleUrls: ['./proforma-pdf-email.component.css']
})
export class ProformaPdfEmailComponent implements OnInit {

  codigo_get_proforma: any;
  ventana: string = "proformaPDF";

  public data_impresion: any = [];

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  data_cabecera_footer_proforma: any = [];
  data_detalle_proforma: any = [];

  constructor(public nombre_ventana_service: NombreVentanaService, private api: ApiService, private toastr: ToastrService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.data_impresion = localStorage.getItem("data_impresion") !== undefined ? JSON.parse(localStorage.getItem("data_impresion")) : null;

    console.log("data impresion: ", this.data_impresion);
  }

  ngOnInit() {
    this.getDataPDF();

  }

  getDataPDF() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/" + this.data_impresion[0].codigo_proforma + "/" +
      this.data_impresion[0].cod_cliente + "/" + this.data_impresion[0].cod_cliente_real + "/" + this.BD_storage + "/" + this.data_impresion[0].estado_contra_entrega_input)
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.docveprofCab;

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.printFunction();
          this.generatePDF();
        }
      })
  }

  getDataPDFHarcode() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.getAll('/venta/transac/veproforma/getDataPDF/' + this.userConn + "/120028/801406/801406/PE/PORCANCELAR")
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.docveprofCab

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
          console.log("tamanio data: ", [datav].length);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.printFunction();
        }
      })
  }

  printFunction() {
    window.print();
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

        // Obtener el PDF como un Blob
        const pdfBlob = pdf.output('blob');

        // Enviar el correo cuando ya está generado el PDF
        this.enviarCorreoProformaGuardada(pdfBlob);
      });
    }
  }

  // fin enviador de correo al finalizar de grabar la proforma
  enviarCorreoProformaGuardada(pdfBlob: Blob) {
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + '.pdf');
    console.log(formData.get('pdfFile'));

    let errormesagge = "La Ruta presenta fallos al hacer peticion GET -/notif/envioCorreoProforma/ ";
    this.api.createAllWithOutToken('/notif/envioCorreos/envioCorreoProforma/' + this.userConn + '/dpd3/31101/' + this.data_impresion[0].codigo_proforma, formData).subscribe({
      next: (datav) => {
        console.log(datav);
        this.toastr.success("CORREO ELECTRONICO ENVIO");
      },
      error: (err: any) => {
        console.log(err, errormesagge);
        console.log(pdfBlob);
      },

      complete: () => {
        window.close();
      }
    });
  }


  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(formattedNumber);
  }

  formatNumberTotalSub2Decimals(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  refrsh() {
    window.location.reload();
  }

}
