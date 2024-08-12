import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { vetiposoldesct } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { DocumentoVentaService } from '../documento-venta-service/documento-venta.service';
@Component({
  selector: 'app-catalogo-documento-venta',
  templateUrl: './catalogo-documento-venta.component.html',
  styleUrls: ['./catalogo-documento-venta.component.scss']
})
export class CatalogoDocumentoVentaComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarDocumento();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarDocumento();
  };

  vendedor_get: any = [];
  public vendedor_view: any = [];

  public codigo: string = '';
  public nombre: string = '';
  userConn: string;

  displayedColumns = ['id', 'descripcion', 'nroactual'];

  dataSource = new MatTableDataSource<vetiposoldesct>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: vetiposoldesct[] = [];
  filteredOptions: Observable<vetiposoldesct[]>;
  myControlCodigo = new FormControl<string | vetiposoldesct>('');
  myControlDescripcion = new FormControl<string | vetiposoldesct>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<CatalogoDocumentoVentaComponent>,
    public documentoServicio: DocumentoVentaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

  }

  ngOnInit() {
    this.getDocumentoVentaCatalogo();
  }

  private _filter(name: string): vetiposoldesct[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toString().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: vetiposoldesct): any {
    return user && user.id ? user.id : '';
  }

  getDocumentoVentaCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --catalogoVendedor";
    return this.api.getAll('/venta/mant/venumeracion/catalogoGeneral/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;

          this.dataSource = new MatTableDataSource(this.vendedor_get);
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
    this.vendedor_view = codigo;
    console.log(codigo);
  }

  mandarDocumento() {
    this.documentoServicio.disparadorDeDocDeVenta.emit({
      documento: this.vendedor_view,
    });
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
