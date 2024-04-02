import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-validaciones',
  templateUrl: './ventana-validaciones.component.html',
  styleUrls: ['./ventana-validaciones.component.scss']
})
export class VentanaValidacionesComponent implements OnInit {

  mensaje: string;

  constructor(public dialogRef: MatDialogRef<VentanaValidacionesComponent>, @Inject(MAT_DIALOG_DATA) public message: any) {
    this.mensaje = message.message;
  }

  ngOnInit() {
  }


  close() {
    this.dialogRef.close();
  }
}
