import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veVendedor } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
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
  public vendedor_view: string;

  public codigo: string = '';
  public nombre: string = '';
  userConn: string;

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<veVendedor>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('tabla') tabla: Table;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  vendedors!: veVendedor[];
  selectevendedors: veVendedor[];
  loading: boolean = false;
  filteredVendedors: any[] = [];
  searchValue: string | undefined;

  options: veVendedor[] = [];
  filteredOptions: Observable<veVendedor[]>;
  myControlCodigo = new FormControl<string | veVendedor>('');
  myControlDescripcion = new FormControl<string | veVendedor>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<ModalVendedorComponent>,
    private serviciVendedor: VendedorService, private elementRef: ElementRef) {


    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit() {
    this.getVendedorCatalogo();
  }

  getVendedorCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --catalogoVendedor";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
          this.vendedors = this.vendedor_get;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          // this.selectevendedors = this.vendedor_get[0];
        }
      })
  }

  getveVendedorbyId(element) {
    this.vendedor_view = element?.data.codigo;
    console.log(this.vendedor_view);
  }

  mandarVendedor() {
    this.serviciVendedor.disparadorDeVendedores.emit({
      vendedor: this.vendedor_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
