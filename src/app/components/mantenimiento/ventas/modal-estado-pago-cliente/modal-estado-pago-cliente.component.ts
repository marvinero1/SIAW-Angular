import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-estado-pago-cliente',
  templateUrl: './modal-estado-pago-cliente.component.html',
  styleUrls: ['./modal-estado-pago-cliente.component.scss']
})
export class ModalEstadoPagoClienteComponent implements OnInit {


  displayedColumns = ['orden', 'item', 'descripcion', 'medida', 'unidad', 'iva', 'pedido',
    'cantidad', 'sld', 'tp', 'de', 'pul', 'niv', 'porcentaje', 'pd', 'pu', 'total'];

  constructor(public dialogRef: MatDialogRef<ModalEstadoPagoClienteComponent>, private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar) {

  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
