import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { inConcepto } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { MovimientomercaderiaService } from '../serviciomovimientomercaderia/movimientomercaderia.service';

@Component({
  selector: 'app-catalogo-movimiento-mercaderia',
  templateUrl: './catalogo-movimiento-mercaderia.component.html',
  styleUrls: ['./catalogo-movimiento-mercaderia.component.scss']
})
export class CatalogoMovimientoMercaderiaComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarConcepto();
  };

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarConcepto();
  };

  concepto: any = [];
  public concepto_view: any = [];
  data: any = [];
  userConn: any;

  displayedColumns = ['codigo', 'descripcion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  myControl = new FormControl<string | inConcepto>('');
  filteredOptions: Observable<inConcepto[]>;

  options: inConcepto[] = [];
  myControlCodigo = new FormControl<string | inConcepto>('');
  myControlDescrip = new FormControl<string | inConcepto>('');

  nombre_ventana: string = "abminconcepto.vb";
  public ventana = "Numeración de Concepto de Notas de Movimiento de Mercaderia"
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CatalogoMovimientoMercaderiaComponent>, public movimientoMercaderia: MovimientomercaderiaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllConceptoCatalogo();

    this.filteredOptions = this.myControlCodigo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlDescrip.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllConceptoCatalogo() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inconcepto/";
    return this.api.getAll('/inventario/mant/inconcepto/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.concepto = datav;

          this.dataSource = new MatTableDataSource(this.concepto);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  private _filter(name: string): inConcepto[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: inConcepto): string {
    return user && user.codigo ? user.codigo : '';
  }

  mandarConcepto() {
    this.movimientoMercaderia.disparadorDeConceptos.emit({
      concepto: this.concepto_view,
    });

    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  getDescripcionView(element) {
    this.concepto_view = element;
    console.log(this.concepto_view);
  }
}
