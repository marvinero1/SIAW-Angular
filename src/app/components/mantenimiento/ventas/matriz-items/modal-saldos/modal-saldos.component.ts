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
  id_proforma_get: any;
  numero_id_proforma_get: any;

  private numberFormatter_2decimales: Intl.NumberFormat;

  displayedColumns = ['descripcion', 'valor'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(public dialogRef: MatDialogRef<ModalSaldosComponent>, private api: ApiService, public saldoItemServices: SaldoItemMatrizService,
    @Inject(MAT_DIALOG_DATA) public dataAgencias: any,
    @Inject(MAT_DIALOG_DATA) public cod_item: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.user_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.infoAgenciaSaldo = dataAgencias.cod_almacen;

    this.posicion_fija = dataAgencias.posicion_fija;
    console.log(this.posicion_fija);

    this.item = cod_item.cod_item;
    this.id_proforma_get = dataAgencias.id_proforma;
    this.numero_id_proforma_get = dataAgencias.numero_id;

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    this.getSaldoItemDetalleSP();
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

  getSaldoItemDetalleSP() {
    let agencia_concat = "AG" + this.infoAgenciaSaldo;
    let array_send = {
      agencia: agencia_concat,
      codalmacen: this.infoAgenciaSaldo,
      coditem: this.item,
      codempresa: this.BD_storage,
      usuario: this.user_logueado,

      idProforma: this.id_proforma_get?.toString() === undefined ? " " : this.id_proforma_get?.toString(),
      nroIdProforma: this.numero_id_proforma_get
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getsaldoDetalleSP/";
    return this.api.create(`/venta/transac/veproforma/getsaldoDetalleSP/${this.userConn}`, array_send)
      .subscribe({
        next: (datav) => {
          console.log('data', datav);
          this.id_tipo = datav;
          this.saldoLocal = datav.totalSaldo;

          // primerTab
          this.dataSource = new MatTableDataSource(datav.detalleSaldo);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          // segundoTab
          this.saldo_variable = new MatTableDataSource(datav.saldoVariable);
        },

        error: (err: any) => {
          console.log(err, errorMessage);

        },
        complete: () => { console.log(this.saldoLocal); }
      })
  }

  formatNumberTotalSubTOTALES(numberString: number | string): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
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
