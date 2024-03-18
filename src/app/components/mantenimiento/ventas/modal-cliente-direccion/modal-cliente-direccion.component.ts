import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veTiendaDireccion } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ServicioclienteService } from '../serviciocliente/serviciocliente.service';
@Component({
  selector: 'app-modal-cliente-direccion',
  templateUrl: './modal-cliente-direccion.component.html',
  styleUrls: ['./modal-cliente-direccion.component.scss']
})
export class ModalClienteDireccionComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){
    this.mandarDireccion();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarDireccion();
  };

  direccion:any=[];
  public direccion_view: any = [];
  userConn: any;

  displayedColumns = ['telefono','direccion','central'];
  dataSourceDirecciones = new MatTableDataSource<veTiendaDireccion>();
  dataSourceWithPageSize = new MatTableDataSource();
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  options: veTiendaDireccion[] = [];
  filteredOptions: Observable<veTiendaDireccion[]>;
  myControlDireccion = new FormControl<string | veTiendaDireccion>('');
  myControlTelefono = new FormControl<string | veTiendaDireccion>('');

  constructor(public dialogRef: MatDialogRef<ModalClienteDireccionComponent>,private api:ApiService,
    public servicioCliente:ServicioclienteService, @Inject(MAT_DIALOG_DATA) public cod_cliente: any){
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit(){
    
    this.getDireccionCentral(this.cod_cliente.cod_cliente);

    this.filteredOptions = this.myControlDireccion.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.direccion;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.filteredOptions = this.myControlTelefono.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.telefono;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }
  
  private _filter(name: string): veTiendaDireccion[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.direccion.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDirecciones.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSourceDirecciones.filter);
  }

  displayFn(user: veTiendaDireccion): string {
    return user && user.direccion ? user.direccion : '';
  }

  getDireccionCentral(cod_cliente){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vetienda/catalogo/'+this.userConn+"/"+cod_cliente)
      .subscribe({
        next: (datav) => {
          this.direccion = datav;
          console.log(this.direccion);

          this.dataSourceDirecciones = new MatTableDataSource(this.direccion);
          this.dataSourceDirecciones.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDireccionView(nombre){
    this.direccion_view = nombre;
    console.log(nombre);
  }

  mandarDireccion(){
    this.servicioCliente.disparadorDeDireccionesClientes.emit({
      direccion:this.direccion_view,
    });

    this.close();
  }

  close(){
    this.dialogRef.close();
  }
}
