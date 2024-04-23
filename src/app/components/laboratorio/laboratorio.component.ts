import { Component, Directive, ElementRef, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalGenerarAutorizacionComponent } from '@components/seguridad/modal-generar-autorizacion/modal-generar-autorizacion.component';

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})

export class LaboratorioComponent {


  constructor(private api: ApiService, public dialog: MatDialog) {
    // this.getHojaPorDefecto();
    this.openDialogMatriz();
  }

  ngOnInit(): void {

  }

  openDialogMatriz() {
    this.dialog.open(ModalGenerarAutorizacionComponent, {
      //height: "auto",
      // width: "calc(100% - 100px)",
      // maxWidth: "100%",
      //  maxHeight: "100%",
    });
  }
}