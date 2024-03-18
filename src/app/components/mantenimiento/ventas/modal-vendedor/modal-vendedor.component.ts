import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { veVendedor } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { VendedorService } from '../serviciovendedor/vendedor.service';

@Component({
  selector: 'app-modal-vendedor',
  templateUrl: './modal-vendedor.component.html',
  styleUrls: ['./modal-vendedor.component.scss']
})
export class ModalVendedorComponent implements OnInit {

  @HostListener('dblclick') onDoubleClicked2(){
    this.mandarVendedor();
  };
    
  @HostListener("document:keydown.enter", []) unloadHandler0(event: KeyboardEvent) {
    this.mandarVendedor();
  }; 
  
  vendedor_get:any=[];
  public vendedor_view:string;

  public codigo:string='';
  public nombre: string = '';
  userConn: string;

  displayedColumns = ['codigo','descripcion'];

  dataSource = new MatTableDataSource<veVendedor>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: veVendedor[] = [];
  filteredOptions: Observable<veVendedor[]>;
  myControlCodigo = new FormControl<string | veVendedor>('');
  myControlDescripcion = new FormControl<string | veVendedor>('');

  constructor(private api: ApiService, public dialogRef: MatDialogRef<ModalVendedorComponent>,
    private serviciVendedor: VendedorService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    
  }

  ngOnInit(){

    this.getVendedorCatalogo();
  }

  private _filter(name: string): veVendedor[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toString().includes(filterValue));
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: veVendedor): any {
    return user && user.codigo ? user.codigo : '';
  }

  getVendedorCatalogo(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --catalogoVendedor";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
          
          this.dataSource = new MatTableDataSource(this.vendedor_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => {

        }
      })
  }

  getveVendedorbyId(codigo){
    this.vendedor_view = codigo;
    console.log(codigo);
  }

  mandarVendedor(){
    this.serviciVendedor.disparadorDeVendedores.emit({
      vendedor:this.vendedor_view,
    });
    this.close();
  }

  close(){
    this.dialogRef.close();
  }
}
