import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { Rubro } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServiciorubroService } from '../servicio/serviciorubro.service';

@Component({
  selector: 'app-modal-rubro',
  templateUrl: './modal-rubro.component.html',
  styleUrls: ['./modal-rubro.component.scss']
})
export class ModalRubroComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){
    this.mandarAlmacen();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarAlmacen();
  };

  rubro_get:any=[];
  public rubro_view:any=[];

  displayedColumns = ['codigo','descripcion'];

  dataSource = new MatTableDataSource<Rubro>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: Rubro[] = [];
  filteredOptions: Observable<Rubro[]>;
  myControlCodigo = new FormControl<string | Rubro>('');
  myControlDescripcion = new FormControl<string | Rubro>('');

  constructor(private api:ApiService, public dialogRef: MatDialogRef<ModalRubroComponent>,
    private servicioRubro:ServiciorubroService){
  }

  ngOnInit(){
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAlmacen(userConn);

    this.filteredOptions = this.myControlCodigo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
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

  private _filter(name: string): Rubro[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: Rubro): string {
    return user && user.codigo ? user.codigo : '';
  }

  getAlmacen(useConn){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/venta/mant/verubro/'+ useConn)
      .subscribe({
        next: (datav) => {
          this.rubro_get = datav;
          console.log(this.rubro_get);

          this.dataSource = new MatTableDataSource(this.rubro_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarAlmacen(){
    this.servicioRubro.disparadorDeRubro.emit({
      rubro:this.rubro_view,
    });

   this.close();
  }

  getDescripcionView(element){
    this.rubro_view = element;
    console.log(this.rubro_view);
  }

  close(){
    this.dialogRef.close();
  }
}
