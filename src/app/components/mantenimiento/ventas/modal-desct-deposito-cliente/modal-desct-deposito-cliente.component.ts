import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-desct-deposito-cliente',
  templateUrl: './modal-desct-deposito-cliente.component.html',
  styleUrls: ['./modal-desct-deposito-cliente.component.scss']
})
export class ModalDesctDepositoClienteComponent implements OnInit {

  cliente_real_get: string;
  nit_get: string;
  nombre_cliente_get: string;
  cod_cliente_get: string;
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  displayedColumns = ['doc_cbza', 'doc_deposito', 'fecha_deposito_real', 'monto_cbza', 'moneda_cbza',
    'monto_dist', 'doc_remision', 'fecha_venta', 'numero_cuota', 'vence_cliente', 'desct', 'monto_desct',
    'obs'];

  constructor(public dialogRef: MatDialogRef<ModalDesctDepositoClienteComponent>,
    private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any, @Inject(MAT_DIALOG_DATA) public nombre_cliente: any,
    @Inject(MAT_DIALOG_DATA) public nit: any, @Inject(MAT_DIALOG_DATA) public cliente_real: any,
    private spinner: NgxSpinnerService) {

    this.cod_cliente_get = cod_cliente.cod_cliente;
    this.nombre_cliente_get = nombre_cliente.nombre_cliente;
    this.nit_get = nit.nit;
    this.cliente_real_get = cliente_real.cliente_real;


    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
  }


  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
