import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { fonts } from '../../../../../config/pdfFonts';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../../../../assets/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts
@Component({
  selector: 'app-vista-previa-nm',
  templateUrl: './vista-previa-nm.component.html',
  styleUrls: ['./vista-previa-nm.component.scss']
})
export class VistaPreviaNmComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  codigo_concepto_get:any;
  codtarifa_get:any;

  private numberFormatter_2decimales: Intl.NumberFormat;

  userConn:any;
  usuarioLogueado:any;
  agencia_logueado:any;
  BD_storage:any;

  constructor(private api: ApiService, private messageService: MessageService, @Inject(MAT_DIALOG_DATA) public codtarifa: any,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public codigoNM: any ) {

      this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
      this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
      this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  
      // this.codigo_concepto_get = codigoNM.codigoNM;
      // this.codtarifa_get = codtarifa.codtarifa


      // console.log("🚀 ~ VistaPreviaNmComponent ~ dialog:MatDialog,@Inject ~ this.codigo_concepto_get:", this.codigo_concepto_get)
   }

  ngOnInit() {
    this.getData1();
  }
  
  // getData(){    
  //   let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getDataImpNM/";
  //   return this.api.getAll('/inventario/transac/docinmovimiento/getDataImpNM/'+this.userConn+"/"+this.codigo_concepto_get+"/"+this.BD_storage+"/"+this.usuarioLogueado+"/"+this.codtarifa_get)
  //     .pipe(takeUntil(this.unsubscribe$)).subscribe({
  //       next: (datav) => {
  //       console.log("🚀 ~ VistaPreviaNmComponent ~ .pipe ~ getData:", datav);


  //       },

  //       error: (err: any) => {
  //         console.log(err, errorMessage);
  //       this.messageService.add({ severity: 'error', summary: 'error', detail: 'OCURRIO UN ERROR 🖨️' });
  //       },
  //       complete: () => { }
  //     })
  // }




  getData1(){    
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getDataImpNM/";
    return this.api.getAll('/inventario/transac/docinmovimiento/getDataImpNM/'+this.userConn+"/"+33978+"/"+this.BD_storage+"/"+this.usuarioLogueado+"/"+0)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ VistaPreviaNmComponent ~ .pipe ~ getData:", datav);
        let a = datav.tablaDetalle;
        let b = datav
        
        // Agregar el número de orden a los objetos de datos
        a.forEach((element, index) => {
          element.nroitem = index + 1;
          element.orden = index + 1;
        });
        console.log("🚀 ~ VistaPreviaNmComponent ~ a ~ a:", a)

        this.vistaPrevia(b, a);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  // aca se dibuja el pdf y se envia a imprimir
  vistaPrevia(data, items) {
    console.warn(data);
    const items_get = items;

    // Agrupar los elementos en filas de 5
    const groupedData = [];
    for (let i = 0; i < items_get.length; i += 4) {
      groupedData.push(items_get.slice(i, i + 4));
    }

    const docDefinition = {
      info: { title: data.titulo + "-" + data.rctiponm + data.rcodalmacen },
      header: function (currentPage, pageCount) {
        return [
          {
            columns: [
              {
                text: data.empresa,
                margin: [20, 20, 0, 0], // Ajustado el margen para reducir el espacio
                fontSize: 9,
                font: 'Courier',
                bold: true
              },
              {
                text: (''),
                alignment: 'center',
                margin: [0, 20, 0, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (data.rfecha || ''),
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
                text: [{ text: data?.nit, bold: true },],
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: (''),
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
                  { text: '', bold: true },
                ],
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: data.rctiponm, bold: true },],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: '',
                alignment: 'right',
                margin: [0, 0, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ],
          },
          {
            columns: [
              {
                text: [
                  { text: '', bold: true },
                ],
                margin: [20, 0, 0, 0], // Reducido el margen
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: [{ text: data.titulo, bold: true },],
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
              },
              {
                text: '',
                alignment: 'right',
                margin: [0, 0, 20, 0], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ],
          },
          
          //--------------------------------------------------------------------------------//
          {
            columns: [
              {
                text: [
                  { text: 'CONCEPTO: ', characterSpacing: 0, bold: true },
                  { text: data.rcodconcepto +" "+ data.rcodconceptodescripcion, characterSpacing: 0} 
                ],
                margin: [20, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 245,
              },
              {
                text: [{ text: ''}],
                margin: [10, 0, 10, 2], // Margen ajustado
                alignment: 'center',
                fontSize: 9,
                font: 'Courier',
                width: 110,
                characterSpacing: 0
              },
              {
                text: [{ text: '', characterSpacing: 0 },],
                alignment: 'center',
                margin: [10, 0, 0, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
                width: 100,
                characterSpacing: 0
              },
              {
                text: [{ text: 'FECHA: ', bold: true, characterSpacing: 0 },
                       {text:data.rfecha || '', characterSpacing: 0 }
                ],
                alignment: 'left',
                margin: [0, 0, 15, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },
          {
            columns: [ {
                text: [{ text: 'ALMACEN: ', bold: true, characterSpacing: 0 },
                        {text:data.rcodalmacen || ''}],
                margin: [20, 0, 0, 2], // Margen ajustado
                alignment: 'left',
                fontSize: 9,
                font: 'Courier',
                width: 110,
                characterSpacing: 0
              },
              {
                text: [ { text: 'ORIGEN: ', characterSpacing: 0, bold: true },
                        { text:data.rcodalmorigen, characterSpacing: 0 },

                        { text:'    ', characterSpacing: 0 },

                        { text: 'DESTINO: ', bold: true, characterSpacing: 0  }, 
                        { text:data.rcodalmdestino, characterSpacing: 0 }],
                margin: [20, 0, 0, 0],
                fontSize: 9,
                font: 'Courier',
                alignment: 'left',
                width: 345,
              },
              {
                text: [{ text: 'VENDEDOR: ', bold: true, characterSpacing: 0 },
                       {text:data.rcodvendedor || '', characterSpacing: 0 }
                ],
                alignment: 'left',
                margin: [0, 0, 15, 2], // Margen ajustado
                fontSize: 9,
                font: 'Courier',
              }
            ]
          },

          { canvas: [{ type: 'line', x1: 20, y1: 2, x2: 580, y2: 2, lineWidth: 1 }] }, // Ajustado y1 y y2 para reducir espacio
        ];
      }.bind(this),
    
      content: [{
          table: {
            headerRows: 1,
            widths: [17, 65, 162, 70, 70, 50, 65, 65],
            border:[false, true,false,false],
            body: [
              [
                { text: '#', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 8,characterSpacing: 0,margin: [0,0,0,0], bold: true },
                { text: 'CODIGO', style: 'tableHeader', alignment: 'left', font: 'Courier', fontSize: 9,characterSpacing: 0,margin: [0,0,0,0], bold: true },
                { text: 'DESCRIPCION', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8,characterSpacing: 0,margin: [0,0,0,0], bold: true},
                { text: 'MEDIDA.', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'CANTIDAD', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'UD', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'COSTO', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'TOTAL', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true }
              ],
  
              ...items_get.map(items => [
                { text: items.nroitem, alignment: 'center', font: 'Arial', fontSize: 8, characterSpacing: 0 ,margin: [0,0,0,0]},
                { text: items.coditem, alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0,margin: [0,0,0,0] },
                { text: items.descripcion, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0,margin: [0,0,0,0] },
                { text: items.medida, alignment: 'center', font: 'Arial', fontSize: 8, characterSpacing: 0 },
                { text: items.cantidad, alignment: 'right', font: 'Arial', fontSize: 8 },
                { text: items.udm, alignment: 'right', font: 'Arial', fontSize: 8 },
                { text: items.costo, alignment: 'right', font: 'Arial', fontSize: 8 },
                { text: items.total, alignment: 'right', font: 'Arial', fontSize: 8 },
              ]),

              [{ text: '____________________________________________________________________________________________________', colSpan: 8, border: [true, true, true, true] }, {}, {}, {}, {}, {}, {}, {}],
            
              [ { text: 'Peso Total: ' + data.rpesototal +' Kg.', characterSpacing: 0, fontSize: 8, margin: [0, 0, 0, 0], alignment: 'left', bold:true, colSpan: 4},
                { text: 'a'+data.rpesototal, characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '10', characterSpacing: 0, margin: [0, 0, 0, 0],fontSize: 8 },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '0.00', characterSpacing: 0, fontSize:8, alignment: 'right', margin: [0, 0, 0, 0] } 
              ],

              [ { text: 'Observaciones: ' + data.robs, characterSpacing: 0, margin: [0, 0, 30, 30], bold:true, fontSize: 8, colSpan: 8 },
                { text: data.robs, characterSpacing: 0, margin: [0, 0, 0, 0], colSpan: 4,  },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }, 
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
              ],


              [ { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: '......................', characterSpacing: 0, margin: [0, 0, 0, 0], colSpan: 2},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: '......................', characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]}, 
                { text: '......................', characterSpacing: 0, margin: [0, 0, 0, 0], colSpan: 2},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]},
              ],

              [ { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: 'PREPARADO POR', characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 8, colSpan: 2},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: 'REVISADO POR', characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 8},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0]}, 
                { text: 'RECIBI CONFORME', characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 8, colSpan: 2},
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0], fontSize: 8},
              ],
            ]},
            
          layout: {
            // 'headerLineOnly',
            headerLineOnly: false,
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
            paddingLeft: function(i, node) { return 0; },
            paddingRight: function(i, node) { return 0; },
            paddingTop: function(i, node) { return 0; },
            paddingBottom: function(i, node) { return 0; }
          },
            
          // columns: [
          //   { text: data_cabecera.rtotalliteral, fontSize: 9, font: 'Courier' },
          //   { text: data_cabecera.rdsctosdescrip, fontSize: 9, font: 'Courier' }
          // ],
          margin: [0, 0, 0, 0] // Espacio entre la tabla y las columnas
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
    pdfMake.createPdf(docDefinition).open();
  }


  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales?.format(formattedNumber);
  }
}
