import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { Router } from '@angular/router';
import { ImpresionProformaEtiquetaItemsService } from '@components/mantenimiento/ventas/servicio-impresion-proforma/impresion-proforma-etiqueta-items.service';

@Component({
  selector: 'app-modal-botones-impresion',
  templateUrl: './modal-botones-impresion.component.html',
  styleUrls: ['./modal-botones-impresion.component.scss']
})
export class ModalBotonesImpresionComponent implements OnInit {

  public codigo_proforma_get_submitdata: any;

  constructor(public dialogRef: MatDialogRef<ModalBotonesImpresionComponent>, private dialog: MatDialog,
    private router: Router, private api: ApiService, @Inject(MAT_DIALOG_DATA) public codigo_proforma: any,
    private impresionesProforma: ImpresionProformaEtiquetaItemsService) {
    this.codigo_proforma_get_submitdata = codigo_proforma.codigo_proforma
  }

  ngOnInit() {

  }

  proformaImpresion() {
    this.servicioMandarCodigoProformaParaImpresion(this.codigo_proforma_get_submitdata);
    this.close();

    const url = this.router.serializeUrl(this.router.createUrlTree(['/proformaPDF']));
    window.open(url, '_blank');
  }

  proformaYetiqueta() {
    this.close();

    const url_proforma = this.router.serializeUrl(this.router.createUrlTree(['/proformaPDF']));
    window.open(url_proforma, '_blank');

    const url_etiqueta = this.router.serializeUrl(this.router.createUrlTree(['/etiquetaImpresionProforma']));
    window.open(url_etiqueta, '_blank');

    const url_items = this.router.serializeUrl(this.router.createUrlTree(['/etiquetasItemsProforma']));
    window.open(url_items, '_blank');

    this.servicioMandarCodigoProformaParaImpresion(this.codigo_proforma_get_submitdata)
  }

  servicioMandarCodigoProformaParaImpresion(codigo) {
    this.impresionesProforma.disparadorDeCodigoProforma.emit({
      codigo_proforma: codigo,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
