import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-obser-validacion',
  templateUrl: './modal-detalle-obser-validacion.component.html',
  styleUrls: ['./modal-detalle-obser-validacion.component.scss']
})
export class ModalDetalleObserValidacionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalDetalleObserValidacionComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
