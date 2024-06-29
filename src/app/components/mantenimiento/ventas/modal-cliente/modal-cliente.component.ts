import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veCliente } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicioclienteService } from '../serviciocliente/serviciocliente.service';
import { NgxSpinnerService } from 'ngx-spinner';
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

  public codigo: string = '';
  public nombre: string = '';

  @Output() codigoEvento = new EventEmitter<string>();

  displayedColumns = ['codigo', 'nombre', 'nit', 'direccion_titular'];

  dataSource = new MatTableDataSource<veCliente>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  myControlCodigo = new FormControl<string | veCliente>('');
  myControlNombre = new FormControl<string | veCliente>('');
  myControlNIT = new FormControl<string | veCliente>('');
  myControlDireccion = new FormControl<string | veCliente>('');

  options: veCliente[] = [];
  filteredOptions: Observable<veCliente[]>;

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
    this.filteredOptions = this.myControlCodigo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlNombre.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre_comercial;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlNIT.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nit;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlDireccion.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.direccion_titular;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  ngAfterViewInit() {
    this.getClienteCatalogo();
    this.input.nativeElement.focus();
  }

  private _filter(name: string): veCliente[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: veCliente): string {
    return user && user.codigo ? user.codigo : '';
  }

  getClienteCatalogo() {
    this.spinner.show();

    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vecliente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          console.log('data', datav);

          this.dataSource = new MatTableDataSource(this.cliente);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
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
    this.cliente_send = cliente;
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
