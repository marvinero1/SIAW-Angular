import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { inTarifa } from '@services/modelos/objetos';
import { ServicioprecioventaService } from '../servicioprecioventa/servicioprecioventa.service';
@Component({
  selector: 'app-modal-precio-venta',
  templateUrl: './modal-precio-venta.component.html',
  styleUrls: ['./modal-precio-venta.component.scss']
})
export class ModalPrecioVentaComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){    
    this.mandarPrecioVenta();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarPrecioVenta();
  };
  
  tarifa_get:any=[];
  precio_view: any = [];
  userConn: string;
  usuario: string;

  displayedColumns = ['codigo', 'descripcion'];
  
  dataSource = new MatTableDataSource<inTarifa>();
  dataSourceWithPageSize = new MatTableDataSource();
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  myControlCodigo = new FormControl<string | inTarifa>('');
  myControlDescripcion = new FormControl<string | inTarifa>('');

  options: inTarifa[] = [];
  filteredOptions: Observable<inTarifa[]>;

  constructor(public dialogRef: MatDialogRef<ModalPrecioVentaComponent>,private api:ApiService,private spinner: NgxSpinnerService,
    public servicioPrecioVenta: ServicioprecioventaService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getTarifa();
  }

  private _filter(name: string): inTarifa[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toString().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: inTarifa): any {
    return user && user.codigo ? user.codigo : '';
  }

  getTarifa(){ 
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    
    return this.api.getAll('/inventario/mant/intarifa/catalogo/'+this.userConn+"/"+this.usuario)
      .subscribe({
        next: (datav) => {
          this.tarifa_get = datav;
          console.log(this.tarifa_get);
          
          this.dataSource = new MatTableDataSource(this.tarifa_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTarifabyId(precio_venta){
    this.precio_view = precio_venta;
    console.log(precio_venta);
  }

  mandarPrecioVenta(){
    this.servicioPrecioVenta.disparadorDePrecioVenta.emit({
      precio_venta:this.precio_view,
    });
    this.close();
  }

  close(){
    this.dialogRef.close();
  }
}
