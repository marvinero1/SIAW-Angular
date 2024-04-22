import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { cotipoajuste } from '@services/modelos/objetos';
import { NumeracionTipoAjusteCreateComponent } from './numeracion-tipo-ajuste-create/numeracion-tipo-ajuste-create.component';
import { NumeracionTipoAjusteEditComponent } from './numeracion-tipo-ajuste-edit/numeracion-tipo-ajuste-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';


@Component({
  selector: 'app-numeracion-tipo-ajuste',
  templateUrl: './numeracion-tipo-ajuste.component.html',
  styleUrls: ['./numeracion-tipo-ajuste.component.scss']
})
export class NumeracionTipoAjusteComponent {

  tiposAjuste:any=[]; 
  data:[];
  datatiposAjusteEdit_copied: any = [];
  
  displayedColumns = ['id','descripcion' ,'nroactual','horareg','fechareg','usuarioreg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | cotipoajuste>('');
  options: cotipoajuste[] = [];
  filteredOptions: Observable<cotipoajuste[]>;
  userConn:any;

  nombre_ventana:string="abmcotipoajuste.vb";
  public ventana="tiposdeAjuste"
  public detalle="tiposdeAjuste-delete";
  public tipo="tiposdeAjuste-DELETE";

  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }


  ngOnInit(): void {
    this.getAlltiposAjuste();
  }


  getAlltiposAjuste(){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/ctsxcob/mant/cotipoajuste/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.tiposAjuste = datav;

          this.dataSource = new MatTableDataSource(this.tiposAjuste);
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
    this.dialog.open(NumeracionTipoAjusteCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cotipoajuste): string {
    return user && user.id ? user.id : '';
  }

  editar(datatiposAjusteEdit){
    this.datatiposAjusteEdit_copied ={...datatiposAjusteEdit};
    console.log(this.datatiposAjusteEdit_copied);
    
    this.data = datatiposAjusteEdit;
    this.dialog.open(NumeracionTipoAjusteEditComponent, {
      data: {datatiposAjusteEdit:this.datatiposAjusteEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  ctsxcob/mant/cotipoajuste/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/ctsxcob/mant/cotipoajuste/'+this.userConn+"/"+ element.id)
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
