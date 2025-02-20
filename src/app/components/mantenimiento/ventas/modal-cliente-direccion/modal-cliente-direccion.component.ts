import { Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veTiendaDireccion } from '@services/modelos/objetos';
import { ServicioclienteService } from '../serviciocliente/serviciocliente.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-modal-cliente-direccion',
  templateUrl: './modal-cliente-direccion.component.html',
  styleUrls: ['./modal-cliente-direccion.component.scss']
})
export class ModalClienteDireccionComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler() {
    this.mandarDireccion();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarDireccion();
  };

  private debounceTimer: any;

  direccions!: veTiendaDireccion[];
  selectedireccions: veTiendaDireccion[];
  searchValue: string;

  public cliente_real_array: any = [];
  public direccion_view: any = [];

  latitud: any
  longitud: any
  userConn: any;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  constructor(public dialogRef: MatDialogRef<ModalClienteDireccionComponent>, private api: ApiService,
    public servicioCliente: ServicioclienteService, @Inject(MAT_DIALOG_DATA) public cod_cliente: any) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getDireccionCentral(this.cod_cliente.cod_cliente);
  }

  getDireccionCentral(cod_cliente) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vetienda/catalogo/";
    return this.api.getAll('/venta/mant/vetienda/catalogo/' + this.userConn + "/" + cod_cliente)
      .subscribe({
        next: (datav) => {
          this.direccions = datav;
          console.log(this.direccions);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDireccionView(element) {
    this.cliente_real_array = element.data;
    this.latitud = element.data.latitud;
    this.longitud = element.data.longitud;
    console.log(this.cliente_real_array);
  }

  onSearchChange(searchValue: string) {
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

  mandarDireccion() {
    this.servicioCliente.disparadorDeClienteReal.emit({
      cliente_data: this.cliente_real_array,
    });

    this.servicioCliente.disparadorDeDireccionesClientes.emit({
      direccion: this.cliente_real_array.direccion,
      latitud_direccion: this.latitud,
      longitud_direccion: this.longitud,
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
