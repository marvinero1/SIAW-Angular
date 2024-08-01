import { Component, ElementRef, HostListener, OnInit, ViewChild, Inject, ViewChildren, QueryList } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { veCliente } from '@services/modelos/objetos';
import { ServicioclienteService } from '../serviciocliente/serviciocliente.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Table } from 'primeng/table';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarCliente();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarCliente();
  };

  private debounceTimer: any;

  cliente: any = [];
  cliente_send: any = [];
  cliente_referencia_proforma_get: boolean = false;
  userConn: string;
  origen: string;

  clientes!: veCliente[];
  selecteclientes: veCliente[];
  searchValue: string | undefined;

  @ViewChild('dt1') dt1: Table;
  @ViewChildren('para') paras: QueryList<ElementRef>;

  constructor(public dialogRef: MatDialogRef<ModalClienteComponent>, private dialog: MatDialog, private api: ApiService,
    public servicioCliente: ServicioclienteService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public cliente_referencia_proforma: any,
    @Inject(MAT_DIALOG_DATA) public ventana: any) {
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
    this.getClienteCatalogo();
  }

  getClienteCatalogo() {
    this.spinner.show();

    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vecliente/catalogo/";
    return this.api.getAll('/venta/mant/vecliente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          this.clientes = datav;
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
        if (element.nativeElement.textContent.trim().includes(searchValue)) {
          element.nativeElement.focus();
          focused = true;
          break;
        }
      }

      if (!focused) {
        console.warn('No se encontró ningún elemento para hacer focus');
      }
    }, 750); // 750 ms de retardo
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
      // window.alert("Como el cliente: " + this.cliente_send.codigo + " es casual y/o referencia, debe identificar el VENDEDOR que realiza la operacion, por defecto se pondra el codigo del vendedor del ! CLIENTE REFERENCIA O CASUAL !");
      const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
        width: 'auto',
        height: 'auto',
        data: { mensaje_dialog: "Como el cliente: " + this.cliente_send.codigo + " es casual y/o referencia, debe identificar el VENDEDOR que realiza la operacion, por defecto se pondra el codigo del vendedor del ! CLIENTE REFERENCIA O CASUAL !" },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          this.servicioCliente.disparadorDeClienteReal.emit({
            cliente: this.cliente_send,
          });
          this.close();
        } else {
          this.servicioCliente.disparadorDeClienteReal.emit({
            cliente: this.cliente_send,
          });
          this.close();
        }
      });
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
