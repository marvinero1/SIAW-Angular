import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-modal-botones-impresion',
  templateUrl: './modal-botones-impresion.component.html',
  styleUrls: ['./modal-botones-impresion.component.scss']
})
export class ModalBotonesImpresionComponent implements OnInit {

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;
  public data_impresion: any = [];

  constructor(public dialogRef: MatDialogRef<ModalBotonesImpresionComponent>, private router: Router,
    private toastr: ToastrService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.data_impresion = localStorage.getItem("data_impresion") !== undefined ? JSON.parse(localStorage.getItem("data_impresion")) : null;
  }

  ngOnInit() {
    //this.btnCorreo();
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

    if (this.data_impresion[0].grabar_aprobar === true) {
      const url_tuercas = this.router.serializeUrl(this.router.createUrlTree(['/etiquetaTuercasProforma']));
      window.open(url_tuercas, '_blank');
    }
  }

  btnCorreo() {
    const url_proforma = this.router.serializeUrl(this.router.createUrlTree(['/proformaPDFCorreo']));
    window.open(url_proforma, '_blank');
  }

  close() {
    this.toastr.info("GUARDADO CON EXITO ✅");
    localStorage.removeItem("data_impresion");
    this.dialogRef.close();

    window.location.reload();
  }
}
