import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { adProvincia } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ProvinciasService } from '../services-provincias/provincias.service';

@Component({
  selector: 'app-provincias-catalogo',
  templateUrl: './provincias-catalogo.component.html',
  styleUrls: ['./provincias-catalogo.component.scss']
})
export class ProvinciasCatalogoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){
    this.mandarProvincia();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarProvincia();
  };

  provincia_get: any = [];
  origen_get:string;
  destino_get: string;
  almacen_get: string;
  userConn: any;
  public provincia_view:any=[];

  displayedColumns = ['codigo','nombre','departamento'];

  dataSource = new MatTableDataSource<adProvincia>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: adProvincia[] = [];
  filteredOptions: Observable<adProvincia[]>;
  myControlCodigo = new FormControl<string | adProvincia>('');
  myControlDescripcion = new FormControl<string | adProvincia>('');

  constructor(private api:ApiService, public dialogRef: MatDialogRef<ProvinciasCatalogoComponent>,
    private servicioProvincia: ProvinciasService) {
  }

  ngOnInit(){
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getProvincia();

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
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private _filter(name: string): adProvincia[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: adProvincia): string {
    return user && user.nombre ? user.nombre : '';
  }

  getProvincia(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/seg_adm/mant/adprovincia/catalogo_depto/"
    return this.api.getAll('/seg_adm/mant/adprovincia/catalogo_depto/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.provincia_get = datav;
          console.log(this.provincia_get);

          this.dataSource = new MatTableDataSource(this.provincia_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarProvincia(){
    this.servicioProvincia.disparadorDeProvincias.emit({
      provincia:this.provincia_view,
    });

   this.close();
  }

  getDescripcionView(element){
    this.provincia_view = element;
    console.log(this.provincia_view);
  }

  close(){
    this.dialogRef.close();
  }
}
