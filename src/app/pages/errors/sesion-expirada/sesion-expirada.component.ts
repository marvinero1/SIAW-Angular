import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-sesion-expirada',
  templateUrl: './sesion-expirada.component.html',
  styleUrls: ['./sesion-expirada.component.scss']
})
export class SesionExpiradaComponent implements OnInit {
 

  constructor(private dialogRef: MatDialogRef<SesionExpiradaComponent>, private api:ApiService){
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  sessionExpired(){
    this.dialogRef.close();
    this.api.logout();
  }
  
}
