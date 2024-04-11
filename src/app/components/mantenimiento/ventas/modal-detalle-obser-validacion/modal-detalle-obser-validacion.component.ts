import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-obser-validacion',
  templateUrl: './modal-detalle-obser-validacion.component.html',
  styleUrls: ['./modal-detalle-obser-validacion.component.scss']
})
export class ModalDetalleObserValidacionComponent implements OnInit {

  message: string = "";

  constructor(public dialogRef: MatDialogRef<ModalDetalleObserValidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public obs_validacion: any) {

    this.message = obs_validacion.obs_validacion;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
