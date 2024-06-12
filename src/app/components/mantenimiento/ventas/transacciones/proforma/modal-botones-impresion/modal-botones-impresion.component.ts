import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-modal-botones-impresion',
  templateUrl: './modal-botones-impresion.component.html',
  styleUrls: ['./modal-botones-impresion.component.scss']
})
export class ModalBotonesImpresionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalBotonesImpresionComponent>, private dialog: MatDialog,
    private router: Router, private api: ApiService, private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  proformaImpresion() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/proformaPDF']));
    window.open(url, '_blank');
  }

  proformaYetiqueta() {
    const url_proforma = this.router.serializeUrl(this.router.createUrlTree(['/proformaPDF']));
    window.open(url_proforma, '_blank');

    const url_etiqueta = this.router.serializeUrl(this.router.createUrlTree(['/etiquetaImpresionProforma']));
    window.open(url_etiqueta, '_blank');

    const url_items = this.router.serializeUrl(this.router.createUrlTree(['/etiquetasItemsProforma']));
    window.open(url_items, '_blank');
  }

  close() {
    this.toastr.info("GUARDADO CON EXITO ✅");
    localStorage.removeItem("data_impresion");
    this.dialogRef.close();
    window.location.reload();
  }
}
