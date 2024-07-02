import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veCliente } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { ServicioclienteService } from '../serviciocliente/serviciocliente.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements AfterViewInit, OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarCliente();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarCliente();
  };

  cliente: any = [];
  cliente_send: any = [];
  cliente_referencia_proforma_get: boolean = false;
  userConn: string;
  origen: string;

  @Output() codigoEvento = new EventEmitter<string>();
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('dt1') dt1: Table;

  options: veCliente[] = [];
  filteredOptions: Observable<veCliente[]>;

  clientes!: veCliente[];
  selecteclientes: veCliente[];
  searchValue: string | undefined;

  constructor(public dialogRef: MatDialogRef<ModalClienteComponent>, private api: ApiService,
    public servicioCliente: ServicioclienteService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public cliente_referencia_proforma: any, @Inject(MAT_DIALOG_DATA) public ventana: any) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.origen = ventana.ventana;
    // Verificar si cliente_referencia_proforma es null
    if (this.cliente_referencia_proforma != null) {
      // Accede a las propiedades del objeto aquí
      this.cliente_referencia_proforma_get = true;
    } else {
      // Manejo del caso en que el objeto es null
      this.cliente_referencia_proforma_get = false;
    }

    console.log(this.cliente_referencia_proforma_get);
  }

  ngOnInit() {
    this.input.nativeElement.focus();
  }

  ngAfterViewInit() {
    this.getClienteCatalogo();

    this.input.nativeElement.focus();
  }

  getClienteCatalogo() {
    this.spinner.show();

    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vecliente/catalogo/";
    return this.api.getAll('/venta/mant/vecliente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          this.clientes = this.cliente;
          console.log('data', datav);

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      })
  }

  getveClienteByID(cliente) {
    console.log(cliente?.data.codigo)
    this.cliente_send = cliente?.data;
  }

  private debounceTimer: any;
  onSearchChange(searchValue: string) {
    console.log(searchValue);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.dt1.filterGlobal(searchValue, 'contains');
    }, 750); // 300 ms de retardo
  }

  mandarCliente() {
    console.log("Cliente enviado:", this.cliente_send, "Origen:", this.origen);

    if (this.origen === "ventana_buscador") {
      this.servicioCliente.disparadorDeClienteBuscadorGeneral.emit({
        cliente: this.cliente_send,
      });
      this.close();
    }

    if (this.origen === "ventana_catalogo") {
      this.servicioCliente.disparadorDeClientes.emit({
        cliente: this.cliente_send,
      });
      this.close();
    }

    if (this.origen === "ventana_cliente_referencia") {
      this.servicioCliente.disparadorDeClienteReal.emit({
        cliente: this.cliente_send,
      });
      this.close();
    }

    if (this.cliente_referencia_proforma_get === false) {
      this.servicioCliente.disparadorDeClientes.emit({
        cliente: this.cliente_send,
      });
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
