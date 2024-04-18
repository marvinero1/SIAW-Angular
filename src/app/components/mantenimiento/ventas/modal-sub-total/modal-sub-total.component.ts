import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ItemServiceService } from '../serviciosItem/item-service.service';
import { SubTotalService } from './sub-total-service/sub-total.service';

@Component({
  selector: 'app-modal-sub-total',
  templateUrl: './modal-sub-total.component.html',
  styleUrls: ['./modal-sub-total.component.scss']
})
export class ModalSubTotalComponent implements OnInit {

  sub_totabilizar_post: any = [];
  BD_storage: any = [];
  desglose: any = [];
  userConn: any;
  usuario_logueado: any;

  items_carrito: any[] = [];
  cliente: any;
  almacen: any;
  moneda: any;
  desclinea: any;
  fecha_proforma: any;
  descuento_nivel_get: any;
  fecha_actual = new Date();

  constructor(public dialogRef: MatDialogRef<ModalSubTotalComponent>, private toastr: ToastrService,
    private api: ApiService, private spinner: NgxSpinnerService, private datePipe: DatePipe,
    public itemservice: ItemServiceService, public subtotal_service: SubTotalService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public descuento_nivel: any,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any,
    @Inject(MAT_DIALOG_DATA) public cod_almacen: any,
    @Inject(MAT_DIALOG_DATA) public cod_moneda: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea: any,
    @Inject(MAT_DIALOG_DATA) public fecha: any) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.items_carrito = items.items;
    this.cliente = cod_cliente.cod_cliente;
    this.almacen = cod_almacen.cod_almacen;
    this.moneda = cod_moneda.cod_moneda;
    this.desclinea = desc_linea.desc_linea;
    this.descuento_nivel_get = descuento_nivel.descuento_nivel;
    this.fecha_proforma = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    console.log(this.items_carrito, this.cliente, this.almacen, this.moneda, this.desclinea, this.fecha_proforma);
  }

  ngOnInit() {
    this.sacarSubTotal();
  }

  sacarSubTotal() {
    this.spinner.show();
    const arrayTransformado = this.items_carrito.map(item => ({
      coditem: item.coditem,
      tarifa: item.codtarifa,
      descuento: item.coddescuento,
      cantidad_pedida: item.cantidad_pedida,
      cantidad: item.cantidad,
      codcliente: this.cliente,
      opcion_nivel: this.descuento_nivel_get,
      codalmacen: this.almacen,
      desc_linea_seg_solicitud: this.desclinea === undefined ? "false" : "true",
      codmoneda: this.moneda,
      fecha: this.fecha_proforma,
    }));

    console.log(arrayTransformado);
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/versubTotal/";
    return this.api.create("/venta/transac/veproforma/versubTotal/" + this.userConn + "/" + this.BD_storage.bd + "/" + this.usuario_logueado, arrayTransformado)
      .subscribe({
        next: (datav) => {
          this.sub_totabilizar_post = datav;
          this.desglose = datav.desgloce;
          console.log(datav);



          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE TOTALIZO !');
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => {
          this.mandarArrayItemSubTotal(this.sub_totabilizar_post.resul);
        }
      })
  }

  mandarArrayItemSubTotal(items) {
    console.log(items);
    this.itemservice.enviarItemsProcesadosSubTotal(items);

    this.subtotal_service.disparadorDeSubTotal.emit({
      subtotal: this.sub_totabilizar_post.e,
    });
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  close() {
    this.dialogRef.close();
  }
}
