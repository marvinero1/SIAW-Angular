import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-detalle-obser-validacion',
  templateUrl: './modal-detalle-obser-validacion.component.html',
  styleUrls: ['./modal-detalle-obser-validacion.component.scss']
})
export class ModalDetalleObserValidacionComponent implements OnInit {

  message: string = "";
  titulo: any = [];
  obs_contenido_get: any = [];

  constructor(public dialogRef: MatDialogRef<ModalDetalleObserValidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public obs_titulo: any,
    @Inject(MAT_DIALOG_DATA) public obs_contenido: any,) {

    this.message = obs_titulo.obs_titulo;
    this.obs_contenido_get = obs_contenido.obs_contenido;

    console.log(this.message, this.obs_contenido_get);
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
