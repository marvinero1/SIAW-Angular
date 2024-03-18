import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';

import { cotipopagomora } from '@services/modelos/objetos';
import { NumeracionPagosMoraCreateComponent } from './numeracion-pagos-mora-create/numeracion-pagos-mora-create.component';
import { NumeracionPagosMoraEditComponent } from './numeracion-pagos-mora-edit/numeracion-pagos-mora-edit.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';



@Component({
  selector: 'app-numeracion-pagos-mora',
  templateUrl: './numeracion-pagos-mora.component.html',
  styleUrls: ['./numeracion-pagos-mora.component.scss']
})
export class NumeracionPagosMoraComponent {

  tipPagMor:any=[]; 
  data:[];
  datatipPagMorEdit_copied: any = [];
  
  displayedColumns = ['id','descripcion' ,'nroactual','horareg','fechareg','usuarioreg','codunidad','descUnidad','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | cotipopagomora>('');
  options: cotipopagomora[] = [];
  filteredOptions: Observable<cotipopagomora[]>;
  userConn:any;

  nombre_ventana:string="abmcotipopagomora.vb";
  public ventana="tipPagosMora"
  public detalle="tipPagosMora-delete";
  public tipo="tipPagosMora-DELETE";





  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }





  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAlltipPagMor(this.userConn);
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }



  getAlltipPagMor(userConn){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/ctsxcob/mant/cotipopagomora/'+userConn)
      .subscribe({
        next: (datav) => {
          this.tipPagMor = datav;

          this.dataSource = new MatTableDataSource(this.tipPagMor);
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
    this.dialog.open(NumeracionPagosMoraCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  private _filter(name: string): cotipopagomora[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cotipopagomora): string {
    return user && user.id ? user.id : '';
  }

  editar(datatipPagMorEdit){
    this.datatipPagMorEdit_copied ={...datatipPagMorEdit};
    console.log(this.datatipPagMorEdit_copied);
    
    this.data = datatipPagMorEdit;
    this.dialog.open(NumeracionPagosMoraEditComponent, {
      data: {datatipPagMorEdit:this.datatipPagMorEdit_copied},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  ctsxcob/mant/cotipopagomora/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/ctsxcob/mant/cotipopagomora/'+this.userConn+"/"+ element.id)
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
