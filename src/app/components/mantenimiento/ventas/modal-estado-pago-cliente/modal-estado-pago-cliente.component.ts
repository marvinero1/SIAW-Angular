import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-estado-pago-cliente',
  templateUrl: './modal-estado-pago-cliente.component.html',
  styleUrls: ['./modal-estado-pago-cliente.component.scss']
})
export class ModalEstadoPagoClienteComponent implements OnInit {

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  fecha_actual = new Date();
  fecha_actual1

  displayedColumns = ['id', 'numero', 'fecha', 'cod_cliente', 'para_venta_contado', 'monto',
    'monto_pagado', '#C', 'vencimiento', 'saldo_deudor', 'acumulado', 'monto', 'dias'];

  displayedColumnsCheques = ['id', 'numero', 'recibo', 'banco', 'fecha', 'fecha_pago',
    'monto', 'restante', 'observacion'];

  displayedColumnsAnticipos = ['id', 'numero', 'recibo', 'fecha', 'monto', 'restante'];

  constructor(public dialogRef: MatDialogRef<ModalEstadoPagoClienteComponent>, private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar, private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.fecha_actual1 = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")
  }

  close() {
    this.dialogRef.close();
  }
}
