import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { cppercepcion } from '@services/modelos/objetos';
import { PercepcionesretencionesCreateComponent } from './percepcionesretenciones-create/percepcionesretenciones-create.component';
import { PercepcionesretencionesEditComponent } from './percepcionesretenciones-edit/percepcionesretenciones-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';


@Component({
  selector: 'app-percepcionesretenciones',
  templateUrl: './percepcionesretenciones.component.html',
  styleUrls: ['./percepcionesretenciones.component.scss']
})
export class PercepcionesretencionesComponent {

  percpRet:any=[]; 
  data:[];
  datapercpRetEdit_copied: any = [];
  
  displayedColumns = ['codigo','descripcion' ,'porcentaje','horareg','fechareg','usuarioreg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | cppercepcion>('');
  options: cppercepcion[] = [];
  filteredOptions: Observable<cppercepcion[]>;
  userConn:any;

  nombre_ventana:string="abmcppercepcion.vb";
  public ventana="percepcionesRetenciones"
  public detalle="percepcionesRetenciones-delete";
  public tipo="percepcionesRetenciones-DELETE";


  


  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }





  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllpercpRet(this.userConn);
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }



  getAllpercpRet(userConn){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/compras/mant/cppercepcion/'+userConn)
      .subscribe({
        next: (datav) => {
          this.percpRet = datav;

          this.dataSource = new MatTableDataSource(this.percpRet);
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
    this.dialog.open(PercepcionesretencionesCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  private _filter(name: string): cppercepcion[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cppercepcion): number {
    return user && user.codigo ? user.codigo : 0;
  }

  editar(datapercpRetEdit){
    this.datapercpRetEdit_copied ={...datapercpRetEdit};
    console.log(this.datapercpRetEdit_copied);
    
    this.data = datapercpRetEdit;
    this.dialog.open(PercepcionesretencionesEditComponent, {
      data: {datapercpRetEdit:this.datapercpRetEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  compras/mant/cppercepcion/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/compras/mant/cppercepcion/'+this.userConn+"/"+ element.codigo)
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
