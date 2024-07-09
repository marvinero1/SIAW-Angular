import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { inTarifa } from '@services/modelos/objetos';
import { ServicioprecioventaService } from '../servicioprecioventa/servicioprecioventa.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-modal-precio-venta',
  templateUrl: './modal-precio-venta.component.html',
  styleUrls: ['./modal-precio-venta.component.scss']
})
export class ModalPrecioVentaComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarPrecioVenta();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarPrecioVenta();
  };

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  private debounceTimer: any;

  tarifa_get: any = [];
  precio_view: any = [];
  detalle_get: any;
  userConn: string;
  usuario: string;

  tarifs!: inTarifa[];
  selectevendedors: inTarifa[];
  searchValue: string | undefined;

  constructor(public dialogRef: MatDialogRef<ModalPrecioVentaComponent>, private api: ApiService, private spinner: NgxSpinnerService,
    public servicioPrecioVenta: ServicioprecioventaService, @Inject(MAT_DIALOG_DATA) public detalle: any) {
    console.log(detalle);

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getTarifa();
  }

  getTarifa() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuario)
      .subscribe({
        next: (datav) => {
          this.tarifa_get = datav;
          this.tarifs = datav;
          console.log(this.tarifa_get);
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

  getTarifabyId(precio_venta) {
    this.precio_view = precio_venta.data;
    console.log(precio_venta);
  }

  mandarPrecioVenta() {
    if (this.detalle_get === true) {
      this.servicioPrecioVenta.disparadorDePrecioVentaDetalle.emit({
        precio_venta: this.precio_view,
      });
      this.close();
    } else {
      this.servicioPrecioVenta.disparadorDePrecioVenta.emit({
        precio_venta: this.precio_view,
      });
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
