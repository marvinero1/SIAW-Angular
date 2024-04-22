import { Component, Directive, ElementRef, HostListener, Inject, Optional, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RefreshPasswordComponent } from '@modules/refresh-password/refresh-password.component';
import { MatrizItemsComponent } from '@components/mantenimiento/ventas/matriz-items/matriz-items.component';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})

export class LaboratorioComponent {
  

  constructor(private api:ApiService,public dialog: MatDialog){
    // this.getHojaPorDefecto();
    this.openDialogMatriz();
  }

  ngOnInit(): void {

  } 
  
  openDialogMatriz(){
    this.dialog.open(MatrizItemsComponent, {
      //height: "auto",
      // width: "calc(100% - 100px)",
      // maxWidth: "100%",
    //  maxHeight: "100%",
    });
  }
}