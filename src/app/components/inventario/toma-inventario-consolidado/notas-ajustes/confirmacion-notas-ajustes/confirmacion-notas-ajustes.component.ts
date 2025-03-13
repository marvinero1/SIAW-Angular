import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacion-notas-ajustes',
  templateUrl: './confirmacion-notas-ajustes.component.html',
  styleUrls: ['./confirmacion-notas-ajustes.component.scss']
})
export class ConfirmacionNotasAjustesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmacionNotasAjustesComponent>) {  
  }

  ngOnInit(): void {
    
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  } 

  confirmado(): void {
    this.dialogRef.close(true);
  }

}
