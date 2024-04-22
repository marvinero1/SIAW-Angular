import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { cotipo } from '@services/modelos/objetos';
import { NumeracionCobranzaCreateComponent } from './numeracion-cobranza-create/numeracion-cobranza-create.component';
import { NumeracionCobranzaEditComponent } from './numeracion-cobranza-edit/numeracion-cobranza-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';


@Component({
  selector: 'app-numeracion-cobranza',
  templateUrl: './numeracion-cobranza.component.html',
  styleUrls: ['./numeracion-cobranza.component.scss']
})
export class NumeracionCobranzaComponent {

  numCobran:any=[]; 
  data:[];
  datanumCobranEdit_copied: any = [];
  
  displayedColumns = ['id','descripcion' ,'nroactual','codvendedor','horareg','fechareg','usuarioreg','codunidad','descUnidad','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | cotipo>('');
  options: cotipo[] = [];
  filteredOptions: Observable<cotipo[]>;
  userConn:any;

  nombre_ventana:string="abmcotipo.vb";
  public ventana="numCobranza"
  public detalle="numCobranza-delete";
  public tipo="numCobranza-DELETE";





  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllnumCobran(this.userConn);
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllnumCobran(userConn){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/ctasXcobrar/mant/cotipo/'+userConn)
      .subscribe({
        next: (datav) => {
          this.numCobran = datav;

          this.dataSource = new MatTableDataSource(this.numCobran);
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
    this.dialog.open(NumeracionCobranzaCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  private _filter(name: string): cotipo[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cotipo): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumCobranEdit){
    this.datanumCobranEdit_copied ={...datanumCobranEdit};
    console.log(this.datanumCobranEdit_copied);
    
    this.data = datanumCobranEdit;
    this.dialog.open(NumeracionCobranzaEditComponent, {
      data: {datanumCobranEdit:this.datanumCobranEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  ctasXcobrar/mant/cotipo/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/ctasXcobrar/mant/cotipo/'+this.userConn+"/"+ element.id)
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
