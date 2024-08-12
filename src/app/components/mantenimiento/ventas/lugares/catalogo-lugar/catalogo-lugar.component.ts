import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veLugar } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { LugarService } from '../lugar-services/lugar.service';

@Component({
  selector: 'app-catalogo-lugar',
  templateUrl: './catalogo-lugar.component.html',
  styleUrls: ['./catalogo-lugar.component.scss']
})
export class CatalogoLugarComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarLugar();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarLugar();
  };

  lugar_get: any = [];
  public lugar_view: string;
  userConn: any;

  public codigo: string = '';
  public nombre: string = '';

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<veLugar>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: veLugar[] = [];
  filteredOptions: Observable<veLugar[]>;
  myControlCodigo = new FormControl<string | veLugar>('');
  myControlDescripcion = new FormControl<string | veLugar>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<CatalogoLugarComponent>, public lugar_service: LugarService) {
  }

  ngOnInit() {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.getLugaresCatalogo(this.userConn);
  }

  private _filter(name: string): veLugar[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toString().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: veLugar): any {
    return user && user.codigo ? user.codigo : '';
  }

  getLugaresCatalogo(userConn) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --catalogoVendedor";
    return this.api.getAll('/venta/mant/velugar/catalogo/' + userConn)
      .subscribe({
        next: (datav) => {
          this.lugar_get = datav;

          this.dataSource = new MatTableDataSource(this.lugar_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getveVendedorbyId(codigo) {
    this.lugar_view = codigo;
    console.log(codigo);
  }

  mandarLugar() {
    this.lugar_service.disparadorDeLugares.emit({
      lugar: this.lugar_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
