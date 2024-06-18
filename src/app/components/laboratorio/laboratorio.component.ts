import { Component, OnInit, Directive, ElementRef, QueryList, ViewChild, ViewChildren, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalGenerarAutorizacionComponent } from '@components/seguridad/modal-generar-autorizacion/modal-generar-autorizacion.component';
import { FormControl } from '@angular/forms';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { MatRow } from '@angular/material/table';
import { FocusKeyManager } from '@angular/cdk/a11y';

export interface UserData {
  id: string;
  name: string;
}
@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})

export class LaboratorioComponent implements OnInit {
  selectedRowIndex: number = -1;


  constructor(private api: ApiService, public dialog: MatDialog) {
    // this.getHojaPorDefecto();

  }

  ngOnInit(): void {

  }


  displayedColumns: string[] = ['id', 'name'];
  dataSource: UserData[] = [
    { id: '1', name: 'User 1' },
    { id: '2', name: 'User 2' },
    { id: '3', name: 'User 3' },
    { id: '4', name: 'User 4' },
    { id: '5', name: 'User 5' }
  ];

  selectedRow: number = -1;

  highlight(index: number) {
    this.selectedRowIndex = index;
  }

  selectRow(index: number) {
    this.selectedRow = index;
  }

  moveSelection(step: number) {
    const newIndex = this.selectedRow + step;
    if (newIndex >= 0 && newIndex < this.dataSource.length) {
      this.selectedRow = newIndex;
    }
  }

  printInfo(index: number) {
    console.log(this.dataSource[index]); // Imprime la información de la fila seleccionada
  }



  openDialogMatriz() {
    this.dialog.open(ModalVendedorComponent, {
      //height: "auto",
      // width: "calc(100% - 100px)",
      // maxWidth: "100%",
      //  maxHeight: "100%",
    });
  }
}