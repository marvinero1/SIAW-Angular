import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veVendedor } from '@services/modelos/objetos';
import { VendedorService } from '../serviciovendedor/vendedor.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-modal-vendedor',
  templateUrl: './modal-vendedor.component.html',
  styleUrls: ['./modal-vendedor.component.scss']
})
export class ModalVendedorComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarVendedor();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarVendedor();
  };

  vendedor_get: any = [];
  public vendedor_view: any = [];

  public codigo: string = '';
  public nombre: string = '';

  userConn: string;
  origen: string;

  @ViewChild('dt1') dt1: Table;

  vendedors!: veVendedor[];
  selectevendedors: veVendedor[];
  searchValue: string | undefined;

  constructor(private api: ApiService, public dialogRef: MatDialogRef<ModalVendedorComponent>,
    private serviciVendedor: VendedorService, @Inject(MAT_DIALOG_DATA) public ventana: any) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.origen = ventana.ventana;
  }

  ngOnInit() {
    this.getVendedorCatalogo();
  }

  getVendedorCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
          this.vendedors = datav;
          console.log(datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getveVendedorbyId(element) {
    this.vendedor_view = element?.data;
    console.log(this.vendedor_view);
  }

  private debounceTimer: any;
  onSearchChange(searchValue: string) {
    console.log(searchValue);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.dt1.filterGlobal(searchValue, 'contains');
    }, 700); // 700 ms de retardo
  }

  mandarVendedor() {
    if (this.origen === "ventana_buscador") {
      this.serviciVendedor.disparadorDeVendedoresBuscadorGeneral.emit({
        vendedor: this.vendedor_view,
      });
    } else {
      this.serviciVendedor.disparadorDeVendedores.emit({
        vendedor: this.vendedor_view,
      });
    }

    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
