import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transformacion-digital',
  templateUrl: './transformacion-digital.component.html',
  styleUrls: ['./transformacion-digital.component.scss']
})
export class TransformacionDigitalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TransformacionDigitalComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();      
  }
  
}
