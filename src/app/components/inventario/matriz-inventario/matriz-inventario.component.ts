import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-matriz-inventario',
  templateUrl: './matriz-inventario.component.html',
  styleUrls: ['./matriz-inventario.component.scss']
})
export class MatrizInventarioComponent implements OnInit {

  @HostListener("document:keyup.RIGHT_ARROW", []) unloadHandler0(event: Event){
    console.log("No se puede actualizar"); 

  }

  id_tipo:any=[];
  hojas:any=[];
  item_obtenido:any=[];

  FormularioBusqueda:FormGroup
  dataform:any='';
  num_hoja:number=0;
  cantidad:number;
  value:any;
  item_valido:boolean;
  BD_storage:any;
  userConn:any;

  activeCell: { row: number, column: string } = { row: -1, column: '' };

  private codigo_item_catalogo:string;
  private cantidad_item_matriz:number;

  displayedColumns = ['a','b','c','d','e','f','g','h','i','j','k','l','m'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild("dialogD") dialogD: ElementRef;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  constructor(private api:ApiService, public dialog: MatDialog,public dialogRef: MatDialogRef<MatrizInventarioComponent>, 
    private servicioItem: ItemServiceService, private toastr: ToastrService) {
    
      this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  }

  ngOnInit(){
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
    this.getHojaPorDefecto(userConn);
  }

  getlineaProductoID(value){
    //se le quita el espacio en blanco que tiene
    const cleanText = value.replace(/\s+/g,"").trim();
    console.log('item seleccionado:', cleanText);
    
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/initem/'+userConn+"/"+cleanText)
      .subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
          // console.log('item seleccionado data: ', this.item_obtenido);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllHoja(hoja){
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/'+userConn+"/"+hoja)
      .subscribe({
        next: (datav) => {
          this.hojas = datav;
          console.log(this.hojas);

          this.dataSource = new MatTableDataSource(this.hojas);

          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getHojaPorDefecto(userConn){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inmatriz/'+userConn+"/01")
      .subscribe({
        next: (datav) => {
          this.hojas = datav;
          console.log(this.hojas);

          this.dataSource = new MatTableDataSource(this.hojas);

          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  buscadorHoja(){
    let userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    console.log(this.num_hoja);
    if(this.num_hoja == 0){
      this.getHojaPorDefecto(userConn);
    }else{
      this.getAllHoja(this.num_hoja);
    }
  }

  isActiveCell(row: number, column: string): boolean {
    return this.activeCell.row === row && this.activeCell.column === column;
  }

  getinMatrizByID(value){
    const cleanText = value.replace(/\s+/g, "").trim();
    this.value = cleanText.toUpperCase();
    
    console.log(this.value);

    this.getlineaProductoID(this.value);
    
  }

  mandarItem(value){
    console.log("Holass");
    
    const cleanText = value.replace(/\s+/g, " ").trim();
    console.log( cleanText );

    this.servicioItem.disparadorDeItems.emit({
      item:cleanText,
      cantidad:this.cantidad,
      
    });
  }

  close(){
    this.dialogRef.close();
  }

}
