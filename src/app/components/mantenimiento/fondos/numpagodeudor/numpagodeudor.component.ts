import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { fnTipoPagoAdeudor } from '@services/modelos/objetos';
import { NumpagodeudorCreateComponent } from './numpagodeudor-create/numpagodeudor-create.component';
import { NumpagodeudorEditComponent } from './numpagodeudor-edit/numpagodeudor-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-numpagodeudor',
  templateUrl: './numpagodeudor.component.html',
  styleUrls: ['./numpagodeudor.component.scss']
})
export class NumpagodeudorComponent {

  numPagoDeu:any=[]; 
  data:[];
  datanumPagoDeuEdit_copied: any = [];
  
  displayedColumns = ['id','descripcion' ,'nroactual','horareg','fechareg','usuarioreg','codunidad','descUnidad','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | fnTipoPagoAdeudor>('');
  options: fnTipoPagoAdeudor[] = [];
  filteredOptions: Observable<fnTipoPagoAdeudor[]>;
  userConn:any;

  nombre_ventana:string="abmfntipopagoadeudor.vb";
  public ventana="TipoPagoaDeudor"
  public detalle="TipoPagoaDeudor-delete";
  public tipo="TipoPagoaDeudor-DELETE";





  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }





  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllnumPagoDeuerencias(this.userConn);
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }



  getAllnumPagoDeuerencias(userConn){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/fondos/mant/fntipopagoadeudor/'+userConn)
      .subscribe({
        next: (datav) => {
          this.numPagoDeu = datav;

          this.dataSource = new MatTableDataSource(this.numPagoDeu);
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
    this.dialog.open(NumpagodeudorCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  private _filter(name: string): fnTipoPagoAdeudor[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fnTipoPagoAdeudor): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumPagoDeuEdit){
    this.datanumPagoDeuEdit_copied ={...datanumPagoDeuEdit};
    console.log(this.datanumPagoDeuEdit_copied);
    
    this.data = datanumPagoDeuEdit;
    this.dialog.open(NumpagodeudorEditComponent, {
      data: {datanumPagoDeuEdit:this.datanumPagoDeuEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  fondos/mant/fntipopagoadeudor/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/fondos/mant/fntipopagoadeudor/'+this.userConn+"/"+ element.id)
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
