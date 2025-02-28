import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { IDProforma } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicioCatalogoProformasService } from '../sevicio-catalogo-proformas/servicio-catalogo-proformas.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-catalogo-proformas',
  templateUrl: './catalogo-proformas.component.html',
  styleUrls: ['./catalogo-proformas.component.scss']
})
export class CatalogoProformasComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    this.mandarProforma();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarProforma();
  };

  proforma_get: any = [];
  proforma_view: any = [];
  userConn: string;
  usuario: string;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  proformss!: IDProforma[];
  selectevendedors: IDProforma[];
  searchValue: string | undefined;
  private debounceTimer: any;

  constructor(public dialogRef: MatDialogRef<CatalogoProformasComponent>, private api: ApiService, private spinner: NgxSpinnerService,
    public servicioCatalogoProformas: ServicioCatalogoProformasService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuario = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getProforma();
  }

  getProforma() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/venumeracion/catalogo/";

    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + 2)
      .subscribe({
        next: (datav) => {
          this.proformss = datav;
          this.proforma_get = datav;
          // console.log(this.proforma_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onSearchChange(searchValue: string) {
    console.log(searchValue);
    // Debounce logic
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.dt1.filterGlobal(searchValue, 'contains');

      // Focus logic
      const elements = this.paras.toArray();
      let focused = false;
      for (const element of elements) {
        if (element.nativeElement.textContent.includes(searchValue)) {
          element.nativeElement.focus();
          focused = true;
          break;
        }
      }

      if (!focused) {
        console.warn('No se encontró ningún elemento para hacer focus');
      }
    }, 550); // 750 ms de retardo
  }

  getProformabyId(precio_venta) {
    this.proforma_view = precio_venta.data;
    console.log(precio_venta);
  }

  mandarProforma() {
    this.servicioCatalogoProformas.disparadorDeIDProforma.emit({
      proforma: this.proforma_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
