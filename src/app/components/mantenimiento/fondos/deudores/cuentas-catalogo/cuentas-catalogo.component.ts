import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { ApiService } from '@services/api.service';
import { cncuenta } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cuentas-catalogo',
  templateUrl: './cuentas-catalogo.component.html',
  styleUrls: ['./cuentas-catalogo.component.scss']
})
export class CuentasCatalogoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent){
    this.mandarTipoId();
  };

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarTipoId();
  };
  
  id_tipo:any=[];
  public codigo:string='';
  public tipo_view:string;
  public numero_id: string;
  userConn: any;

  displayedColumns = ['codigo','descripcion'];

  dataSource = new MatTableDataSource<cncuenta>();
  dataSourceWithPageSize = new MatTableDataSource();
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  myControlCodigo = new FormControl<string | cncuenta>('');
  myControlDescripcion = new FormControl<string | cncuenta>('');

  options: cncuenta[] = [];
  filteredOptions: Observable<cncuenta[]>;

  constructor(public dialogRef: MatDialogRef<CuentasCatalogoComponent>,private api:ApiService,private spinner: NgxSpinnerService,
    public servicioTipoID:TipoidService){

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.getIdTipo();
  }

  ngOnInit(){

  }

  private _filter(name: string): cncuenta[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: cncuenta): string {
    return user && user.codigo ? user.codigo : '';
  }

  getIdTipo(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/contab/mant/cncuenta/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', datav);
          
          this.dataSource = new MatTableDataSource(this.id_tipo);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  getIdTipoView(codigo){
    this.tipo_view = codigo;
  }

  mandarTipoId(){
    this.servicioTipoID.disparadorDeIDTipo.emit({
      id_tipo:this.tipo_view,
      // numero_id:
    });

    this.close();
  }
  
  close(){
    this.dialogRef.close();
  }


}
