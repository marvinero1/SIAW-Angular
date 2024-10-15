import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../../../../../assets/vfs_fonts.js";
import { fonts } from '../../../../../../config/pdfFonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts
@Component({
  selector: 'app-etiquetas-item-proforma',
  templateUrl: './etiquetas-item-proforma.component.html',
  styleUrls: ['./etiquetas-item-proforma.component.css'],
  //encapsulation: ViewEncapsulation.Emulated,
  //encapsulation: ViewEncapsulation.ShadowDom // O ViewEncapsulation.Emulated
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
  tuercas_detalle: any = [];

  constructor(public nombre_ventana_service: NombreVentanaService, private api: ApiService) {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
          this.data_cabecera_footer_proforma = datav.docveprofCab;

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
          this.tuercas_detalle = datav.ds_tuercas_lista;
          // this.printFunction(datav.docveprofCab);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {

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

  // printFunction() {
  //   window.print();
  // }

  // generatePDFJS() {
  //   const doc = new jsPDF('p', 'pt', 'letter');

  //   // Definir estilo de fuente para todo el documento
  //   const fontSize = 11;
  //   const lineHeight = 1.2;
  //   const margin = 20;
  //   const boxWidth = 130;
  //   const boxHeight = 150;
  //   const boxSpacing = 10;

  //   // Cabecera del documento
  //   const header = () => {
  //     doc.setFont('courier', 'bold');
  //     doc.setFontSize(12);
  //     doc.text('PERTEC S.R.L', margin, 40);

  //     doc.setFont('courier', 'normal');
  //     doc.setFontSize(fontSize);
  //     doc.text(`N.I.T: ${this.data_cabecera_footer_proforma.rnit}`, margin, 60);
  //     doc.text(`Tipo de Pago: ${this.data_cabecera_footer_proforma.tipopago}`, margin, 80);
  //     doc.text(`Almacen: ${this.data_cabecera_footer_proforma.codalmacen}`, margin, 100);

  //     doc.text(`Fecha: ${this.data_cabecera_footer_proforma.fecha_impresion}`, doc.internal.pageSize.getWidth() - margin - 100, 40, { align: 'right' });
  //     doc.text(`Hora: ${this.data_cabecera_footer_proforma.hora_impresion}`, doc.internal.pageSize.getWidth() - margin - 100, 60, { align: 'right' });

  //     doc.line(margin, 120, doc.internal.pageSize.getWidth() - margin, 120); // Línea horizontal
  //   };

  //   // Agregar cabecera a la primera página
  //   header();

  //   let x = margin;
  //   let y = 140;

  //   doc.setFont('courier', 'normal');
  //   doc.setFontSize(fontSize);

  //   this.data_detalle_proforma.forEach((item, index) => {
  //     if (x + boxWidth > doc.internal.pageSize.getWidth() - margin) {
  //       x = margin;
  //       y += boxHeight + boxSpacing;
  //     }

  //     if (y + boxHeight > doc.internal.pageSize.getHeight() - margin - 60) {
  //       doc.addPage();
  //       header();
  //       x = margin;
  //       y = 140;
  //     }

  //     doc.rect(x, y, boxWidth, boxHeight);

  //     doc.text(item.descripcion, x + 5, y + 20, { maxWidth: boxWidth - 10 });
  //     doc.text(item.medida, x + 5, y + 40);
  //     doc.text(this.formatNumberTotalSub(item.cantidad), x + 5, y + 60);
  //     doc.text(item.udm, x + 5, y + 80);

  //     x += boxWidth + boxSpacing;
  //   });

  //   // Abrir PDF en una nueva ventana para previsualización
  //   doc.output('dataurlnewwindow');
  // }

  // LA NUEVA PRINT FUNTION

  // printFunction() {
  //   const HTML_1 = document.getElementById('content');

  //   if (HTML_1) {
  //     const documentoPDF_PRINT = new jsPDF('p', 'pt', 'letter');
  //     const options = {
  //       background: 'white',
  //       scale: 2, // Puedes ajustar la escala según sea necesario
  //     };

  //     html2canvas(HTML_1, options).then((canvas) => {
  //       const img = canvas.toDataURL('image/png'); // Corregido el formato aquí
  //       const imgProps = (documentoPDF_PRINT as any).getImageProperties(img);
  //       const pdfWidth = documentoPDF_PRINT.internal.pageSize.getWidth();
  //       const pdfHeight = documentoPDF_PRINT.internal.pageSize.getHeight();
  //       const bufferX = 5;
  //       const bufferY = 5;
  //       const marginBottom = 30; // Margen inferior en puntos (ajustable según sea necesario)
  //       const contentHeight = pdfHeight - 2 * bufferY - marginBottom;
  //       const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       let currentHeight = 0;
  //       let pageNumber = 1;

  //       while (currentHeight < imgHeight) {
  //         if (pageNumber > 1) {
  //           documentoPDF_PRINT.addPage();
  //         }

  //         documentoPDF_PRINT.addImage(
  //           img,
  //           'PNG',
  //           bufferX,
  //           bufferY - currentHeight,
  //           pdfWidth,
  //           pdfHeight + marginBottom,
  //           undefined,
  //           'FAST'
  //         );

  //         currentHeight += contentHeight;
  //         pageNumber++;
  //       }

  //       // Guardar el PDF
  //       documentoPDF_PRINT.save('nuevopdf.pdf');
  //     }).catch((error) => {
  //       console.error('Error al capturar la imagen:', error);
  //     });
  //   } else {
  //     console.error('No se encontró el elemento con id "content"');
  //   }
  // }


  //genera el PDF

  // genera PDF Y DESCARGA
  generatePDFDownload(data_cabecera) {
    console.warn(data_cabecera);
    const data_detalle_proforma = this.data_detalle_proforma;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "- ETIQUETAS" },
      header: function (currentPage, pageCount) {
        return [
          {
            columns: [
              {
                text: data_cabecera.empresa || 'PERTEC S.R.L.',
                margin: [20, 20, 0, 14],
                fontSize: 11,
                font: 'Courier',
                bold: true
              },
              {
                text: (data_cabecera.hora_impresion || ''),
                alignment: 'center',
                margin: [10, 20, 0, 14],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.fecha_impresion || ''),
                alignment: 'right',
                margin: [10, 20, 20, 14],
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'N.I.T: ', bold: true }, data_cabecera.rnit || ''],
                margin: [20, 0, 0, 3],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.titulo || ''),
                margin: [0, 0, 0, 3],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
                // margin: [10, 0, 0, 10],
                alignment: 'right'
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  { text: 'Tipo de Pago: ', bold: true },
                  data_cabecera.tipopago || ''
                ],
                margin: [20, 0, 10, 0],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: 'Almacen: ', bold: true }, + (data_cabecera.codalmacen || '')],
                // margin: [10, 10],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount,
                alignment: 'right',
                margin: [0, 0, 20, 0],
                fontSize: 9,
                font: 'Courier',
              }
            ],
          margin: [0, 0, 0, 0], // Márgenes diferentes para izquierda/derecha y arriba/abajo 
          },
          
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 645 - 2 * 30, y2: 10, lineWidth: 1 }] },
        ];
      }.bind(this),

      content: [
        {
          table: {
            widths: [132, 132, 132, 132],  // Ancho fijo para cada cuadro
            height:[5, 5, 5, 5],
            body: groupedData.map((row, index) => {
              const filledRow = [...row];
              while (filledRow.length < 4) {
                filledRow.push({ text: '', alignment: 'center', margin: [5, 5, 5, 5], height:[5, 5, 5, 5] });
              }
              const pageBreakRow = (index % 7 === 0 && index > 0) ? { pageBreak: 'before' } : {}; // aca indicamos en q fila se deja de romper los cuadritos
            
              //desde aca se empieza a dibujar 
              return filledRow.map((item) => ({
                 table: {
                   widths: ['*'],  // Ajuste para que la tabla tenga solo una columna interna
                   heights: function (rowIndex) {
                    return rowIndex === 0 ? 40 : 30; // Diferente altura para la primera fila
                  },
                   body: [
                       [{
                          text: [
                            { text: `${this.aumentarEspaciosDescripcionItem( item.descripcion) || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.medida || ''}\n`, fontSize: 11, margin: [10, 5, 10, 5] },
                            { text: `${this.formatNumberTotalSub(item.cantidad === 0 ? '' : item.cantidad) || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.udm || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.medida === undefined ? '' : '(                          )'}`, fontSize: 9,margin: [10, 5, 10, 5] }
                          ],
                          alignment: 'center', 
                          margin: [10, 5, 10, 5], // Ajuste del margen del texto dentro del cuadro
                          font: 'Arial',
                          bold: true,
                          height:80,
                          maxHeight: 100,  // Altura máxima para el contenido
                          minHeight: 80,   // Altura mínima fija
                          width: 120,      // Ancho fijo
                          overflow: 'hidden',  // Escondemos el contenido que se exceda del espacio
                          border: item.medida === undefined ? [false, false, false, false] : [true, true, true, true],
                       }
                     ]
                   ]
                },
                 border: [0, 0, 0, 0],
                 ...pageBreakRow,
               }));
            })
          },
          margin: [0, 0, 0, 0], // Márgenes diferentes para izquierda/derecha y arriba/abajo
          layout: {
            paddingTop: function() { return 2; },   // Sin padding superior
            paddingBottom: function() { return 2; }, // Sin padding inferior
            paddingLeft: function() { return 2; },   // Sin padding a la izquierda
            paddingRight: function() { return 2; }   // Sin padding a la derecha
          }
        }
      ],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 4],
            }
          ]
        };
      },
   
      defaultStyle: {
        fontSize: 9,
        font: 'Courier'
      },
      pageMargins: [20, 100, 0, 20]
    };
    console.log(groupedData);
    pdfMake.createPdf(docDefinition).download(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + "- ETIQUETAS" + '.pdf');
  }

  // genera para enviar a imprimir
  printFunction(data_cabecera) {
    console.warn(data_cabecera);
    const data_detalle_proforma = this.data_detalle_proforma;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "- ETIQUETAS" },
      header: function (currentPage, pageCount) {
        return [
          {
            columns: [
              {
                text: data_cabecera.empresa || 'PERTEC S.R.L.',
                margin: [20, 20, 0, 14],
                fontSize: 11,
                font: 'Courier',
                bold: true
              },
              {
                text: (data_cabecera.hora_impresion || ''),
                alignment: 'center',
                margin: [10, 20, 0, 14],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.fecha_impresion || ''),
                alignment: 'right',
                margin: [10, 20, 20, 14],
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'N.I.T: ', bold: true }, data_cabecera.rnit || ''],
                margin: [20, 0, 0, 3],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.titulo || ''),
                margin: [0, 0, 0, 3],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
                // margin: [10, 0, 0, 10],
                alignment: 'right'
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  { text: 'Tipo de Pago: ', bold: true },
                  data_cabecera.tipopago || ''
                ],
                margin: [20, 0, 10, 0],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: 'Almacen: ', bold: true }, + (data_cabecera.codalmacen || '')],
                // margin: [10, 10],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount,
                alignment: 'right',
                margin: [0, 0, 20, 0],
                fontSize: 9,
                font: 'Courier',
              }
            ],
          margin: [0, 0, 0, 0], // Márgenes diferentes para izquierda/derecha y arriba/abajo
          
          },
          
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 645 - 2 * 30, y2: 10, lineWidth: 1 }] },
        ];
      }.bind(this),

      content: [
        {
          table: {
            widths: [132, 132, 132, 132],  // Ancho fijo para cada cuadro
            height:[5, 5, 5, 5],
            body: groupedData.map((row, index) => {
              const filledRow = [...row];
              while (filledRow.length < 4) {
                filledRow.push({ text: '', alignment: 'center', margin: [5, 5, 5, 5], height:[5, 5, 5, 5] });
              }
              const pageBreakRow = (index % 7 === 0 && index > 0) ? { pageBreak: 'before' } : {}; // aca indicamos en q fila se deja de romper los cuadritos
            
              //desde aca se empieza a dibujar 
              return filledRow.map((item) => ({
                 table: {
                   widths: ['*'],  // Ajuste para que la tabla tenga solo una columna interna
                   heights: function (rowIndex) {
                    return rowIndex === 0 ? 40 : 30; // Diferente altura para la primera fila
                  },
                   body: [
                       [{
                          text: [
                            { text: `${this.aumentarEspaciosDescripcionItem( item.descripcion) || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.medida || ''}\n`, fontSize: 11, margin: [10, 5, 10, 5] },
                            { text: `${this.formatNumberTotalSub(item.cantidad === 0 ? '' : item.cantidad) || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.udm || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.medida === undefined ? '' : '(                          )'}`, fontSize: 9,margin: [10, 5, 10, 5] }
                          ],
                          alignment: 'center', 
                          margin: [10, 5, 10, 5], // Ajuste del margen del texto dentro del cuadro
                          font: 'Arial',
                          bold: true,
                          height:80,
                          maxHeight: 100,  // Altura máxima para el contenido
                          minHeight: 80,   // Altura mínima fija
                          width: 120,      // Ancho fijo
                          overflow: 'hidden',  // Escondemos el contenido que se exceda del espacio
                          border: item.medida === undefined ? [false, false, false, false] : [true, true, true, true],
                       }
                     ]
                   ]
                },
                 border: [0, 0, 0, 0],
                 ...pageBreakRow,
               }));
            })
          },
          margin: [0, 0, 0, 0], // Márgenes diferentes para izquierda/derecha y arriba/abajo
          layout: {
            paddingTop: function() { return 2; },   // Sin padding superior
            paddingBottom: function() { return 2; }, // Sin padding inferior
            paddingLeft: function() { return 2; },   // Sin padding a la izquierda
            paddingRight: function() { return 2; }   // Sin padding a la derecha
          }
        }
      ],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 4],
            }
          ]
        };
      },
      defaultStyle: {
        fontSize: 9,
        font: 'Courier'
      },
      pageMargins: [20, 100, 0, 20]
    };
    console.log(groupedData);
    pdfMake.createPdf(docDefinition).print();
  }

  vistaPreviaPDF(data_cabecera) {
    console.warn(data_cabecera);
    const data_detalle_proforma = this.data_detalle_proforma;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "- ETIQUETAS" },
      header: function (currentPage, pageCount) {
        return [
          {
            columns: [
              {
                text: data_cabecera.empresa || 'PERTEC S.R.L.',
                margin: [20, 10, 0, 14],
                fontSize: 11,
                font: 'Courier',
                bold: true
              },
              {
                text: (data_cabecera.hora_impresion || ''),
                alignment: 'center',
                margin: [10, 10, 0, 14],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.fecha_impresion || ''),
                alignment: 'right',
                margin: [10, 10, 20, 14],
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'N.I.T: ', bold: true }, data_cabecera.rnit || ''],
                margin: [20, 0, 0, 3],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.titulo || ''),
                margin: [0, 0, 0, 3],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
                // margin: [10, 0, 0, 10],
                alignment: 'right'
              },
            ]
          },
          {
            columns: [
              {
                text: [
                  { text: 'Tipo de Pago: ', bold: true },
                  data_cabecera.tipopago || ''
                ],
                margin: [20, 0, 10, 0],
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: 'Almacen: ', bold: true }, + (data_cabecera.codalmacen || '')],
                // margin: [10, 10],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount,
                alignment: 'right',
                margin: [0, 0, 20, 0],
                fontSize: 9,
                font: 'Courier',
              }
            ],
          margin: [0, 0, 0, 0], // Márgenes diferentes para izquierda/derecha y arriba/abajo
          
          },
          
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 645 - 2 * 30, y2: 10, lineWidth: 1 }] },
        ];
      }.bind(this),

      content: [
        {
          table: {
            widths: [132, 132, 132, 132],  // Ancho fijo para cada cuadro
            height:[5, 5, 5, 5],
            body: groupedData.map((row, index) => {
              const filledRow = [...row];
              while (filledRow.length < 4) {
                filledRow.push({ text: '', alignment: 'center', margin: [5, 5, 5, 5], height:[5, 5, 5, 5] });
              }
              const pageBreakRow = (index % 7 === 0 && index > 0) ? { pageBreak: 'before' } : {}; // aca indicamos en q fila se deja de romper los cuadritos
            
              //desde aca se empieza a dibujar 
              return filledRow.map((item) => ({
                 table: {
                   widths: ['*'],  // Ajuste para que la tabla tenga solo una columna interna
                   heights: function (rowIndex) {
                    return rowIndex === 0 ? 40 : 30; // Diferente altura para la primera fila
                  },
                   body: [
                       [{
                          text: [
                            { text: `${this.aumentarEspaciosDescripcionItem(item.descripcion) || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.medida || ''}\n`, fontSize: 11, margin: [10, 5, 10, 5] },
                            { text: `${this.formatNumberTotalSub(item.cantidad === 0 ? '' : item.cantidad) || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.udm || ''}\n`, fontSize: 10,margin: [10, 5, 10, 5] },
                            { text: `${item.medida === undefined ? '' : '(                          )'}`, fontSize: 9,margin: [10, 5, 10, 5] }
                          ],
                          alignment: 'center', 
                          margin: [10, 5, 10, 5], // Ajuste del margen del texto dentro del cuadro
                          font: 'Arial',
                          bold: true,
                          height:80,
                          maxHeight: 100,  // Altura máxima para el contenido
                          minHeight: 80,   // Altura mínima fija
                          width: 120,      // Ancho fijo
                          overflow: 'hidden',  // Escondemos el contenido que se exceda del espacio
                          border: item.medida === undefined ? [false, false, false, false] : [true, true, true, true],
                       }
                     ]
                   ]
                },
                 border: [0, 0, 0, 0],
                 ...pageBreakRow,
               }));
            })
          },
          margin: [0, 0, 0, 0], // Márgenes diferentes para izquierda/derecha y arriba/abajo
          layout: {
            paddingTop: function() { return 2; },   // Sin padding superior
            paddingBottom: function() { return 2; }, // Sin padding inferior
            paddingLeft: function() { return 2; },   // Sin padding a la izquierda
            paddingRight: function() { return 2; }   // Sin padding a la derecha
          }
        }
      ],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 4],
            }
          ]
        };
      },
   
      defaultStyle: {
        fontSize: 9,
        font: 'Courier'
      },
      pageMargins: [20, 100, 0, 20]
    };

    console.log(groupedData);
    pdfMake.createPdf(docDefinition).open();
  }

  aumentarEspaciosDescripcionItem(cadena: string): string {
    console.log(cadena, cadena?.length);

    // Manejo de cadenas específicas
    switch (cadena) {
      case "CHAVETA":
      case "TIRAF HEX ZB":
      case "ARA PLANA ZB":
      case "ARA PRES PES":
      case "PER LENT C/TUE ZB":
      case "TUE CAST  UNF":
      case "TUE HEX CL 8 EXT FI":
      case "INOX ARA PLA":
      case "TUE HEX CL 8 FINA":
      case "TUE CAST MM":
        cadena += "\n"; // Añade 1 salto de línea
        break; // No olvides romper el switch
    }

    // Añadir espacios si la cadena tiene 16 o menos caracteres
    return cadena?.length <= 16 ? cadena + " ".repeat(9) : cadena;
  }


  formatNumberTotalSub(numberString: number): string {
    if (numberString === undefined) {
      numberString = 0;
    }
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString?.toString().replace(',', '.'));
    let a = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
    return a === '0.00' ? '' : a;
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
