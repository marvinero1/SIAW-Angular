import { Component, OnInit } from '@angular/core';
import { RecargoDocumentoCreateComponent } from '../recargo-documento/recargo-documento-create/recargo-documento-create.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RecargoServicioService } from '../recargo-documento/service-recargo/recargo-servicio.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-modal-recargos',
  templateUrl: './modal-recargos.component.html',
  styleUrls: ['./modal-recargos.component.scss']
})
export class ModalRecargosComponent implements OnInit {

  recargo_get_service: any = [];
  userConn: any;
  displayedColumns = ['codigo', 'descripcion', 'porcen', 'monto', 'moneda'];


  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();


  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ModalRecargosComponent>, public log_module: LogService, private toastr: ToastrService,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public servicioRecargo: RecargoServicioService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

  }

  ngOnInit() {
    this.servicioRecargo.disparadorDeRecargoDocumento.subscribe(data => {
      console.log("Recibiendo Recargo: ", data);
      this.recargo_get_service = data.punto_venta;
    });
  }

  anadirRecargo() {

  }


  eliminarRecargo() {

  }

  modalCatalogoRecargos(): void {
    this.dialog.open(RecargoDocumentoCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
  }
}
