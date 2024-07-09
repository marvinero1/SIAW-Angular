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
  userConn: any;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  constructor(public dialogRef: MatDialogRef<ModalClienteDireccionComponent>, private api: ApiService,
    public servicioCliente: ServicioclienteService, @Inject(MAT_DIALOG_DATA) public cod_cliente: any) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
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
    console.log(this.cliente_real_array);
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

  mandarDireccion() {
    this.servicioCliente.disparadorDeClienteReal.emit({
      cliente_data: this.cliente_real_array,
    });

    this.servicioCliente.disparadorDeDireccionesClientes.emit({
      direccion: this.cliente_real_array.direccion,
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
