import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { cotalonario } from '@services/modelos/objetos';
import { TalonarioRecibosCreateComponent } from './talonario-recibos-create/talonario-recibos-create.component';
import { TalonarioRecibosEditComponent } from './talonario-recibos-edit/talonario-recibos-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';


@Component({
  selector: 'app-talonario-recibos',
  templateUrl: './talonario-recibos.component.html',
  styleUrls: ['./talonario-recibos.component.scss']
})
export class TalonarioRecibosComponent {

  talon:any=[]; 
  data:[];
  datatalonEdit_copied: any = [];
  
  displayedColumns = ['codigo','descripcion' ,'TalDel','TalAl','nroactual','Fecha','codvendedor','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | cotalonario>('');
  options: cotalonario[] = [];
  filteredOptions: Observable<cotalonario[]>;
  userConn:any;

  nombre_ventana:string="abmcotalonario.vb";
  public ventana="talonario"
  public detalle="talonario-delete";
  public tipo="talonario-DELETE";





  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }





  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAlltalonario(this.userConn);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }



  getAlltalonario(userConn){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/ctsxcob/mant/cotalonario/'+userConn)
      .subscribe({
        next: (datav) => {
          this.talon = datav;

          this.dataSource = new MatTableDataSource(this.talon);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
          console.log(this.talon);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  openDialog(): void {
    this.dialog.open(TalonarioRecibosCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }


  private _filter(name: string): cotalonario[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cotalonario): string {
    return user && user.codigo ? user.codigo : '';
  }

  editar(datatalonEdit){
    this.datatalonEdit_copied ={...datatalonEdit};
    console.log(this.datatalonEdit_copied);
    
    this.data = datatalonEdit;
    this.dialog.open(TalonarioRecibosEditComponent, {
      data: {datatalonEdit:this.datatalonEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  ctsxcob/mant/cotalonario/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/ctsxcob/mant/cotalonario/'+this.userConn+"/"+ element.codigo)
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
