import { Component, Inject, OnInit } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../../../../../assets/vfs_fonts.js";
import { fonts } from '../../../../../../config/pdfFonts';
import { ApiService } from '@services/api.service';
import * as QRCode from 'qrcode';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts;

@Component({
  selector: 'app-factura-template',
  templateUrl: './factura-template.component.html',
  styleUrls: ['./factura-template.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated,
  // encapsulation: ViewEncapsulation.ShadowDom // O ViewEncapsulation.Emulated
})
export class FacturaTemplateComponent implements OnInit {

  public data_impresion: any = [];
  data_cabecera_footer_proforma: any = [];
  data_detalle_proforma: any = [];
  data_detalle_etiqueta: any = [];

  QR_value_string: string;
  total_literal: string;
  leyenda: string;


  //cabecera
  codfactura_web: any;
  codmoneda: any;
  complemento_ci: any;
  descuentos: any;
  leyenda_ley: any;
  nit_cliente: any;
  nomcliente: any;
  recargos: any;
  subtotal: any;
  total: any;
  cuf: any;
  id: any = "";
  numeroid: any;
  nrofactura: any;

  fecha: any;
  hora: string;

  //segundaColumna
  codptovta: any;
  direccion: any;
  fax: any;
  lugarEmision: any;
  sucursal: any;
  telefono: any;
  lugarFechaHora: any;

  //FOOTER
  qrCodeImage: string = ''; // Aquí guardaremos la imagen del QR generada

  private numberFormatter_5decimales: Intl.NumberFormat;
  private numberFormatter_2decimales: Intl.NumberFormat;

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  constructor(private api: ApiService, private datePipe: DatePipe, public dialogRef: MatDialogRef<FacturaTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public valor_PDF: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.data_impresion = valor_PDF.valor_PDF;
    console.log("🚀 ~ FacturaTemplateComponent ~ constructor ~ data_impresion:", this.data_impresion);

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_5decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    });

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.imprimirPDF(this.data_impresion);
  }

  ngOnInit() {
    // SOLO ACTIVAR CUANDO SE TESTEE PASANDO SUS DATOS PARA OBTENER LA DATA
    // this.getDataPDF();
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  getDataPDF() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/prgfacturaNR_cufd/getDataFactura/";
    return this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataFactura/' + this.userConn + "/164120/PE")
      .subscribe({
        next: (datav) => {
          console.log("DATA DE LA FACTURA: ", datav);
          //datav.docveprofCab CABECERA Y FOOTER
          this.data_cabecera_footer_proforma = datav.cabecera;

          this.QR_value_string = datav?.cadena_QR;
          this.total_literal = datav?.imp_totalliteral;
          this.leyenda = datav?.leyendaSIN;

          this.id = datav?.cabecera.id;
          this.numeroid = datav?.cabecera.numeroid;
          this.codfactura_web = datav?.cabecera.codfactura_web;
          this.codmoneda = datav?.cabecera.codmoneda;
          this.complemento_ci = datav?.cabecera.complemento_ci;
          this.cuf = datav?.cabecera.cuf;
          this.nrofactura = datav?.cabecera.nrofactura;
          this.fecha = this.datePipe.transform(datav?.cabecera.fecha, "dd/MM/yyyy");
          this.hora = datav?.cabecera.horareg;


          this.descuentos = datav?.cabecera.descuentos;
          this.subtotal = datav?.cabecera.subtotal;
          this.total = datav?.cabecera.total;

          //fecha
          this.leyenda_ley = datav?.cabecera.leyenda;
          this.nit_cliente = datav?.cabecera.nit;
          this.nomcliente = datav?.cabecera.nomcliente;


          //segundaColumna
          this.codptovta = datav?.paramEmp.codptovta;
          this.direccion = datav?.paramEmp.direccion;
          this.fax = datav?.paramEmp.fax;
          this.lugarEmision = datav?.paramEmp.lugarEmision;
          this.sucursal = datav?.paramEmp.sucursal;
          this.telefono = datav?.paramEmp.telefono;

          this.lugarFechaHora = datav?.paramEmp.lugarFechaHora
          //datav.dtveproforma1 DETALLE
          this.data_detalle_proforma = datav.detalle;
          // Agregar el número de orden a los objetos de datos
          datav.detalle.forEach((element, index) => {
            element.nroitem = index + 1;
            element.orden = index + 1;
          });

          this.imprimirPDF(datav.detalle);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  // Uso de la función
  async generateQR(valor: string) {
    const url = valor;
    try {
      const qrBase64 = await this.generateQRCodeBase64(url);
      console.log('QR en base64:', qrBase64);

      // Aquí puedes pasar la imagen base64 a pdfMake
    } catch (error) {
      console.error('Error al generar el QR:', error);
    }
  }

  // Función para generar el código QR en base64
  generateQRCodeBase64(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(data, { errorCorrectionLevel: 'M', scale: 5, width: 85 }, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);  // 'url' contiene la imagen en base64
        }
      });
    });
  }

  async imprimirPDF(data) {
    this.data_cabecera_footer_proforma = data.cabecera;
    this.QR_value_string = data?.cadena_QR;
    this.total_literal = data?.imp_totalliteral;
    this.leyenda = data?.leyendaSIN;

    this.id = data?.cabecera.id;
    this.numeroid = data?.cabecera.numeroid;
    this.codfactura_web = data?.cabecera.codfactura_web;
    this.codmoneda = data?.cabecera.codmoneda;
    this.complemento_ci = data?.cabecera.complemento_ci;
    this.cuf = data?.cabecera.cuf;
    this.nrofactura = data?.cabecera.nrofactura;
    this.fecha = this.datePipe.transform(data?.cabecera.fecha, "dd/MM/yyyy");
    this.hora = data?.cabecera.horareg;

    this.descuentos = data?.cabecera.descuentos;
    this.subtotal = data?.cabecera.subtotal;
    this.total = data?.cabecera.total;

    //fecha
    this.leyenda_ley = data?.cabecera.leyenda;
    this.nit_cliente = data?.cabecera.nit;
    this.nomcliente = data?.cabecera.nomcliente;

    //segundaColumna
    this.codptovta = data?.paramEmp.codptovta;
    this.direccion = data?.paramEmp.direccion;
    this.fax = data?.paramEmp.fax;
    this.lugarEmision = data?.paramEmp.lugarEmision;
    this.sucursal = data?.paramEmp.sucursal;
    this.telefono = data?.paramEmp.telefono;

    this.lugarFechaHora = data?.paramEmp.lugarFechaHora
    //data.dtveproforma1 DETALLE
    this.data_detalle_proforma = data.detalle;

    // Agregar el número de orden a los objetos de datos
    data.detalle.forEach((element, index) => {
      element.nroitem = index + 1;
      element.orden = index + 1;
    });

    try {
      const imageUrl = 'assets/img/logo.png'; // Ruta de tu imagen
      const base64Image = await this.getBase64ImageFromURL(imageUrl);
      // Asegúrate de que el QR ya está generado en qrCodeImage
      const base64QR = await this.generateQRCodeBase64(this.QR_value_string);
      const id = this.id;
      const numeroid = this.numeroid;

      const docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [12, 128, 140, 24],
        info: { title: "FACTURA - PERTEC - PRUEBAS" },
        header: {
          columns: [
            // Columna 1 (Imagen)
            {
              stack: [
                { image: base64Image, width: 76, height: 76, margin: [13, 12, 9, 5] },

                { text: "Lugar y Fecha:", alignment: 'left', fontSize: 8, margin: [10, 2, 10, 0], bold: true, font: 'Tahoma' },
                { text: "Nom/Razon Social: ", alignment: 'left', fontSize: 8, margin: [10, 0, 0, 0], bold: true, font: 'Tahoma' },
              ],
              margin: [12, 5, 0, 0], // Margen ajustado
              width: 'auto', // Auto ajuste de tamaño
            },
            // Columna 2 (Texto)
            {
              stack: [
                { text: "PERTEC S.R.L", alignment: 'center', fontSize: 9, bold: true, font: 'BookMan', margin: [0, 0, 4, 0] },
                { text: "CASA MATRIZ", alignment: 'center', fontSize: 6, bold: true, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: "Gral. Achá N° 330", alignment: 'center', fontSize: 6, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: "Tels: 4259660 - 4250800 - Fax: " + this.fax, alignment: 'center', fontSize: 6, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: "Cochabamba - Bolivia", alignment: 'center', fontSize: 6, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: this.sucursal, alignment: 'center', fontSize: 6, bold: true, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: this.codptovta, alignment: 'center', fontSize: 6, bold: true, font: 'Arial' },
                { text: this.direccion, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: this.telefono, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: this.lugarEmision, alignment: 'center', fontSize: 6, margin: [0, 0, 0, 8], font: 'Arial' },

                { text: " " + this.lugarFechaHora, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                { text: " " + this.nomcliente, alignment: 'left', fontSize: 8, colSpan: 6, font: 'Tahoma' },
              ],
              margin: [0, 12, 12, 15], // Margen ajustado
              width: 'auto', // Auto ajuste de tamaño
            },
            // Columna 3 (Texto)
            {
              stack: [{
                text: "FACTURA",
                alignment: 'center',
                margin: [2, 40, 5, 0], // Ajuste de margen superior
                fontSize: 11,
                font: 'BookMan',
                bold: true
              },
              {
                text: "CON DERECHO A CREDITO FISCAL",
                alignment: 'center',
                margin: [0, 0, 0, 0],
                fontSize: 8,
                font: 'BookMan',
                bold: true
              },
              ]
            },
            // Columna 4 (Texto)
            {
              stack: [
                {
                  text: [{ text: 'NIT: ', bold: true, alignment: 'right', fontSize: 7, font: 'Tahoma' },  // 'NIT:' en negrita
                  { text: '1023109029', bold: true, alignment: 'left', font: 'Tahoma' }  // Número sin negrita
                  ], fontSize: 7, margin: [0, 12, 52, 0]
                },

                {
                  text: [{ text: "Factura Nro: ", bold: true, alignment: 'right', fontSize: 7, font: 'Tahoma' },
                  { text: "00000" + this.nrofactura, bold: true, alignment: 'left', font: 'Tahoma' }], fontSize: 7,
                  margin: [0, 0, 63, 0]
                },

                {
                  table: {
                    widths: [65, 70], // Ajusta las columnas
                    body: [
                      [
                        {
                          text: "Cód. Autorización:",
                          bold: true,
                          alignment: 'right',
                          fontSize: 7,
                          font: 'Tahoma',
                          margin: [0, 0, 0, 0]
                        },
                        {
                          text: this.insertarSaltosDeLinea(this.cuf),
                          bold: true,
                          alignment: 'left',
                          characterSpacing: 0,
                          fontSize: 7,
                          font: 'Tahoma',
                          margin: [0, 0, 0, 25]
                        }
                      ]
                    ]
                  },
                  layout: 'noBorders', // Elimina los bordes si no los necesitas

                },

                {
                  text: [{ text: "Nit/Ci/Cex: ", bold: true, alignment: 'right' },
                  { text: this.nit_cliente + this.complemento_ci, bold: false }], fontSize: 8, font: 'Tahoma',
                  margin: [0, 0, 56, 0]
                },
                {
                  text: [{ text: "Código Cliente: ", bold: true, alignment: 'right', font: 'Tahoma' },
                  { text: this.nit_cliente, bold: false, font: 'Tahoma' }], fontSize: 8, margin: [0, 0, 48, 0]
                },
              ],
              margin: [10, 10, 10, 0], // Margen ajustado
            },
          ],
          margin: [0, 4, 2, 0], // Margen del header
        },

        content: [

          // Línea encima de la cabecera
          {
            canvas: [{
              type: 'line', x1: 12, y1: 0, x2: 575, y2: 0, lineWidth: 1
            }],
            margin: [0, 0, 0, 0], // Espacio entre la línea superior y la tabla
          },

          // Tabla con cabecera y contenido
          {
            table: {
              headerRows: 1,
              widths: [18, 56, 140, 56, 48, 48, 48, 58, 64],

              body: [
                [
                  { text: '#', style: 'tableHeader', alignment: 'left', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  { text: 'CODIGO PRODUCTO', style: 'tableHeader', alignment: 'center', fontSize: 8, bold: true, font: 'Tahoma' },
                  { text: 'DESCRIPCION', colSpan: 2, style: 'tableHeader', alignment: 'center', fontSize: 8, noWrap: false, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  {}, // Columna vacía para ajustar con el colSpan
                  { text: 'UNIDAD DE MEDIDA', style: 'tableHeader', alignment: 'center', fontSize: 8, bold: true, font: 'Tahoma' },
                  { text: 'CANTIDAD', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  { text: 'PRECIO UNITARIO', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, font: 'Tahoma' },
                  { text: 'DESCUENTO', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  { text: 'SUBTOTAL' + "(" + this.codmoneda + ")", style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                ],

                ...data.detalle.map(items => [
                  { text: items.nroitem, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                  { text: items.coditem, alignment: 'center', fontSize: 8, font: 'Tahoma' },
                  { text: this.cortarStringSiEsLargo(items.descripcion), alignment: 'left', fontSize: 8, font: 'Tahoma' },
                  { text: items.medida, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                  { text: items.udm, alignment: 'center', fontSize: 8, font: 'Tahoma' },
                  { text: this.formatNumberTotalSubTOTALES(items.cantidad), alignment: 'right', fontSize: 8, font: 'Tahoma' },
                  { text: items.precioneto, alignment: 'right', fontSize: 8, font: 'Tahoma' },
                  { text: items.preciodesc, alignment: 'right', fontSize: 8, font: 'Tahoma' },
                  { text: this.formatNumberTotalSub(items.total), alignment: 'right', fontSize: 8, font: 'Tahoma' }
                ]),

                [{ text: '___________________________________________________________________________________', colSpan: 9, margin: [0, 0, 0, 0] }, {}, {}, {}, {}, {}, {}, {}, {}],

                [{ text: this.total_literal, characterSpacing: 0, margin: [10, 0, 0, 0], bold: true, fontSize: 8, colSpan: 6, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Sub Total' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: this.subtotal, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '________________________________________________________', margin: [0, 0, 0, 0], colSpan: 6, },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Descuentos' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: this.descuentos, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '', characterSpacing: 0, margin: [10, 0, 0, 0], bold: true, colSpan: 6 },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                {
                  text: 'Total' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0],
                  colSpan: 2, font: 'Tahoma'
                },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: this.total, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{
                  text: [{
                    text: "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS, EL USO ILICITO DE ESTA SERA SANCIONADO PENALMENTE DE ACUERDO A LA LEY \n",
                    bold: true, fontSize: 8, alignment: 'center', font: 'Tahoma'
                  },
                  { text: this.leyenda_ley + "\n", bold: false, fontSize: 6, alignment: 'center', font: 'Tahoma' },
                  { text: this.leyenda + "\n", bold: false, fontSize: 6, alignment: 'center', font: 'Tahoma' },
                  { text: "Esta factura se encuentra tambien disponible en el siguiente enlace", bold: false, fontSize: 6, font: 'Tahoma' }], characterSpacing: 0, margin: [10, 0, 0, 0], colSpan: 5, alignment: 'center'
                },

                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Importe Base Credito Fiscal' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: this.total, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { image: base64QR, colSpan: 3, alignment: 'center', margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }],

                [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0], },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Código WEB: ' + this.codfactura_web, alignment: 'center', fontSize: 7, margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }],
              ],
            },
            margin: [12, 0, 10, 0], // Ajusta el espacio alrededor de la tabla
            layout: {
              // 'headerLineOnly',
              headerLineOnly: true,
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
              paddingLeft: function (i, node) { return 1.5; },
              paddingRight: function (i, node) { return 1.5; },
              paddingTop: function (i, node) { return 2.5; },
              paddingBottom: function (i, node) { return 1.5; }
            },
          },


          //   [{ table: {
          //     body: [
          //       [
          //         {
          //           text: [
          //             { text: "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS, EL USO ILICITO DE ESTA SERA SANCIONADO PENALMENTE DE ACUERDO A LA LEY", bold: true, fontSize: 8 },
          //             { text: "\nLey N 453 EL proveedor debera entrega el producto en las modalidades y terminos ofertados y terminos acordados o convenidos", bold: false, fontSize: 6 },
          //             { text: "\nEste Documento es la representacion grafica de un documento en Fisico Digital emitido en la modalidad de facturacion en linea", bold: false, fontSize: 6 },
          //             { text: "\nEsta factura se encuentra tambien disponible en el siguiente enlace", bold: false, fontSize: 6 }
          //           ],
          //           characterSpacing: 0,
          //           margin: [10, 10, 0, 0],
          //           colSpan: 5,
          //           alignment: 'center'
          //         },
          //         {}, {}, {}, {}  // Celdas vacías para aplicar el colSpan
          //       ],
          //       [
          //         {}, {}, {}, {}, // Más celdas vacías
          //         {
          //          image: base64QR,
          //         }
          //       ]
          //     ]
          //   }
          // }]
          // {
          //   canvas: [{ 
          //     type: 'line', x1: 12, y1: 0, x2: 585, y2: 0, lineWidth: 1 
          //   }],
          //   margin: [0, 0, 0, 0] // Espacio entre la línea superior y la tabla
          // },          
        ],

        footer: function (currentPage, pageCount) {
          return {
            columns: [
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount + " - " + id + "-" + numeroid,
                alignment: 'center',
                margin: [4, 0, 10, 4],
                fontSize: 7,
                font: 'Arial',
              }
            ]
          };
        },

        styles: {
          header: {
            fontSize: 15,
          },
          content: {
            //font: 'Courier',
            margin: [0, 0, 0, 0],
          }
        },
        defaultStyle: {
          fontSize: 12,
          font: 'Arial',
        },
      };

      pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
    }
  }

  cortarStringSiEsLargo(texto: string): string {
    if (texto.length >= 27) {
      return texto.slice(0, 27);  // Corta a los primeros 28 caracteres
    }
    return texto;  // Retorna el texto original si tiene menos de 28 caracteres
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_5decimales.format(formattedNumber);
  }

  insertarSaltosDeLinea(texto: string, limite: number = 21): string {
    let resultado = '';
    for (let i = 0; i < texto.length; i += limite) {
      resultado += texto.substring(i, i + limite);
    }
    // console.log(resultado);
    return resultado.trim(); // Quita el salto de línea final si no lo deseas
  }

  close() {
    this.dialogRef.close();
  }
}
