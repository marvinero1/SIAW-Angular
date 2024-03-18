import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm-actualizar',
  templateUrl: './dialog-confirm-actualizar.component.html',
  styleUrls: ['./dialog-confirm-actualizar.component.scss']
})
export class DialogConfirmActualizarComponent implements OnInit {


  constructor(public dialogo: MatDialogRef<DialogConfirmActualizarComponent>,@Inject(MAT_DIALOG_DATA) public mensaje: string){
  
  }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }

  ngOnInit() {
  }

}
