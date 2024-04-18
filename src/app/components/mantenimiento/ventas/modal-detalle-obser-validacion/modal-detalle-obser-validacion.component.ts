import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-detalle-obser-validacion',
  templateUrl: './modal-detalle-obser-validacion.component.html',
  styleUrls: ['./modal-detalle-obser-validacion.component.scss']
})
export class ModalDetalleObserValidacionComponent implements OnInit {

  message: string = "";
  items_get: any = [];
  items_item_max_venta_get: any = [];

  constructor(public dialogRef: MatDialogRef<ModalDetalleObserValidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public obs_validacion: any, @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public item_max_venta: any) {

    this.message = obs_validacion.obs_validacion;
    this.items_get = items.items;
    this.items_item_max_venta_get = item_max_venta.item_max_venta;

    console.log(this.message, this.items_get);
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
