import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { ApiService } from '@services/api.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { VistaPreviaNmComponent } from './vista-previa-nm/vista-previa-nm.component';

import { fonts } from '../../../../config/pdfFonts';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./../../../../../assets/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = fonts
@Component({
  selector: 'app-dialog-tarifa-impresion',
  templateUrl: './dialog-tarifa-impresion.component.html',
  styleUrls: ['./dialog-tarifa-impresion.component.scss']
})
export class DialogTarifaImpresionComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  codigo_concepto_get:any;
  cod_concepto_descrip_get:any;
  total_get:any;
  codigoNM_get:any;

  cod_precio_venta_modal_codigo:any;

  private numberFormatter_2decimales: Intl.NumberFormat;

  userConn:any;
  usuarioLogueado:any;
  agencia_logueado:any;
  BD_storage:any;

  constructor(public dialogRef: MatDialogRef<DialogTarifaImpresionComponent>, 
    private api: ApiService, private messageService: MessageService, private dialog: MatDialog, 
    private servicioPrecioVenta: ServicioprecioventaService,
    @Inject(MAT_DIALOG_DATA) public cod_concepto_descrip: any, @Inject(MAT_DIALOG_DATA) public total: any,
    @Inject(MAT_DIALOG_DATA) public codigoNM: any, @Inject(MAT_DIALOG_DATA) public codigo_concepto: any  ) { 

      this.cod_concepto_descrip_get = cod_concepto_descrip.cod_concepto_descrip;
      this.total_get = total.total;
      this.codigoNM_get = codigoNM.codigoNM;
      this.codigo_concepto_get = codigo_concepto.codigo_concepto

      this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
      this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
      this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
      
      // Crear instancia única de Intl.NumberFormat
      this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

  ngOnInit(){ }

  async impresion(){
    console.log("🚀 ~ DialogTarifaImpresionComponent ~ impresion ~ this.codigo_concepto_get :", this.codigo_concepto_get )

    // SI EL CONCEPTO ES EL 12 HAY QUE PEDIR EL CODTARIFA Y COLOCARLO EN EL CAMPO DEL ARRAY XDXD
    if(this.codigo_concepto_get === "12"){
      this.impresionAjuste();
      return;
    }

    if(this.codigo_concepto_get != "12"){
      let array_send:any = {
        codEmpresa: this.BD_storage,
        codclientedescripcion: "",
        codtarifa: 0,
        usuario: this.usuarioLogueado,
        codconceptodescripcion: this.cod_concepto_descrip_get,
        total: this.total.total.toString(),
        codigoNM: this.codigoNM_get
      };
      console.log("🚀 ~ DialogTarifaImpresionComponent ~ impresion ~ a:", array_send)

      let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/grabarDocumento/";
      return this.api.create('/inventario/transac/docinmovimiento/impresionNotaMovimiento/'+this.userConn, array_send)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ imprimirNM:", datav);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp+'🖨️' });
          },

          error: (err: any) => {
            console.log(err, errorMessage);
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'OCURRIO UN ERROR 🖨️' });

          },
          complete: () => {
            setTimeout(() => {
              window.location.reload();
            }, 3500);
            }
        });
    }
  }  

  impresionAjuste(){
    this.modalPrecioVenta();
    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      //this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      if(this.cod_precio_venta_modal_codigo != 0){
        let array_send:any = {
          codEmpresa: this.BD_storage ,
          codclientedescripcion: "",
          codtarifa: this.cod_precio_venta_modal_codigo,
          usuario: this.usuarioLogueado,
          codconceptodescripcion: this.cod_concepto_descrip_get,
          total: this.total.total.toString(),
          codigoNM: this.codigoNM_get
        };
        console.log("🚀 ~ DialogTarifaImpresionComponent ~ impresion ~ a:", array_send)
    
        let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/grabarDocumento/";
        return this.api.create('/inventario/transac/docinmovimiento/impresionNotaMovimiento/'+this.userConn, array_send)
          .pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: (datav) => {
            console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ imprimirNM:", datav);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp+'🖨️' });
            },
    
            error: (err: any) => {
              console.log(err, errorMessage);
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'OCURRIO UN ERROR 🖨️' });
            },
            complete: () => {
              setTimeout(() => {
                window.location.reload();
              }, 3111);
              
            }
          })
      }else{
        console.warn("ESCOJA TARIFA NO SEA GIL")
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'ESCOJA TARIFA NO SEA GIL' });
      }
    });
    // fin_precio_venta
  }

  //VISTA PREVIA START HERE
  getDataVistaPrevia(){
    // SI EL CONCEPTO ES EL 12 HAY QUE PEDIR EL CODTARIFA Y COLOCARLO EN EL CAMPO DEL ARRAY XDXD
    if(this.codigo_concepto_get === "12"){
      this.vistaPreviaAjuste();
      return;
    }

    if(this.codigo_concepto_get != "12"){
      let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getDataImpNM/";
      return this.api.getAll('/inventario/transac/docinmovimiento/getDataImpNM/'+this.userConn+"/"+this.codigoNM_get+"/"+this.BD_storage+"/"+this.usuarioLogueado+"/"+0)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
          console.log("🚀 ~ VistaPreviaNmComponent ~ .pipe ~ getData:", datav);
          let aImpresion = datav.tablaDetalle;
          let bImpresion = datav
          
          // Agregar el número de orden a los objetos de datos
          aImpresion.forEach((element, index) => {
            element.nroitem = index + 1;
            element.orden = index + 1;
          });
          console.log("🚀 ~ VistaPreviaNmComponent ~ a ~ a:", aImpresion, bImpresion);
  
          this.vistaPrevia(bImpresion, aImpresion);
          },
  
          error: (err: any) => {
            console.log(err, errorMessage);
          },
          complete: () => { }
        })
    }
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

          { canvas: [{ type: 'line', x1: 20, y1: 2, x2: 580, y2: 2, lineWidth: 1 }]}, // Ajustado y1 y y2 para reducir espacio
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
                { text: 'MEDIDA', style: 'tableHeader', alignment: 'center', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'CANTIDAD', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'UD', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'COSTO', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true },
                { text: 'TOTAL', style: 'tableHeader', alignment: 'right', font: 'Courier', fontSize: 8,characterSpacing: 0, bold: true }
              ],
  
              ...items_get.map(items => [
                { text: items.nroitem, alignment: 'center', font: 'Arial', fontSize: 8, characterSpacing: 0 ,margin: [0,0,0,0]},
                { text: items.coditem, alignment: 'left', font: 'Courier', fontSize: 9, characterSpacing: 0,margin: [0,0,0,0] },
                { text: items.descripcion, alignment: 'left', font: 'Arial', fontSize: 8, characterSpacing: 0,margin: [0,0,0,0]},
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
                { text: data.rtotal, characterSpacing: 0, fontSize:8, alignment: 'right', margin: [0, 0, 0, 0] } 
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
          margin: [0, 0, 0, 0],
          font: 'Courier',
        },

        tableExample: {
          // fontSize: 12,
          border: [40, 0, 40, 60],
          margin: [0, 2, 0, 15],
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
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  vistaPreviaAjuste(){
    this.modalPrecioVenta();
    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      //this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/getDataImpNM/";
      return this.api.getAll('/inventario/transac/docinmovimiento/getDataImpNM/'+this.userConn+"/"+this.codigoNM_get+"/"+this.BD_storage+"/"+this.usuarioLogueado+"/"+this.cod_precio_venta_modal_codigo)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
          console.log("🚀 ~ VistaPreviaNmComponent ~ .pipe ~ getData:", datav);
          let aImpresion = datav.tablaDetalle;
          let bImpresion = datav
          
          // Agregar el número de orden a los objetos de datos
          aImpresion.forEach((element, index) => {
            element.nroitem = index + 1;
            element.orden = index + 1;
          });
          console.log("🚀 ~ VistaPreviaNmComponent ~ a ~ a:", aImpresion, bImpresion);
  
          this.vistaPrevia(bImpresion, aImpresion);
          },
  
          error: (err: any) => {
            console.log(err, errorMessage);
          },
          complete: () => { }
        })

    });
    // fin_precio_venta
  }
  
  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: false }
    });
  }

  close(){
    this.dialogRef.close();
  }
}
