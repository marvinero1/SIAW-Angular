import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmacion',
  templateUrl: './dialog-confirmacion.component.html',
  styleUrls: ['./dialog-confirmacion.component.scss']
})
export class DialogConfirmacionComponent implements OnInit {

  mensaje: any;
  array_mensaje: any = [];

  constructor(public dialogo: MatDialogRef<DialogConfirmacionComponent>, @Inject(MAT_DIALOG_DATA) public mensaje_dialog: string,
    @Inject(MAT_DIALOG_DATA) public msj_array: any) {

    this.mensaje = mensaje_dialog;
    this.array_mensaje = msj_array.msj_array;
    // console.log(this.mensaje, this.array_mensaje);
  }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }

}
