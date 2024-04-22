import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { fnTipoCambio } from '@services/modelos/objetos';
import { NummovfondosCreateComponent } from './nummovfondos-create/nummovfondos-create.component';
import { NummovfondosEditComponent } from './nummovfondos-edit/nummovfondos-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';


@Component({
  selector: 'app-nummovfondos',
  templateUrl: './nummovfondos.component.html',
  styleUrls: ['./nummovfondos.component.scss']
})
export class NummovfondosComponent {

  numMovFond:any=[]; 
  data:[];
  datanumMovFondEdit_copied: any = [];
  
  displayedColumns = ['id','descripcion' ,'nroactual','horareg','fechareg','usuarioreg','codunidad','descUnidad','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | fnTipoCambio>('');
  options: fnTipoCambio[] = [];
  filteredOptions: Observable<fnTipoCambio[]>;
  userConn:any;

  nombre_ventana:string="abmfntipocambio.vb";
  public ventana="TipoCambio"
  public detalle="TipoCambio-delete";
  public tipo="TipoCambio-DELETE";





  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }





  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllnumMovFond(this.userConn);
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }



  getAllnumMovFond(userConn){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/fondos/mant/fntipocambio/'+userConn)
      .subscribe({
        next: (datav) => {
          this.numMovFond = datav;

          this.dataSource = new MatTableDataSource(this.numMovFond);
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
    this.dialog.open(NummovfondosCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  private _filter(name: string): fnTipoCambio[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fnTipoCambio): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumMovFondEdit){
    this.datanumMovFondEdit_copied ={...datanumMovFondEdit};
    console.log(this.datanumMovFondEdit_copied);
    
    this.data = datanumMovFondEdit;
    this.dialog.open(NummovfondosEditComponent, {
      data: {datanumMovFondEdit:this.datanumMovFondEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  fondos/mant/fntipocambio/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/fondos/mant/fntipocambio/'+this.userConn+"/"+ element.id)
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