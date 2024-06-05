import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-etiqueta-impresion-proforma',
  templateUrl: './etiqueta-impresion-proforma.component.html',
  styleUrls: ['./etiqueta-impresion-proforma.component.css']
})
export class EtiquetaImpresionProformaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  generatePDF() {
    const content = document.getElementById('content');
    html2canvas(content, { scale: 4 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 216; // Letter size width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const documentDefinition = {
        pageSize: { width: pdfWidth, height: 279 },
        pageMargins: [5, 5, 5, 5], // No margins
        content: [
          {
            image: imgData,
            width: pdfWidth,
            height: pdfHeight
          }
        ]
      };

      pdfMake.createPdf(documentDefinition).download('documento.pdf');
    });
  }
}
