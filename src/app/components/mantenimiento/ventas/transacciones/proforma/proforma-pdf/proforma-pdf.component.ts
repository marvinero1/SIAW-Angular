import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { fonts } from '../../../../../../config/pdfFonts';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../../../../../assets/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts
@Component({
  selector: 'app-proforma-pdf',
  templateUrl: './proforma-pdf.component.html',
  styleUrls: ['./proforma-pdf.component.css'],
})
export class ProformaPdfComponent implements OnInit {

  codigo_get_proforma: any;
  ventana: string = "proformaPDF";

  public data_impresion: any[] = [];

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  data_cabecera_footer_proforma: any = [];
  data_detalle_proforma: any = [];
  data_detalle_etiqueta: any = [];


  private numberFormatter_4decimales: Intl.NumberFormat;
  private numberFormatter_2decimales: Intl.NumberFormat;

  constructor(private api: ApiService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.data_impresion = sessionStorage.getItem("data_impresion") !== undefined ? JSON.parse(sessionStorage.getItem("data_impresion")) : null;

    console.log("data impresion: ", this.data_impresion);
    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_4decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    });

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    this.getDataPDF();
  }

  getDataPDF() {
    let array_send = {
      codProforma: this.data_impresion[0]?.codigo_proforma,
      codcliente: this.data_impresion[0]?.cod_cliente,
      codcliente_real: this.data_impresion[0]?.cod_cliente_real,
      codempresa: this.BD_storage,
      cmbestado_contra_entrega: this.data_impresion[0]?.cmbestado_contra_entrega.toString(),
      paraAprobar: this.data_impresion[0]?.grabar_aprobar
    };

    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getDataPDF/";
    return this.api.create('/venta/transac/veproforma/getDataPDF/' + this.userConn, array_send)
      .subscribe({
        next: (datav) => {
          console.log("DATA DEL PDF: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.docveprofCab;

          // Agregar el número de orden a los objetos de datos
          datav.dtveproforma1.forEach((element, index) => {
            element.nroitem = index + 1;
            element.orden = index + 1;
          });

          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.dtveproforma1;
          this.data_detalle_etiqueta = datav.dt_etiqueta;

          // this.imprimirPDF(datav.docveprofCab, datav.dtveproforma1, datav.dt_etiqueta);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.imprimirPDF();
        }
      })
  }

  generatePDF() {
    // const content = document.getElementById('content');
    // if (content) {
    //   // Ajustar la escala para mejorar la calidad de la imagen
    //   html2canvas(content, { scale: 2 }).then((canvas) => {
    //     const imgData = canvas.toDataURL('image/jpeg', 0.75); // Cambiado a JPEG con calidad 0.75

    //     // Crear un nuevo documento PDF
    //     const pdf = new jsPDF({
    //       orientation: 'portrait',
    //       unit: 'mm',
    //       format: 'letter' // Formato Carta (Letter)
    //     });

    //     // Calcular el ancho y alto del PDF con márgenes
    //     const margin = 10;
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
    //     pdf.save(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + '.pdf');

    //   });
    // }
  }

  // aca se dibuja el pdf y se envia a imprimir
  imprimirPDF(data_cabecera, items_get, etiqueta) {
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
                margin: [20, 20, 0, 0], // Ajustado el margen para reducir el espacio
                fontSize: 11,
                font: 'Courier',
                bold: true
              },
              {
                text: (data_cabecera.hora_impresion || ''),
                alignment: 'center',
                margin: [0, 20, 0, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.fecha_impresion || ''),
                alignment: 'right',
                margin: [0, 20, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'N.I.T: ', bold: true }, data_cabecera.rnit || ''],
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.titulo || ''),
                margin: [0, 0, 0, 0], // Margen ajustado
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
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
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: 'Almacen: ', bold: true }, (data_cabecera.codalmacen || '')],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount,
                alignment: 'right',
                margin: [0, 0, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ],
          },
          { canvas: [{ type: 'line', x1: 20, y1: 8, x2: 580, y2: 8, lineWidth: 1 }] }, // Ajustado y1 y y2 para reducir espacio
          //--------------------------------------------------------------------------------//

          {
            columns: [
              {
                text: [
                  { text: data_cabecera.rcodcliente + " " + data_cabecera.rcliente + " " + data_cabecera.rnombre_comercial, characterSpacing: 0 },
                ],
                margin: [20, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 245,
              },
              {
                text: [{ text: 'Vendedor: ', bold: true, characterSpacing: 0 }, (data_cabecera.rcodvendedor || '')],
                margin: [10, 0, 10, 2], // Margen ajustado
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                width: 110,
                characterSpacing: 0
              },
              {
                text: [{ text: 'Factor: ', bold: true, characterSpacing: 0 }, (data_cabecera.rtdc + data_cabecera.rmonedabase)],
                alignment: 'center',
                margin: [10, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                width: 100,
                characterSpacing: 0
              },
              {
                text: [{ text: 'Fecha:', bold: true, characterSpacing: 0 }, { text: data_cabecera.rfecha, characterSpacing: 0 }],
                alignment: 'left',
                margin: [10, 0, 15, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: data_cabecera.rdireccion, characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 350,
              },
              {
                text: [{ text: 'Telefono: ', bold: true, characterSpacing: 0 }, { text: etiqueta.telefono || '', characterSpacing: 0 }],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'Punto: ', bold: true, characterSpacing: 0 }, { text: data_cabecera.rptoventa || '', characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
              },
              {
                text: [{ text: 'Preparación: ', bold: true, characterSpacing: 0 }, { text: data_cabecera.rpreparacion || '', characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
            ],
          },
          { canvas: [{ type: 'line', x1: 20, y1: 2, x2: 580, y2: 2, lineWidth: 1 }] }, // Ajustado y1 y y2 para reducir espacio
        ];
      }.bind(this),

      content: [{
        table: {
          headerRows: 1,
          widths: [17, 55, 162, 70, 30, 40, 70, 15, 50, 50],
          border: [false, true, false, false],
          body: [
            [
              { text: '#', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: 'CODIGO', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: '<------ DESCRIPCION ------>', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: '' },
              { text: 'UD.', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'CANT PE', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: '', style: 'tableHeader' },
              { text: 'TP', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'PRE UNIT', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'TOTAL', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 }
            ],

            ...items_get.map(items => [
              { text: items.nroitem, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.coditem, alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.descripcion, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.medida, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0 },
              // { text: , alignment: 'center', font: 'Arial', fontSize: 9 },
              { text: items.udm, alignment: 'center', font: 'Arial', fontSize: 8 },
              { text: this.formatNumberTotalSub2Decimals(items.cantidad), alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: '___________', alignment: 'center', font: 'Arial', fontSize: 8 },
              { text: items.codtarifa, alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: items.precioneto, alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: this.formatNumberTotalSub2Decimals(items.total), alignment: 'right', font: 'Arial', fontSize: 8 },
            ]),

            [{ text: '____________________________________________________________________________________________________', colSpan: 10, border: [true, true, true, true] }, {}, {}, {}, {}, {}, {}, {}, {}, {}],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Peso Total: ', bold: true, characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 9, alignment: 'right', colSpan: 2 },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            //{ text: data_cabecera.rpesototal, bold: true},
            { text: ' ' + this.formatNumberTotalSub2Decimals(data_cabecera.rpesototal) + ' Kg.', characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 9, alignment: 'left' },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Sub Total:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rsubtotal), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Recargos:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rrecargos), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Descuento:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rdescuentos), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{}, {}, {}, {}, {}, {}, {}, {}, { text: '_________________', colSpan: 2, bold: true, border: [false, false, false, false], margin: [false, false, false, false] }, {}],


            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', bold: true, characterSpacing: 0, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rtotalimp), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],


            [{ text: data_cabecera.rtotalliteral, fontSize: 9, font: 'Courier', colSpan: 10, alignment: 'left' }, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{ text: data_cabecera.rdsctosdescrip, fontSize: 9, font: 'Courier', colSpan: 10, alignment: 'left' }, {}, {}, {}, {}, {}, {}, {}, {}, {}],


            [{ text: 'Medio de Transporte: ', bold: true, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rtransporte, characterSpacing: 0, colSpan: 8, fontSize: 9, alignment: 'left', font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Flete Pagado Por: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.rfletepor, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Dirección: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rdireccion, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Observación: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.robs, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Facturación: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rfacturacion, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Fecha Inicial: ', bold: true, characterSpacing: 0, colSpan: 2, decoration: 'underline', alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.crfecha_hr_inicial, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Fecha Autorizado: ', bold: true, characterSpacing: 0, colSpan: 2, decoration: 'underline', alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.crfecha_hr_autoriza, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],
          ]
        },

        layout: {
          // 'headerLineOnly',
          headerLineOnly: true,
          //defaultBorder: false, // Sin bordes para las celdas,
          hLineWidth: function (i, node) {
            // Dibuja una línea solo debajo del encabezado
            return (i === 1) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            // Sin líneas verticales
            return 0;
          },
          hLineColor: function (i, node) {
            // Color de la línea horizontal
            return (i === 1) ? 'black' : 'white';
          },
          paddingLeft: function (i, node) { return 0; },
          paddingRight: function (i, node) { return 0; },
          paddingTop: function (i, node) { return 0; },
          paddingBottom: function (i, node) { return 0; }
        },

        // columns: [
        //   { text: data_cabecera.rtotalliteral, fontSize: 9, font: 'Courier' },
        //   { text: data_cabecera.rdsctosdescrip, fontSize: 9, font: 'Courier' }
        // ],
        margin: [0, 10, 0, 0] // Espacio entre la tabla y las columnas
      },
      ],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            //     { text: [
            //       { text:  data_cabecera.rtotalliteral }
            //     ],
            //     margin: [0, 0, 0, 0],
            //     fontSize: 9,
            //     font: 'Courier',
            //    },
            //    { text: [
            //     { text:  data_cabecera.rdsctosdescrip }
            //   ],
            //   margin: [0, 0, 0, 0],
            //   fontSize: 9,
            //   font: 'Courier',
            //  },

            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 4],
            }
          ]
        };
      },

      styles: {
        header: {
          fontSize: 14,
          margin: [0, 0, 0, 30],
          font: 'Courier',
        },

        tableExample: {
          // fontSize: 12,
          border: [40, 60, 40, 60],
          // margin: [0, 2, 0, 15],
          //pageMargins: [72, 100, 72, 50], // Márgenes estándar de 1 pulgada (72 puntos)
          font: 'Courier',
        }
      },
      defaultStyle: {
        fontSize: 10,
        font: 'Arial'
      },
      // pageMargins: [15, 100, 15, 15]
      pageSize: 'LETTER', // Establece tamaño carta (opcional, si no lo has hecho)
      pageMargins: [20, 120, 72, 50] // Márgenes estándar de 1 pulgada (72 puntos)
    };

    console.log(groupedData);
    pdfMake.createPdf(docDefinition).print();
  }

  descargaPDF(data_cabecera, items_get, etiqueta) {
    console.warn(data_cabecera);
    const data_detalle_proforma = this.data_detalle_proforma;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const rowHeight = 25;  // Altura aproximada de cada fila en puntos
    const numberOfRows = groupedData.length;
    const calculatedHeight = rowHeight * numberOfRows;

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "- ETIQUETAS" },
      header: function (currentPage, pageCount) {
        return [
          {
            columns: [
              {
                text: data_cabecera.empresa || 'PERTEC S.R.L.',
                margin: [20, 20, 0, 0], // Ajustado el margen para reducir el espacio
                fontSize: 11,
                font: 'Courier',
                bold: true
              },
              {
                text: (data_cabecera.hora_impresion || ''),
                alignment: 'center',
                margin: [0, 20, 0, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.fecha_impresion || ''),
                alignment: 'right',
                margin: [0, 20, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'N.I.T: ', bold: true }, data_cabecera.rnit || ''],
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.titulo || ''),
                margin: [0, 0, 0, 0], // Margen ajustado
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
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
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: 'Almacen: ', bold: true }, (data_cabecera.codalmacen || '')],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount,
                alignment: 'right',
                margin: [0, 0, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ],
          },
          { canvas: [{ type: 'line', x1: 20, y1: 8, x2: 580, y2: 8, lineWidth: 1 }] }, // Ajustado y1 y y2 para reducir espacio
          //--------------------------------------------------------------------------------//

          {
            columns: [
              {
                text: [
                  { text: data_cabecera.rcodcliente + " " + data_cabecera.rcliente + " " + data_cabecera.rnombre_comercial, characterSpacing: 0 },
                ],
                margin: [20, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 245,
              },
              {
                text: [{ text: 'Vendedor: ', bold: true, characterSpacing: 0 }, (data_cabecera.rcodvendedor || '')],
                margin: [10, 0, 10, 2], // Margen ajustado
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                width: 110,
                characterSpacing: 0
              },
              {
                text: [{ text: 'Factor: ', bold: true, characterSpacing: 0 }, (data_cabecera.rtdc + data_cabecera.rmonedabase)],
                alignment: 'center',
                margin: [10, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                width: 100,
                characterSpacing: 0
              },
              {
                text: [{ text: 'Fecha:', bold: true, characterSpacing: 0 }, { text: data_cabecera.rfecha, characterSpacing: 0 }],
                alignment: 'left',
                margin: [10, 0, 15, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',

              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: data_cabecera.rdireccion, characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 350,
              },
              {
                text: [{ text: 'Telefono: ', bold: true, characterSpacing: 0 }, { text: etiqueta.telefono || '', characterSpacing: 0 }],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'Punto: ', bold: true, characterSpacing: 0 }, { text: data_cabecera.rptoventa || '', characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
              },
              {
                text: [{ text: 'Preparación: ', bold: true, characterSpacing: 0 }, { text: data_cabecera.rpreparacion || '', characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
            ],
          },
          { canvas: [{ type: 'line', x1: 20, y1: 2, x2: 580, y2: 2, lineWidth: 1 }] }, // Ajustado y1 y y2 para reducir espacio
        ];
      }.bind(this),

      content: [{
        table: {
          headerRows: 1,
          widths: [17, 55, 162, 70, 30, 40, 70, 15, 50, 50],
          border: [false, true, false, false],
          body: [
            [
              { text: '#', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: 'CODIGO', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: '<------ DESCRIPCION ------>', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: '' },
              { text: 'UD.', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'CANT PE', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: '', style: 'tableHeader' },
              { text: 'TP', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'PRE UNIT', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'TOTAL', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 }],

            ...items_get.map(items => [
              { text: items.nroitem, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.coditem, alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.descripcion, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.medida, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0 },
              // { text: , alignment: 'center', font: 'Arial', fontSize: 9 },
              { text: items.udm, alignment: 'center', font: 'Arial', fontSize: 8 },
              { text: this.formatNumberTotalSub2Decimals(items.cantidad), alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: '___________', alignment: 'center', font: 'Arial', fontSize: 8 },
              { text: items.codtarifa, alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: items.precioneto, alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: this.formatNumberTotalSub2Decimals(items.total), alignment: 'right', font: 'Arial', fontSize: 8 },
            ]),

            [{ text: '____________________________________________________________________________________________________', colSpan: 10, border: [true, true, true, true] }, {}, {}, {}, {}, {}, {}, {}, {}, {}],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Peso Total: ', bold: true, characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 9, alignment: 'right', colSpan: 2 },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            //{ text: data_cabecera.rpesototal, bold: true},
            { text: ' ' + this.formatNumberTotalSub2Decimals(data_cabecera.rpesototal) + ' Kg.', characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 9, alignment: 'left' },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Sub Total:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rsubtotal), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Recargos:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rrecargos), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Descuento:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rdescuentos), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{}, {}, {}, {}, {}, {}, {}, {}, { text: '_________________', colSpan: 2, bold: true, border: [false, false, false, false], margin: [false, false, false, false] }, {}],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', bold: true, characterSpacing: 0, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rtotalimp), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],


            [{ text: data_cabecera.rtotalliteral, fontSize: 9, font: 'Courier', colSpan: 10, alignment: 'left' }, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{ text: data_cabecera.rdsctosdescrip, fontSize: 9, font: 'Courier', colSpan: 10, alignment: 'left' }, {}, {}, {}, {}, {}, {}, {}, {}, {}],


            [{ text: 'Medio de Transporte: ', bold: true, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rtransporte, characterSpacing: 0, colSpan: 8, fontSize: 9, alignment: 'left', font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Flete Pagado Por: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.rfletepor, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Dirección: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rdireccion, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Observación: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.robs, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Facturación: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rfacturacion, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Fecha Inicial: ', bold: true, characterSpacing: 0, colSpan: 2, decoration: 'underline', alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.crfecha_hr_inicial, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Fecha Autorizado: ', bold: true, characterSpacing: 0, colSpan: 2, decoration: 'underline', alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.crfecha_hr_autoriza, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],
          ]
        },

        layout: {
          // 'headerLineOnly',
          headerLineOnly: true,
          //defaultBorder: false, // Sin bordes para las celdas,
          hLineWidth: function (i, node) {
            // Dibuja una línea solo debajo del encabezado
            return (i === 1) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            // Sin líneas verticales
            return 0;
          },
          hLineColor: function (i, node) {
            // Color de la línea horizontal
            return (i === 1) ? 'black' : 'white';
          },
          paddingLeft: function (i, node) { return 0; },
          paddingRight: function (i, node) { return 0; },
          paddingTop: function (i, node) { return 0; },
          paddingBottom: function (i, node) { return 0; }
        },

        // columns: [
        //   { text: data_cabecera.rtotalliteral, fontSize: 9, font: 'Courier' },
        //   { text: data_cabecera.rdsctosdescrip, fontSize: 9, font: 'Courier' }
        // ],
        margin: [0, 10, 0, 0] // Espacio entre la tabla y las columnas


      },
      ],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            //     { text: [
            //       { text:  data_cabecera.rtotalliteral }
            //     ],
            //     margin: [0, 0, 0, 0],
            //     fontSize: 9,
            //     font: 'Courier',
            //    },
            //    { text: [
            //     { text:  data_cabecera.rdsctosdescrip }
            //   ],
            //   margin: [0, 0, 0, 0],
            //   fontSize: 9,
            //   font: 'Courier',
            //  },

            {
              text: 'Pagina ' + currentPage + ' de ' + pageCount,
              alignment: 'right',
              margin: [4, 0, 10, 4],
            }
          ]
        };
      },

      styles: {
        header: {
          fontSize: 14,
          margin: [0, 0, 0, 30],
          font: 'Courier',
        },

        tableExample: {
          // fontSize: 12,
          border: [40, 60, 40, 60],
          // margin: [0, 2, 0, 15],
          //pageMargins: [72, 100, 72, 50], // Márgenes estándar de 1 pulgada (72 puntos)
          font: 'Courier',
        }
      },
      defaultStyle: {
        fontSize: 10,
        font: 'Arial'
      },
      // pageMargins: [15, 100, 15, 15]
      pageSize: 'LETTER', // Establece tamaño carta (opcional, si no lo has hecho)
      pageMargins: [20, 100, 72, 50] // Márgenes estándar de 1 pulgada (72 puntos)
    };
    console.log(groupedData);
    pdfMake.createPdf(docDefinition).download(this.data_cabecera_footer_proforma.titulo + "-" + this.data_cabecera_footer_proforma.rnombre_comercial + '.pdf');

  }

  vistaPreviaPDF(data_cabecera, items_get, etiqueta) {
    console.warn(data_cabecera);
    const data_detalle_proforma = this.data_detalle_proforma;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < data_detalle_proforma.length; i += 4) {
      groupedData.push(data_detalle_proforma.slice(i, i + 4));
    }

    const rowHeight = 25;  // Altura aproximada de cada fila en puntos
    const numberOfRows = groupedData.length;
    const calculatedHeight = rowHeight * numberOfRows;

    const docDefinition = {
      info: { title: data_cabecera.titulo + "-" + data_cabecera.rnombre_comercial + "- ETIQUETAS" },
      header: function (currentPage, pageCount) {
        return [
          {
            columns: [
              {
                text: data_cabecera.empresa || 'PERTEC S.R.L.',
                margin: [20, 20, 0, 0], // Ajustado el margen para reducir el espacio
                fontSize: 11,
                font: 'Courier',
                bold: true
              },
              {
                text: (data_cabecera.hora_impresion || ''),
                alignment: 'center',
                margin: [0, 20, 0, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.fecha_impresion || ''),
                alignment: 'right',
                margin: [0, 20, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'N.I.T: ', bold: true }, data_cabecera.rnit || ''],
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data_cabecera.titulo || ''),
                margin: [0, 0, 0, 0], // Margen ajustado
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: "",
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
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: 'Almacen: ', bold: true }, (data_cabecera.codalmacen || '')],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount,
                alignment: 'right',
                margin: [0, 0, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ],
          },
          { canvas: [{ type: 'line', x1: 20, y1: 8, x2: 580, y2: 8, lineWidth: 1 }] }, // Ajustado y1 y y2 para reducir espacio
          //--------------------------------------------------------------------------------//

          {
            columns: [
              {
                text: [
                  { text: data_cabecera.rcodcliente + " " + data_cabecera.rcliente + " " + data_cabecera.rnombre_comercial, characterSpacing: 0 },
                ],
                margin: [20, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 245,
              },
              {
                text: [{ text: 'Vendedor: ', bold: true, characterSpacing: 0 }, (data_cabecera.rcodvendedor || '')],
                margin: [10, 0, 10, 2], // Margen ajustado
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                width: 110,
                characterSpacing: 0
              },
              {
                text: [{ text: 'Factor: ', bold: true, characterSpacing: 0 }, (data_cabecera.rtdc + data_cabecera.rmonedabase)],
                alignment: 'center',
                margin: [10, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                width: 100,
                characterSpacing: 0
              },
              {
                text: [{ text: 'Fecha:', bold: true, characterSpacing: 0 }, { text: data_cabecera.rfecha, characterSpacing: 0 }],
                alignment: 'left',
                margin: [10, 0, 15, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',

              }
            ]
          },
          {
            columns: [
              {
                text: [{ text: data_cabecera.rdireccion, characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 350,
              },
              {
                text: [{ text: 'Telefono: ', bold: true, characterSpacing: 0 }, { text: etiqueta.telefono || '', characterSpacing: 0 }],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
            ]
          },
          {
            columns: [
              {
                text: [{ text: 'Punto: ', bold: true, characterSpacing: 0 }, { text: data_cabecera.rptoventa || '', characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
              },
              {
                text: [{ text: 'Preparación: ', bold: true, characterSpacing: 0 }, { text: data_cabecera.rpreparacion || '', characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
            ],
          },
          { canvas: [{ type: 'line', x1: 20, y1: 2, x2: 580, y2: 2, lineWidth: 1 }] }, // Ajustado y1 y y2 para reducir espacio
        ];
      }.bind(this),


      content: [{
        table: {
          headerRows: 1,
          widths: [17, 55, 162, 70, 30, 40, 70, 15, 50, 50],
          border: [false, true, false, false],
          body: [
            [
              { text: '#', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: 'CODIGO', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: '<------ DESCRIPCION ------>', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: '' },
              { text: 'UD.', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'CANT PE', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: '', style: 'tableHeader' },
              { text: 'TP', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'PRE UNIT', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 },
              { text: 'TOTAL', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8, characterSpacing: 0 }],

            ...items_get.map(items => [
              { text: items.nroitem, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.coditem, alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.descripcion, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0, margin: [0, 0, 0, 0] },
              { text: items.medida, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0 },
              // { text: , alignment: 'center', font: 'Arial', fontSize: 9 },
              { text: items.udm, alignment: 'center', font: 'Arial', fontSize: 8 },
              { text: this.formatNumberTotalSub2Decimals(items.cantidad), alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: '___________', alignment: 'center', font: 'Arial', fontSize: 8 },
              { text: items.codtarifa, alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: items.precioneto, alignment: 'right', font: 'Arial', fontSize: 8 },
              { text: this.formatNumberTotalSub2Decimals(items.total), alignment: 'right', font: 'Arial', fontSize: 8 },
            ]),

            [{ text: '____________________________________________________________________________________________________', colSpan: 10, border: [true, true, true, true] }, {}, {}, {}, {}, {}, {}, {}, {}, {}],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Peso Total: ', bold: true, characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 9, alignment: 'right', colSpan: 2 },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            //{ text: data_cabecera.rpesototal, bold: true},
            { text: ' ' + this.formatNumberTotalSub2Decimals(data_cabecera.rpesototal) + ' Kg.', characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 9, alignment: 'left' },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Sub Total:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rsubtotal), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Recargos:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rrecargos), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],

            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: 'Descuento:', bold: true, characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rdescuentos), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],


            [{}, {}, {}, {}, {}, {}, {}, {}, { text: '_________________', colSpan: 2, bold: true, border: [false, false, false, false], margin: [false, false, false, false] }, {}],


            [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, fontSize: 9, margin: [0, 0, 0, 0] },
            { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
            { text: '', bold: true, characterSpacing: 0, alignment: 'right', margin: [0, 0, 0, 0] },
            { text: this.formatNumberTotalSub2Decimals(data_cabecera.rtotalimp), characterSpacing: 0, fontSize: 9, alignment: 'right', margin: [0, 0, 0, 0] }],


            [{ text: data_cabecera.rtotalliteral, fontSize: 9, font: 'Courier', colSpan: 10, alignment: 'left' }, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            [{ text: data_cabecera.rdsctosdescrip, fontSize: 9, font: 'Courier', colSpan: 10, alignment: 'left' }, {}, {}, {}, {}, {}, {}, {}, {}, {}],


            [{ text: 'Medio de Transporte: ', bold: true, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rtransporte, characterSpacing: 0, colSpan: 8, fontSize: 9, alignment: 'left', font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Flete Pagado Por: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.rfletepor, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Dirección: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rdireccion, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Observación: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.robs, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Facturación: ', bold: true, characterSpacing: 0, colSpan: 2, alignment: 'left', fontSize: 9, font: 'Courier' }, {},
            { text: data_cabecera.rfacturacion, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Fecha Inicial: ', bold: true, characterSpacing: 0, colSpan: 2, decoration: 'underline', alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.crfecha_hr_inicial, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],

            [{ text: 'Fecha Autorizado: ', bold: true, characterSpacing: 0, colSpan: 2, decoration: 'underline', alignment: 'left', fontSize: 9, font: 'Courier' }, {}, { text: data_cabecera.crfecha_hr_autoriza, characterSpacing: 0, colSpan: 8, alignment: 'left', fontSize: 9, font: 'Courier' }, {}, {}, {}, {}, {}, {}, {}],
          ]
        },

        layout: {
          // 'headerLineOnly',
          headerLineOnly: true,
          //defaultBorder: false, // Sin bordes para las celdas,
          hLineWidth: function (i, node) {
            // Dibuja una línea solo debajo del encabezado
            return (i === 1) ? 1 : 0;
          },
          vLineWidth: function (i, node) {
            // Sin líneas verticales
            return 0;
          },
          hLineColor: function (i, node) {
            // Color de la línea horizontal
            return (i === 1) ? 'black' : 'white';
          },
          paddingLeft: function (i, node) { return 0; },
          paddingRight: function (i, node) { return 0; },
          paddingTop: function (i, node) { return 0; },
          paddingBottom: function (i, node) { return 0; }
        },

        // columns: [
        //   { text: data_cabecera.rtotalliteral, fontSize: 9, font: 'Courier' },
        //   { text: data_cabecera.rdsctosdescrip, fontSize: 9, font: 'Courier' }
        // ],
        margin: [0, 10, 0, 0] // Espacio entre la tabla y las columnas
      },
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

      styles: {
        header: {
          fontSize: 14,
          margin: [0, 0, 0, 30],
          font: 'Courier',
        },

        tableExample: {
          // fontSize: 12,
          border: [40, 60, 40, 60],
          // margin: [0, 2, 0, 15],
          //pageMargins: [72, 100, 72, 50], // Márgenes estándar de 1 pulgada (72 puntos)
          font: 'Courier',
        }
      },
      defaultStyle: {
        fontSize: 10,
        font: 'Arial'
      },
      // pageMargins: [15, 100, 15, 15]
      pageSize: 'LETTER', // Establece tamaño carta (opcional, si no lo has hecho)
      pageMargins: [20, 100, 72, 50] // Márgenes estándar de 1 pulgada (72 puntos)
    };
    console.log(groupedData);
    pdfMake.createPdf(docDefinition).open();
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_4decimales.format(formattedNumber);
  }

  formatNumberTotalSub2Decimals(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  refrsh() {
    window.location.reload();
  }
}