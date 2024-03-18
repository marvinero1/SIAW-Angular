import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ApiService } from '@services/api.service';
import { fndeudor } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { DeudorCatalogoService } from '../deudor-servicio/deudor-catalogo.service';

@Component({
  selector: 'app-deudores-catalogo',
  templateUrl: './deudores-catalogo.component.html',
  styleUrls: ['./deudores-catalogo.component.scss']
})
export class DeudoresCatalogoComponent implements OnInit {

 @HostListener('dblclick') onDoubleClicked2(){
    this.mandarDeudor();
  };
    
  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarDeudor();
  }; 
  
  deudor_get:any=[];
  public deudor_view:any=[];
  userConn: string;

  displayedColumns = ['codigo','descripcion'];

  dataSource = new MatTableDataSource<fndeudor>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: fndeudor[] = [];
  filteredOptions: Observable<fndeudor[]>;
  myControlCodigo = new FormControl<string | fndeudor>('');
  myControlDescripcion = new FormControl<string | fndeudor>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<DeudoresCatalogoComponent>,
    private servicioDeudor: DeudorCatalogoService){
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getDeudorCatalogo();
  }

  ngOnInit(){
  }

  private _filter(name: string): fndeudor[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toString().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: fndeudor): any {
    return user && user.id ? user.id : '';
  }

  getDeudorCatalogo(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/fondos/mant/fndeudor/catalogo/";
    return this.api.getAll('/fondos/mant/fndeudor/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.deudor_get = datav;
          console.log( this.deudor_get);

          this.dataSource = new MatTableDataSource(this.deudor_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  getveVendedorbyId(deudor){
    this.deudor_view = deudor;
    console.log(deudor);
  }

  mandarDeudor(){
    this.servicioDeudor.disparadorDeDeudor.emit({
      deudor:this.deudor_view,
    });
    this.close();
  }

  close(){
    this.dialogRef.close();
  }
}
