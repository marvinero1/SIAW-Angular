import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { IDNotasRemision } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import { CatalogoFacturasService } from './servicio-catalogo-facturas/catalogo-facturas.service';

@Component({
  selector: 'app-catalogo-facturas',
  templateUrl: './catalogo-facturas.component.html',
  styleUrls: ['./catalogo-facturas.component.scss']
})
export class CatalogoFacturasComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    this.mandarFactura();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarFactura();
  };

  nota_remision_get: any = [];
  nota_remision_view: any = [];
  userConn: string;
  usuario: string;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  nota_remisions!: IDNotasRemision[];
  selectenota_remisions: IDNotasRemision[];
  searchValue: string | undefined;
  private debounceTimer: any;

  constructor(public dialogRef: MatDialogRef<CatalogoFacturasComponent>, private api: ApiService,
    private spinner: NgxSpinnerService, private servicioFacturas: CatalogoFacturasService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuario = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getNotaRemision();
  }

  getNotaRemision() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/venumeracion/catalogo/";

    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + "1")
      .subscribe({
        next: (datav) => {
          this.nota_remisions = datav;
          this.nota_remision_get = datav;
          console.log(this.nota_remision_get);
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
    this.nota_remision_view = precio_venta.data;
    console.log(precio_venta);
  }

  mandarFactura() {
    this.servicioFacturas.disparadorDeIDFacturas.emit({
      factura: this.nota_remision_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
