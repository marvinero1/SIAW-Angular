import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { banco, fnTipoRetiro } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { BancoEditComponent } from './banco-edit/banco-edit.component';
import { BancoCreateComponent } from './banco-create/banco-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss']
})
export class BancoComponent implements OnInit {

  banco:any=[]; 
  data:[];
  dataBancoEdit_copied: any = [];
  
  displayedColumns = ['codigo','nombre','direccion','nit','fechareg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | banco>('');
  options: banco[] = [];
  filteredOptions: Observable<banco[]>;
  userConn:any;
  inputValue: number | null = null;
  
  nombre_ventana:string="abmcobanco.vb";
  public ventana="Banco"
  public detalle="Banco-delete";
  public tipo="Banco-DELETE";

  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllBanco();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllBanco(){
    let errorMessage:string = "La Ruta presenta fallos al hacer peticion GET --/ctsxcob/mant/cobanco/";
    return this.api.getAll('/ctsxcob/mant/cobanco/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.banco = datav;
          console.log(this.banco);
          
          this.dataSource = new MatTableDataSource(this.banco);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  openDialog(): void {
    this.dialog.open(BancoCreateComponent, {
      width: 'auto',
      height: 'auto',
      
    });
  }

  private _filter(name: string): banco[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: banco): string {
    return user && user.codigo ? user.codigo : '';
  }

  editar(datanumRetBancEdit){
    this.dataBancoEdit_copied ={...datanumRetBancEdit};
    console.log(this.dataBancoEdit_copied);
    
    this.data = datanumRetBancEdit;
    this.dialog.open(BancoEditComponent, {
      data: {datanumRetBancEdit:this.dataBancoEdit_copied},
      width: 'auto',
      height:'auto',
    });
  }

  mandarNombre(){
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent:this.ventana,
    });
  }

  eliminar(element): void{
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  fondos/mant/fntiporetiro/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/ctsxcob/mant/cobanco/'+this.userConn+"/"+ element.codigo)
        .subscribe({
          next: () => {
            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
            
            this.toastr.success('!ELIMINADO EXITOSAMENTE!');
            location.reload();
          },
          error: (err: any) => { 
            console.log(err, errorMessage);
            this.toastr.error('! NO ELIMINADO !');
          },
          complete: () => { }
        })
      }else{
        this.toastr.error('! CANCELADO !');
      }
    });
  }

}
