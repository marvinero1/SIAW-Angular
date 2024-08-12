import { Component, EventEmitter, HostListener, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veCliente } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';
import { ClientesIgulesService } from '../servicio-clientes-iguales/clientes-igules.service';
import { ModalClienteComponent } from '../../modal-cliente/modal-cliente.component';

@Component({
  selector: 'app-catalogo-clientes-iguales',
  templateUrl: './catalogo-clientes-iguales.component.html',
  styleUrls: ['./catalogo-clientes-iguales.component.scss']
})
export class CatalogoClientesIgualesComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarCliente();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarCliente();
  };

  cliente: any = [];
  cliente_send: any = [];
  public codigo: string = '';
  public nombre: string = '';
  condicional: any;

  @Output() codigoEvento = new EventEmitter<string>();

  displayedColumns = ['codigo', 'nombre', 'nit', 'direccion_titular'];

  dataSource = new MatTableDataSource<veCliente>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControlCodigo = new FormControl<string | veCliente>('');
  myControlNombre = new FormControl<string | veCliente>('');
  myControlNIT = new FormControl<string | veCliente>('');
  myControlDireccion = new FormControl<string | veCliente>('');

  options: veCliente[] = [];
  filteredOptions: Observable<veCliente[]>;

  userConn: any;

  constructor(public dialogRef: MatDialogRef<ModalClienteComponent>, private api: ApiService, private spinner: NgxSpinnerService,
    public servicioCliente: ClientesIgulesService, @Inject(MAT_DIALOG_DATA) public dataCatalogo: any) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.condicional = this.dataCatalogo.dataCatalogo;

    console.log(this.condicional);
  }

  ngOnInit() {
    this.getClienteCatalogo();

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
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getveClienteByID(cliente) {
    this.cliente_send = cliente;
  }

  mandarCliente() {
    if (this.condicional == 'A') {
      this.servicioCliente.disparadorDeClienteA.emit({
        cliente: this.cliente_send,
      });

    } if (this.condicional == 'B') {
      this.servicioCliente.disparadorDeClienteB.emit({
        cliente: this.cliente_send,
      });
    }
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
