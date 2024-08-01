import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirmacion',
  templateUrl: './dialog-confirmacion.component.html',
  styleUrls: ['./dialog-confirmacion.component.scss']
})
export class DialogConfirmacionComponent implements OnInit {

  mensaje: any;

  constructor(public dialogo: MatDialogRef<DialogConfirmacionComponent>, @Inject(MAT_DIALOG_DATA) public mensaje_dialog: string) {

    this.mensaje = mensaje_dialog;
    console.log(this.mensaje);
  }

  onNoClick(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }

  ngOnInit() {
  }

}
