import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { vePuntoVenta } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { PuntoventaService } from '../servicio-punto-venta/puntoventa.service';

@Component({
  selector: 'app-catalogo-punto-venta',
  templateUrl: './catalogo-punto-venta.component.html',
  styleUrls: ['./catalogo-punto-venta.component.scss']
})
export class CatalogoPuntoVentaComponent implements OnInit {

 @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){
    this.mandarPtoVenta();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarPtoVenta();
  };

  pto_venta_get: any = [];
  origen_get:string;
  destino_get: string;
  almacen_get: string;
  public pto_venta_view: any = [];
  userConn: string;

  displayedColumns = ['codigo','descripcion','ubicacion'];

  dataSource = new MatTableDataSource<vePuntoVenta>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: vePuntoVenta[] = [];
  filteredOptions: Observable<vePuntoVenta[]>;
  myControlCodigo = new FormControl<string | vePuntoVenta>('');
  myControlDescripcion = new FormControl<string | vePuntoVenta>('');
  myControlUbicacion = new FormControl<string | vePuntoVenta>('');

  constructor(private api:ApiService, public dialogRef: MatDialogRef<CatalogoPuntoVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public origen: any, @Inject(MAT_DIALOG_DATA) public destino: any,
    public servicesPuntoVenta:PuntoventaService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
  }

  ngOnInit(){
    this.getPtoVenta();
    
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

  private _filter(name: string): vePuntoVenta[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.descripcion.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: vePuntoVenta): string {
    return user && user.descripcion ? user.descripcion : '';
  }

  getPtoVenta(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/venta/mant/veptoventa/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.pto_venta_get = datav;
          console.log(this.pto_venta_get);

          this.dataSource = new MatTableDataSource(this.pto_venta_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarPtoVenta(){
    this.servicesPuntoVenta.disparadorDePuntosVenta.emit({
      punto_venta:this.pto_venta_view,
    });

   this.close();
  }

  getDescripcionView(element){
    this.pto_venta_view = element;
    console.log(this.pto_venta_view);
  }

  close(){
    this.dialogRef.close();
  }

}
