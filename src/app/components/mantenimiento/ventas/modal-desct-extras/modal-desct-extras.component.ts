import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-desct-extras',
  templateUrl: './modal-desct-extras.component.html',
  styleUrls: ['./modal-desct-extras.component.scss']
})
export class ModalDesctExtrasComponent implements OnInit {

  precio_venta_prof: any;

  BD_storage: any = [];
  userConn: any;


  displayedColumns = ['codigo', 'descripcion', 'porcen', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalDesctExtrasComponent>, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public precio_venta: any) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.precio_venta_prof = precio_venta.precio_venta;
  }


  ngOnInit() {

  }


  anadirDescuento() {


  }


  close() {
    this.dialogRef.close();
  }
}
