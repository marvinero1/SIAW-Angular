import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Data } from '@angular/router';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.scss']
})

export class DialogDeleteComponent {

  constructor(public dialogRef: MatDialogRef<DialogDeleteComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Data){}

  onNoClick(): void {
    this.dialogRef.close(false);
  } 

  confirmado(): void {
    this.dialogRef.close(true);
  }
}
