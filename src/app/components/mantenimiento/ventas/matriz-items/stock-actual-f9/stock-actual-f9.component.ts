import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicioF9Service } from './servicio-f9.service';
@Component({
  selector: 'app-stock-actual-f9',
  templateUrl: './stock-actual-f9.component.html',
  styleUrls: ['./stock-actual-f9.component.scss']
})
export class StockActualF9Component implements OnInit {

  BD_storage: any;
  userConn: any;
  info: any;
  item_stock: any;

  usuario_logueado: string = "";

  info_segundo_item: number;
  stock_segundo_item: number;

  info_tercer_lugar: number;
  stock_tercer_lugar: number;

  info_cuarto_lugar: number;
  stock_cuarto_lugar: number;

  data_stock_item: any = [];
  stock: any = [];

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public cod_item_celda: any, public dialogRef: MatDialogRef<StockActualF9Component>,
    public serviciof9: ServicioF9Service) {

    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.item_stock = cod_item_celda.cod_item_celda;
    console.log(this.item_stock);

    if (this.BD_storage.bd === 'Loc') {
      this.BD_storage.bd = '311'
    }
  }

  ngOnInit() {

  }

  getStockItem() {
    this.spinner.show();
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getSaldosItemF9/";
    return this.api.getAll('/venta/transac/veproforma/getSaldosItemF9/' + this.userConn + "/" + this.item_stock + "/" + this.BD_storage.bd + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.data_stock_item = datav;
          // console.log("PRIMERA POSICION " + this.data_stock_item[0].itemInfo);
          this.info = this.data_stock_item[0].itemInfo;
          this.stock = this.data_stock_item[0].itemStocks;

          //EN CONJUNTO 2DA POSICION
          // console.log("SEGUNDA POSICION "+this.data_stock_item[1].itemInfo);
          this.info_segundo_item = this.data_stock_item[1].itemInfo;
          this.stock_segundo_item = this.data_stock_item[1].itemStocks;
          console.log(this.stock_segundo_item)

          //EN CONJUNTO 3RA POSICION
          // console.log("TERCERA POSICION "+this.data_stock_item[2].itemInfo);
          this.info_tercer_lugar = this.data_stock_item[2].itemInfo;
          this.stock_tercer_lugar = this.data_stock_item[2].itemStocks;

          //EN CONJUNTO 4TA POSICION
          // console.log("CUARTA POSICION "+this.data_stock_item[3].itemInfo);
          this.info_cuarto_lugar = this.data_stock_item[3].itemInfo;
          this.stock_cuarto_lugar = this.data_stock_item[3].itemStocks;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
