import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veDescuento } from '@services/modelos/objetos';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-modal-descuentos',
  templateUrl: './modal-descuentos.component.html',
  styleUrls: ['./modal-descuentos.component.scss']
})
export class ModalDescuentosComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarDescuento();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarDescuento();
  };

  descuentos_get: any = [];
  precio_codigo: any;
  public descuento_view: any = [];
  private debounceTimer: any;

  detalle_get: any;
  usuario_logueado: any;
  userConn: any;

  descuentss!: veDescuento[];
  selectedescuentss: veDescuento[];
  searchValue: string | undefined;

  descuento_codigo: any;
  descuento_descripcion: any;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  constructor(public dialogRef: MatDialogRef<ModalDescuentosComponent>, private api: ApiService,
    public servicioDescuento: DescuentoService, @Inject(MAT_DIALOG_DATA) public detalle: any) {
    this.detalle_get = detalle.detalle;
    console.log(this.detalle_get, detalle.detalle);

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getDescuentos();
  }

  getDescuentos() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vedescuento/catalogo/";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          this.descuentss = datav;
          console.log(this.descuentos_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDescuentobyId(element) {
    this.descuento_codigo = element.data.codigo;
    this.descuento_descripcion = element.data.descripcion;
    console.log(this.descuento_codigo, this.descuento_descripcion);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getSugerenciaTarfromDesc/";
    return this.api.getAll('/venta/transac/veproforma/getSugerenciaTarfromDesc/' + this.userConn + "/" + element.data.codigo + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.precio_codigo = datav.codTarifa;
          console.log(this.precio_codigo);
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

  mandarDescuento() {
    if (this.detalle_get === true) {
      this.servicioDescuento.disparadorDeDescuentosDetalle.emit({
        descuento: this.descuento_codigo,
        precio_sugerido: this.precio_codigo,
      });
    } else {
      this.servicioDescuento.disparadorDeDescuentos.emit({
        descuento: this.descuento_codigo,
        precio_sugerido: this.precio_codigo,
      });
    }

    this.servicioDescuento.disparadorDeDescuentosMatrizCantidad.emit({
      descuento: this.descuento_codigo,
      precio_sugerido: this.precio_codigo,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
