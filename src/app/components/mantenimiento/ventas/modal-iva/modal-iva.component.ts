import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-modal-iva',
  templateUrl: './modal-iva.component.html',
  styleUrls: ['./modal-iva.component.scss']
})
export class ModalIvaComponent implements OnInit {

  tabla_iva_get_proformas: any = [];

  constructor(private api: ApiService,
    public dialogRef: MatDialogRef<ModalIvaComponent>, @Inject(MAT_DIALOG_DATA) public tablaIva: any) {

    this.tabla_iva_get_proformas = tablaIva.tablaIva;
    console.log("IVA QUE LLEGA DE PROFORMA" + JSON.stringify(this.tabla_iva_get_proformas))
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }
}
