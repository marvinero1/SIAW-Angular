import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../../../../../assets/vfs_fonts.js";
import { fonts } from '../../../../../../config/pdfFonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts

@Component({
  selector: 'app-etiqueta-tuercas-proforma',
  templateUrl: './etiqueta-tuercas-proforma.component.html',
  styleUrls: ['./etiqueta-tuercas-proforma.component.css'],
})
export class EtiquetaTuercasProformaComponent implements OnInit {

  codigo_get_proforma: any;
  ventana: string = "etiquetasItemsProforma";
  public data_impresion: any[] = [];

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
    
  }

  ngOnInit() {
    this.getDataPDF();
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

        // Duplicar cada elemento
        // Multiplicar cada elemento 4 veces
        // const elementosMultiplicados = datav.ds_tuercas_lista.flatMap((elemento) => 
        //   Array(3).fill(elemento)
        // );

        // elementosMultiplicados.forEach((elemento, index) => {
        //   console.log(`Elemento ${index + 1}:`, elemento);
        // });

          //this.mandarImprimirPDF(datav.docveprofCab, datav.ds_tuercas_lista);

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
    // const content = document.getElementById('content');
    // if (content) {
    //   // Ajustar la escala para mejorar la calidad de la imagen
    //   html2canvas(content, { scale: 5 }).then((canvas) => {
    //     const imgData = canvas.toDataURL('image/jpeg', 1); // Cambiado a JPEG con calidad 0.75

    //     // Crear un nuevo documento PDF
    //     const pdf = new jsPDF({
    //       orientation: 'portrait',
    //       unit: 'mm',
    //       format: 'letter' // Formato Carta (Letter)
    //     });

    //     // Calcular el ancho y alto del PDF con márgenes
    //     const margin = 2;
    //     const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
    //     const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

    //     // Obtener el ancho y alto de la imagen en el canvas
    //     const imgWidth = canvas.width;
    //     const imgHeight = canvas.height;

    //     // Calcular la relación de aspecto de la imagen
    //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    //     // Calcular el nuevo ancho y alto de la imagen para mantener la proporción
    //     const newWidth = imgWidth * ratio;
    //     const newHeight = imgHeight * ratio;

    //     // Agregar la imagen al PDF con márgenes
    //     pdf.addImage(imgData, 'JPEG', margin, margin, newWidth, newHeight);

    //     // Descargar el PDF
    //     pdf.save(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + "- ETIQUETAS_TUERCAS" + '.pdf');
    //   });
    // }
  }

  mandarImprimirPDF(data_cabecera, data_tuercas) {
    console.warn(data_cabecera, data_tuercas);
    const data_detalle_proforma = data_tuercas;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "-TUERCAS" },
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
                text: (data_cabecera.titulo + " SOLO TUERCAS " || ''),
                margin: [0, 0, 0, 3],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
                margin: [0, 0, 0, 10],
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
          { canvas: [{ type: 'line', x1: 20, y1: 10, x2: 650 - 2 * 35, y2: 10, lineWidth: 1 }] },
        ];
      }.bind(this),

      content: [
        // Primera tabla
        {
          table: {
            widths: [132, 132, 132, 132],  // Ancho fijo para cada columna
            body: groupedData.map((row, index) => {
              const filledRow = [...row];
              while (filledRow.length < 4) {
                filledRow.push({ text: '', alignment: 'center', margin: [5, 5, 5, 5] });
              }
              const pageBreakRow = (index % 7 === 0 && index > 0) ? { pageBreak: 'before' } : {};
      
              // Crear la estructura interna de cada celda como una tabla anidada
              return filledRow.map((item) => ({
                table: {
                  widths: ['*'],  // Solo una columna interna
                  heights: function (rowIndex) {
                    return rowIndex === 0 ? 40 : 30;  // Diferentes alturas por fila
                  },
                  body: [
                    [
                      {
                        text: [
                          { text: `${this.aumentarEspaciosDescripcionItem(item.descripcion) || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.medida || ''}\n`, fontSize: 11, margin: [10, 5, 10, 5] },
                          { text: `${this.formatNumberTotalSub(item.cantidad === 0 ? '' : item.cantidad) || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.udm || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.medida === undefined ? '' : '(                          )'}`, fontSize: 9, margin: [10, 5, 10, 5] }
                        ],
                        alignment: 'center',
                        margin: [10, 5, 10, 5],
                        font: 'Arial',
                        bold: true,
                        height: 80,
                        maxHeight: 100,
                        minHeight: 80,
                        width: 120,
                        overflow: 'hidden',
                        border: item.medida === undefined ? [false, false, false, false] : [true, true, true, true],
                      }
                    ]
                  ]
                },
                border: [0, 0, 0, 0],
                ...pageBreakRow
              }));
            })
          },
          margin: [0, 0, 0, 25]  // Añadimos un margen inferior para separar la primera tabla
        }, { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 610 - 2 * 30, y2: 10, lineWidth: 1 }] },

        // Segunda tabla (debajo de la primera)
        // Segunda tabla (siempre en la siguiente hoja)
        {
          text: '', // Espacio en blanco si se requiere
          pageBreak: 'before'  // Aseguramos que la segunda tabla esté en una nueva hoja
        },

        {text: 'DETALLE TOTAL DE TUERCAS', fontSize: 14, bold: true, margin: [40, 6, 40, 0], alignment: 'center'},

        {
          table: {
            widths: [52, 155, 65, 45, 54, 75],  // Ancho de las columnas
            body: [
              [{text:'CÓDIGO', bold:true, fontSize: 11}, {text:'DESCRIPCIÓN', bold:true, fontSize: 11}, {text:'MEDIDA', bold:true, fontSize: 11}, {text:'UD', bold:true, fontSize: 11}, {text:'CANTIDAD', bold:true, fontSize: 11,alignment: 'right'},''],
              
              ...data_tuercas.map(items => [
                { text: items.coditem, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.descripcion, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.medida, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.udm, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: this.formatNumberTotalSub(items.cantidad), alignment: 'right'},
                { text: "", alignment: 'right'},
              ])
            ]
          },
          margin: [15, 10, 0, 0],  // Añadimos un margen superior para separar de la primera tabla
          layout:'headerLineOnly',
        },
      ],
      
      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 0],
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

  generatePDFDownload(data_cabecera, data_tuercas) {
    console.warn(data_cabecera);
    const data_detalle_proforma = data_tuercas;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "-TUERCAS" },
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
                text: (data_cabecera.titulo + " SOLO TUERCAS " || ''),
                margin: [0, 0, 0, 3],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
                margin: [0, 0, 0, 10],
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
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 635 - 2 * 35, y2: 10, lineWidth: 1 }] },
        ];
      }.bind(this),

      content: [
        // Primera tabla
        {
          table: {
            widths: [132, 132, 132, 132],  // Ancho fijo para cada columna
            body: groupedData.map((row, index) => {
              const filledRow = [...row];
              while (filledRow.length < 4) {
                filledRow.push({ text: '', alignment: 'center', margin: [5, 5, 5, 5] });
              }
              const pageBreakRow = (index % 7 === 0 && index > 0) ? { pageBreak: 'before' } : {};
      
              // Crear la estructura interna de cada celda como una tabla anidada
              return filledRow.map((item) => ({
                table: {
                  widths: ['*'],  // Solo una columna interna
                  heights: function (rowIndex) {
                    return rowIndex === 0 ? 40 : 30;  // Diferentes alturas por fila
                  },
                  body: [
                    [
                      {
                        text: [
                          { text: `${this.aumentarEspaciosDescripcionItem(item.descripcion) || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.medida || ''}\n`, fontSize: 11, margin: [10, 5, 10, 5] },
                          { text: `${this.formatNumberTotalSub(item.cantidad === 0 ? '' : item.cantidad) || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.udm || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.medida === undefined ? '' : '(                          )'}`, fontSize: 9, margin: [10, 5, 10, 5] }
                        ],
                        alignment: 'center',
                        margin: [10, 5, 10, 5],
                        font: 'Arial',
                        bold: true,
                        height: 80,
                        maxHeight: 100,
                        minHeight: 80,
                        width: 120,
                        overflow: 'hidden',
                        border: item.medida === undefined ? [false, false, false, false] : [true, true, true, true],
                      }
                    ]
                  ]
                },
                border: [0, 0, 0, 0],
                ...pageBreakRow
              }));
            })
          },
          margin: [0, 0, 0, 25]  // Añadimos un margen inferior para separar la primera tabla
        }, { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 610 - 2 * 30, y2: 10, lineWidth: 1 }] },

        // Segunda tabla (debajo de la primera)
        // Segunda tabla (siempre en la siguiente hoja)
        {
          text: '', // Espacio en blanco si se requiere
          pageBreak: 'before'  // Aseguramos que la segunda tabla esté en una nueva hoja
        },

        {text: 'DETALLE TOTAL DE TUERCAS', fontSize: 14, bold: true, margin: [40, 6, 40, 0], alignment: 'center'},

        {
          table: {
            widths: [52, 155, 65, 45, 54, 75],  // Ancho de las columnas
            body: [
              [{text:'CÓDIGO', bold:true, fontSize: 11}, {text:'DESCRIPCIÓN', bold:true, fontSize: 11}, {text:'MEDIDA', bold:true, fontSize: 11}, {text:'UD', bold:true, fontSize: 11}, {text:'CANTIDAD', bold:true, fontSize: 11,alignment: 'right'},''],
              
              ...data_tuercas.map(items => [
                { text: items.coditem, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.descripcion, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.medida, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.udm, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: this.formatNumberTotalSub(items.cantidad), alignment: 'right'},
                { text: "", alignment: 'right'},
              ])
            ]
          },
          margin: [15, 10, 0, 0],  // Añadimos un margen superior para separar de la primera tabla
          layout:'headerLineOnly',
        },
      ],
      
      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 0],
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

    pdfMake.createPdf(docDefinition).download(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial +"-TUERCAS"+'.pdf');
  }

  vistaPreviaPDF(data_cabecera, data_tuercas){
    //console.warn(data_cabecera);
    const data_detalle_proforma = data_tuercas;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "-TUERCAS" },
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
                text: (data_cabecera.titulo + " SOLO TUERCAS " || ''),
                margin: [0, 0, 0, 3],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
                margin: [0, 0, 0, 10],
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
          { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 635 - 2 * 35, y2: 10, lineWidth: 1 }] },
        ];
      }.bind(this),

      content: [
        // Primera tabla
        {
          table: {
            widths: [132, 132, 132, 132],  // Ancho fijo para cada columna
            body: groupedData.map((row, index) => {
              const filledRow = [...row];
              while (filledRow.length < 4) {
                filledRow.push({ text: '', alignment: 'center', margin: [5, 5, 5, 5] });
              }
              const pageBreakRow = (index % 7 === 0 && index > 0) ? { pageBreak: 'before' } : {};
      
              // Crear la estructura interna de cada celda como una tabla anidada
              return filledRow.map((item) => ({
                table: {
                  widths: ['*'],  // Solo una columna interna
                  heights: function (rowIndex) {
                    return rowIndex === 0 ? 40 : 30;  // Diferentes alturas por fila
                  },
                  body: [
                    [
                      {
                        text: [
                          { text: `${this.aumentarEspaciosDescripcionItem(item.descripcion) || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.medida || ''}\n`, fontSize: 11, margin: [10, 5, 10, 5] },
                          { text: `${this.formatNumberTotalSub(item.cantidad === 0 ? '' : item.cantidad) || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.udm || ''}\n`, fontSize: 10, margin: [10, 5, 10, 5] },
                          { text: `${item.medida === undefined ? '' : '(                          )'}`, fontSize: 9, margin: [10, 5, 10, 5] }
                        ],
                        alignment: 'center',
                        margin: [10, 5, 10, 5],
                        font: 'Arial',
                        bold: true,
                        height: 80,
                        maxHeight: 100,
                        minHeight: 80,
                        width: 120,
                        overflow: 'hidden',
                        border: item.medida === undefined ? [false, false, false, false] : [true, true, true, true],
                      }
                    ]
                  ]
                },
                border: [0, 0, 0, 0],
                ...pageBreakRow
              }));
            })
          },
          margin: [0, 0, 0, 25]  // Añadimos un margen inferior para separar la primera tabla
        }, { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 610 - 2 * 30, y2: 10, lineWidth: 1 }] },

        // Segunda tabla (debajo de la primera)
        // Segunda tabla (siempre en la siguiente hoja)
        {
          text: '', // Espacio en blanco si se requiere
          pageBreak: 'before'  // Aseguramos que la segunda tabla esté en una nueva hoja
        },

        {text: 'DETALLE TOTAL DE TUERCAS', fontSize: 14, bold: true, margin: [40, 6, 40, 0], alignment: 'center'},

        {
          table: {
            widths: [52, 155, 65, 45, 54, 75],  // Ancho de las columnas
            body: [
              [{text:'CÓDIGO', bold:true, fontSize: 11}, {text:'DESCRIPCIÓN', bold:true, fontSize: 11}, {text:'MEDIDA', bold:true, fontSize: 11}, {text:'UD', bold:true, fontSize: 11}, {text:'CANTIDAD', bold:true, fontSize: 11,alignment: 'right'},''],
              
              ...data_tuercas.map(items => [
                { text: items.coditem, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.descripcion, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.medida, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: items.udm, fontSize: 9, font: 'Arial', alignment: 'left'},
                { text: this.formatNumberTotalSub(items.cantidad), alignment: 'right'},
                { text: "", alignment: 'right'},
              ])
            ]
          },
          margin: [15, 10, 0, 0],  // Añadimos un margen superior para separar de la primera tabla
          layout:'headerLineOnly',
        },
      ],
      
      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 0],
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
      case "TUE HEX G5 UNC":
      case "TUE HEX CL 8 FINA":
      case "TUE HEX CL 8 EXT FI":
      case "TUE HEX G2 ZB UNC":
        cadena += "\n"; // Añade 1 salto de línea
        break; // No olvides romper el switch
    }

    // Añadir espacios si la cadena tiene 16 o menos caracteres
    return cadena?.length <= 16 ? cadena + " ".repeat(8) : cadena;
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
