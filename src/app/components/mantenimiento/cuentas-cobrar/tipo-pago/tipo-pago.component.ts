import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { cotippago } from '@services/modelos/objetos';
import { TipoPagoCreateComponent } from './tipo-pago-create/tipo-pago-create.component';
import { TipoPagoEditComponent } from './tipo-pago-edit/tipo-pago-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';



@Component({
  selector: 'app-tipo-pago',
  templateUrl: './tipo-pago.component.html',
  styleUrls: ['./tipo-pago.component.scss']
})
export class TipoPagoComponent {

  tiposPago:any=[]; 
  data:[];
  datatiposPagoEdit_copied: any = [];
  
  displayedColumns = ['codigo','descripcion' ,'tipo','horareg','fechareg','usuarioreg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | cotippago>('');
  options: cotippago[] = [];
  filteredOptions: Observable<cotippago[]>;
  userConn:any;

  tipoTextos = {
    0: 'EFECTIVO',
    1: 'DEPOSITO',
    2: 'CHEQUE'
  };

  nombre_ventana:string="abmcotippago.vb";
  public ventana="tiposdePago"
  public detalle="tiposdePago-delete";
  public tipo="tiposdePago-DELETE";





  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }





  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAlltiposPago(this.userConn);
  }



  getAlltiposPago(userConn){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/ctsxcob/mant/cotippago/'+userConn)
      .subscribe({
        next: (datav) => {
          this.tiposPago = datav;

          this.dataSource = new MatTableDataSource(this.tiposPago);
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
    this.dialog.open(TipoPagoCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cotippago): number {
    return user && user.codigo ? user.codigo : 0;
  }

  editar(datatiposPagoEdit){
    this.datatiposPagoEdit_copied ={...datatiposPagoEdit};
    console.log(this.datatiposPagoEdit_copied);
    
    this.data = datatiposPagoEdit;
    this.dialog.open(TipoPagoEditComponent, {
      data: {datatiposPagoEdit:this.datatiposPagoEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  ctsxcob/mant/cotippago/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/ctsxcob/mant/cotippago/'+this.userConn+"/"+ element.codigo)
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
