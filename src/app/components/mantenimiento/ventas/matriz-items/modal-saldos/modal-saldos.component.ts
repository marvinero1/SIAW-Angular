import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { SaldoItemMatrizService } from '../services-saldo-matriz/saldo-item-matriz.service';
@Component({
  selector: 'app-modal-saldos',
  templateUrl: './modal-saldos.component.html',
  styleUrls: ['./modal-saldos.component.scss']
})
export class ModalSaldosComponent implements OnInit {

  id_tipo: any = [];
  saldo_variable: any = [];

  infoAgenciaSaldo: any;
  posicion_fija: any;
  saldoLocal: any;
  public codigo: string = '';
  public tipo_view: string;
  public numero_id: string;

  userConn: string;
  user_logueado: string;
  BD_storage: any = [];
  letraSaldos: string;
  item: string;


  displayedColumns = ['descripcion', 'valor'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(public dialogRef: MatDialogRef<ModalSaldosComponent>, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public dataAgencias: any, public saldoItemServices: SaldoItemMatrizService,
    @Inject(MAT_DIALOG_DATA) public cod_item: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.user_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    if (this.BD_storage === 'Loc') {
      this.BD_storage = '311'
    }
    console.log(dataAgencias);
    this.infoAgenciaSaldo = dataAgencias.cod_almacen;

    this.posicion_fija = dataAgencias.posicion_fija;
    console.log(this.posicion_fija);

    this.item = cod_item.cod_item
  }

  ngOnInit() {
    this.getSaldoItem();

  }

  getSaldoItem() {
    let agencia_concat = "AG" + this.infoAgenciaSaldo;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.infoAgenciaSaldo + "/" + this.item + "/" + this.BD_storage + "/" + this.user_logueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', datav, "+++ MENSAJE SALDO VPN: " + this.id_tipo[0].resp);

          this.letraSaldos = this.id_tipo[0].resp;
          this.saldo_variable = this.id_tipo[2];

          this.dataSource = new MatTableDataSource(this.id_tipo[1]);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          // LETRA
          this.id_tipo[1].forEach(element => {
            if (element.descripcion === 'Total Saldo') {
              this.saldoLocal = element.valor;
            }
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { console.log(this.saldoLocal); }
      })
  }

  mandarTotalSaldo() {
    switch (this.posicion_fija) {
      case 1:
        this.saldoItemServices.disparadorDeSaldoAlm1.emit({
          saldo1: this.saldoLocal,
        });
        break;
      case 2:
        this.saldoItemServices.disparadorDeSaldoAlm2.emit({
          saldo2: this.saldoLocal,
        });
        break;
      case 3:
        this.saldoItemServices.disparadorDeSaldoAlm3.emit({
          saldo3: this.saldoLocal,
        });
        break;
      case 4:
        this.saldoItemServices.disparadorDeSaldoAlm4.emit({
          saldo4: this.saldoLocal,
        });
        break;
      case 5:
        this.saldoItemServices.disparadorDeSaldoAlm5.emit({
          saldo5: this.saldoLocal,
        });
        break;

      default:
        break;
    }

    this.close();
  }

  getIdTipoView(codigo) {
    this.tipo_view = codigo;
  }

  close() {
    this.dialogRef.close();
  }
}
