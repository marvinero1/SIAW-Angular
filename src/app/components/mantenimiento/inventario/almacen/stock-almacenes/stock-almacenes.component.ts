import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { Item } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stock-almacenes',
  templateUrl: './stock-almacenes.component.html',
  styleUrls: ['./stock-almacenes.component.scss']
})
export class StockAlmacenesComponent implements OnInit {

  userConn: string;
  options: Item[] = [];
  items: any = [];
  almacen: any = [];
  changedData: any[] = [];  
  updatedRowData:any=[]
  
  index: number;
  sminimo: number;
  smaximo: number;
  punto_pedido: number;
  codalmpedidos: number;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  myControl = new FormControl<string | Item>('');
  filteredOptions: Observable<Item[]>;

  displayedColumns = ['item', 'descripcion', 'medida', 'smin', 'smax', 'ptopedido', 'unidad', 'codalmpedido'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(public dialog: MatDialog, private api: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public nombre_ventana_service: NombreVentanaService, public log_module: LogService, public router: Router,
    @Inject(MAT_DIALOG_DATA) public cod_almacen_stock: any, public dialogRef: MatDialogRef<StockAlmacenesComponent>) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
    this.almacen = cod_almacen_stock.cod_almacen_stock;

  }

  ngOnInit() {
    this.cargarTablaItems();
  }

  cargarTablaItems() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/abminstockalm/stockAlm/'+this.userConn+"/"+this.almacen.codigo)
      .subscribe({
        next: (datav) => {
          this.items = datav;
          console.log(this.items);

          this.dataSource = new MatTableDataSource(this.items);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  private _filter(name: string): Item[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: Item): string {
    return user && user.codigo ? user.codigo : '';
  }

  submitData() { 

  }


  onInputChange(rowData: any, newValue: any, name_change:any) {
    const valorInput = (newValue.target as HTMLInputElement).value;
    let valor = valorInput;
    valor = valor.replace(",", ".");
    let numero = Number(valor);
    console.log(numero, name_change);

    const isDuplicate = this.changedData.some(item => this.areObjectsEqual(item, { ...rowData, value: item }));
  
    
    
    switch (name_change) {
      case "smin":
        // Encuentra el índice de rowData en changedData
        this.index = this.changedData.findIndex(item => item.id === rowData.id);
        this.updatedRowData = { ...rowData, smin: numero };
        // Si la fila ya está en changedData, actualiza su valor
        if (!isDuplicate) {
          // Si la fila no está en changedData, agrega la fila completa con el nuevo valor
          
          this.changedData.push(this.updatedRowData);
        }
        break;
      case "smax":
        // Encuentra el índice de rowData en changedData
        this.index = this.changedData.findIndex(item => item.id === rowData.id);
        
        // Si la fila ya está en changedData, actualiza su valor

          // Si la fila no está en changedData, agrega la fila completa con el nuevo valor
          this.updatedRowData = { ...rowData, smax: numero };
          this.changedData.push(this.updatedRowData);
        
        break;
      case "ptopedido":
        // Encuentra el índice de rowData en changedData
        this.index = this.changedData.findIndex(item => item.id === rowData.id);
        
        // Si la fila ya está en changedData, actualiza su valor

          // Si la fila no está en changedData, agrega la fila completa con el nuevo valor
          this.updatedRowData = { ...rowData, ptopedido: numero };
          this.changedData.push(this.updatedRowData);
        
        break;
      case "codalmpedido":
        // Encuentra el índice de rowData en changedData
        this.index = this.changedData.findIndex(item => item.id === rowData.id);
        
        // Si la fila ya está en changedData, actualiza su valor

          // Si la fila no está en changedData, agrega la fila completa con el nuevo valor
          this.updatedRowData = { ...rowData, codalmpedido: numero };
          this.changedData.push(this.updatedRowData);
        
        break;
      default:
        console.log("NO HAY CAMBIOS!");
        break;
    }





    // Encuentra el índice de rowData en changedData
    const index = this.changedData.findIndex(item => item.id === rowData.id);
    
    // Si la fila ya está en changedData, actualiza su valor
    // if (index !== -1) {
    //   this.changedData[index].smin = numero;
    // } else {
    //   // Si la fila no está en changedData, agrega la fila completa con el nuevo valor
    //   const updatedRowData = { ...rowData, smin: numero };
    //   this.changedData.push(updatedRowData);
    // }

    console.log(this.changedData);
  }


  areObjectsEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      
      console.log("MISMO TAMANIO");
      return false;
    }
    
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        console.log("NO ESTA EN EL ARRAY");
        return false;
      }
    }
    console.log("YA ESTA EN EL ARRAY");
    
    return true;
  }

  close(){
    this.dialogRef.close();
  }
}
