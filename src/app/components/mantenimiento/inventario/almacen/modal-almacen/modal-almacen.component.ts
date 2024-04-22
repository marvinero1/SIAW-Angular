import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { inAlmacen } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicioalmacenService } from '../servicioalmacen/servicioalmacen.service';

@Component({
  selector: 'app-modal-almacen',
  templateUrl: './modal-almacen.component.html',
  styleUrls: ['./modal-almacen.component.scss']
})
export class ModalAlmacenComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){
    this.mandarAlmacen();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarAlmacen();
  };

  agencia_get: any = [];
  origen_get:string;
  destino_get: string;
  almacen_get: string;
  public agencia_view: any = [];
  userConn: any;

  displayedColumns = ['codigo','descripcion'];

  dataSource = new MatTableDataSource<inAlmacen>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: inAlmacen[] = [];
  filteredOptions: Observable<inAlmacen[]>;
  myControlCodigo = new FormControl<string | inAlmacen>('');
  myControlDescripcion = new FormControl<string | inAlmacen>('');

  constructor(private api:ApiService, public dialogRef: MatDialogRef<ModalAlmacenComponent>,
    private servicioAlmacen: ServicioalmacenService, @Inject(MAT_DIALOG_DATA) public origen: any,
    @Inject(MAT_DIALOG_DATA) public destino: any, @Inject(MAT_DIALOG_DATA) public almacen: any) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
  }

  ngOnInit(){
    this.getAlmacen();

    this.origen_get = this.origen.origen;
    this.destino_get = this.destino.destino;
    this.almacen_get = this.almacen.almacen;

    console.log(this.origen_get, this.destino_get);
    
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

  private _filter(name: string): inAlmacen[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.direccion.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: inAlmacen): string {
    return user && user.direccion ? user.direccion : '';
  }

  getAlmacen(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo2/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo2/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.agencia_get = datav;
          console.log(this.agencia_get);

          this.dataSource = new MatTableDataSource(this.agencia_get);
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
    if (this.origen_get) {
      this.servicioAlmacen.disparadorDeAlmacenesOrigen.emit({
        almacen:this.agencia_view,
      });
    }if(this.destino_get){
      this.servicioAlmacen.disparadorDeAlmacenesDestino.emit({
        almacen:this.agencia_view,
      });
    } if (this.almacen_get){
      this.servicioAlmacen.disparadorDeAlmacenes.emit({
        almacen:this.agencia_view,
      });
    }
   this.close();
  }

  getDescripcionView(element){
    this.agencia_view = element;
    console.log(this.agencia_view);
  }

  close(){
    this.dialogRef.close();
  }
}
