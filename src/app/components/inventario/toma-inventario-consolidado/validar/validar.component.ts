import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.scss']
})
export class ValidarComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ValidarComponent>) {  
    
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
