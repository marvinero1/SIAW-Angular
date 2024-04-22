import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { CatalogoInventario } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicioInventarioService } from '../servicio-inventario/servicio-inventario.service';

@Component({
  selector: 'app-catalogo-inventario',
  templateUrl: './catalogo-inventario.component.html',
  styleUrls: ['./catalogo-inventario.component.scss']
})
export class CatalogoInventarioComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarInventario();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarInventario();
  };

  inventario_get:any=[];
  public inventario_view: any = [];
  userConn: string;

  displayedColumns = ['id','descripcion'];

  dataSource = new MatTableDataSource<CatalogoInventario>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  @ViewChild("primera_fila") myInputField: ElementRef;

  options: CatalogoInventario[] = [];
  filteredOptions: Observable<CatalogoInventario[]>;
  myControlCodigo = new FormControl<string | CatalogoInventario>('');

  myControlDescripcion = new FormControl<string | CatalogoInventario>('');

  constructor(private api:ApiService, public dialogRef: MatDialogRef<CatalogoInventarioComponent>,
    private servicioInventario: ServicioInventarioService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
    this.getInventarios();
  }

  ngOnInit(){
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
    
    this.myInputField.nativeElement.focus();
  }


  private _filter(name: string): CatalogoInventario[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: CatalogoInventario): string {
    return user && user.id ? user.id : '';
  }

  getInventarios(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/oper/prgcrearinv/catalogointipoinv/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.inventario_get = datav;
          console.log(this.inventario_get);

          this.dataSource = new MatTableDataSource(this.inventario_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarInventario(){
    this.servicioInventario.disparadorDeInventarios.emit({
      inventario:this.inventario_view,
    });

   this.close();
  }

  getDescripcionView(element){
    this.inventario_view = element;
    console.log(this.inventario_view);
  }

  close(){
    this.dialogRef.close();
  }
}
