import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-anticipos-proforma',
  templateUrl: './anticipos-proforma.component.html',
  styleUrls: ['./anticipos-proforma.component.scss']
})
export class AnticiposProformaComponent implements OnInit {

  cod_cliente_proforma: any;
  cod_moneda_proforma: any;
  totalProf_proforma: any;
  tipo_de_pago_proforma: any;
  nombre_cliente_get: any;
  nit_get: any;
  validacion: boolean = false;
  vendedor_get: any;
  message: string;

  nombre_ventana: string = "docininvconsol.vb";
  public ventana = "Toma de Inventario Consolidado"
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  displayedColumns = ['doc', 'fecha', 'monto', 'usuario', 'hora', 'vendedor'];
  displayedColumnsAnticipado = ['doc', 'cliente', 'vendedor', 'anulado', 'cliente', 'nit', 'vendedor', 'nombre', 'fecha'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;


  constructor(public dialogRef: MatDialogRef<AnticiposProformaComponent>, private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any, @Inject(MAT_DIALOG_DATA) public tipoPago: any,
    @Inject(MAT_DIALOG_DATA) public cod_moneda: any, @Inject(MAT_DIALOG_DATA) public totalProf: any,
    @Inject(MAT_DIALOG_DATA) public nombre_cliente: any, @Inject(MAT_DIALOG_DATA) public nit: any,
    @Inject(MAT_DIALOG_DATA) public vendedor: any) {

    this.cod_cliente_proforma = cod_cliente.cod_cliente;
    this.cod_moneda_proforma = cod_moneda.cod_moneda;
    this.totalProf = totalProf.totalProf;
    this.tipo_de_pago_proforma = tipoPago.tipoPago;
    this.nombre_cliente_get = nombre_cliente.nombre_cliente;
    this.nit_get = nit.nit;
    this.vendedor_get = vendedor.vendedor;

    console.log(this.cod_cliente_proforma, this.cod_moneda_proforma, this.totalProf, this.tipo_de_pago_proforma,
      this.nombre_cliente_get, this.nit_get, this.vendedor_get);

  }

  ngOnInit() {
    if (this.cod_cliente_proforma == undefined || this.cod_cliente_proforma == "") {
      this.toastr.error('SELECCIONE CLIENTE ⚠️');
      this.validacion = true;
      return this.message = "SELECCIONE CLIENTE"
    }
    if (this.cod_moneda_proforma == undefined || this.cod_moneda_proforma == "") {
      this.toastr.error('SELECCIONE MONEDA ⚠️');
      this.validacion = true;
      return this.message = "SELECCIONE MONEDA"
    }
    if (this.totalProf == undefined || this.totalProf == 0) {
      this.toastr.error('EL TOTAL ES 0 O NO HAY TOTAL ⚠️');
      this.validacion = true;
      return this.message = "EL TOTAL ES 0 O NO HAY TOTAL"
    }
    if (this.tipo_de_pago_proforma == undefined || this.tipo_de_pago_proforma == "CREDITO") {
      this.toastr.error('SELECCIONE TIPO DE PAGO CONTADO EN LA PROFORMA ⚠️');
      this.validacion = true;
      return this.message = "SELECCIONE TIPO DE PAGO CONTADO EN LA PROFORMA"
    }
  }


  close() {
    this.dialogRef.close();
  }
}
