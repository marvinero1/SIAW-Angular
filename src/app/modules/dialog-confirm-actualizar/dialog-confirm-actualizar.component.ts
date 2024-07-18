import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-confirm-actualizar',
  templateUrl: './dialog-confirm-actualizar.component.html',
  styleUrls: ['./dialog-confirm-actualizar.component.scss']
})
export class DialogConfirmActualizarComponent implements OnInit {

  mensaje: any;

  constructor(public dialogo: MatDialogRef<DialogConfirmActualizarComponent>, @Inject(MAT_DIALOG_DATA) public mensaje_dialog: string) {

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
