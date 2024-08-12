import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { inMovimiento } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { NotasMovimientoService } from '../serviciocatalogonotasmovimiento/notas-movimiento.service';

@Component({
  selector: 'app-catalogo-notas-movimiento',
  templateUrl: './catalogo-notas-movimiento.component.html',
  styleUrls: ['./catalogo-notas-movimiento.component.scss']
})
export class CatalogoNotasMovimientoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    console.log("Hola Lola ENTER");

    this.mandarMovimiento();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarMovimiento();
  };

  movimiento_get: any = [];
  public movimiento_view: any = [];
  movimiento_view_get: any;

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource<inMovimiento>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: inMovimiento[] = [];
  filteredOptions: Observable<inMovimiento[]>;
  myControlCodigo = new FormControl<string | inMovimiento>('');
  myControlDescripcion = new FormControl<string | inMovimiento>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<CatalogoNotasMovimientoComponent>,
    public movientoService: NotasMovimientoService) {

  }

  ngOnInit() {
    let userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.getNotasMovimiento(userConn);

    this.filteredOptions = this.myControlCodigo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlDescripcion.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.descripcion;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private _filter(name: string): inMovimiento[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: inMovimiento): string {
    return user && user.id ? user.id : '';
  }

  getNotasMovimiento(useConn) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/intipomovimiento/catalogo/' + useConn)
      .subscribe({
        next: (datav) => {
          this.movimiento_get = datav;
          console.log(this.movimiento_get);

          this.dataSource = new MatTableDataSource(this.movimiento_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarMovimiento() {
    this.movientoService.disparadorDeNotasMovimiento.emit({
      movimiento: this.movimiento_view,
    });

    this.close();
  }

  getDescripcionView(element) {
    this.movimiento_view = element;
    console.log(this.movimiento_view);
  }

  close() {
    this.dialogRef.close();
  }

}
