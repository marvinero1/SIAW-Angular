import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { fncuenta } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { CuentasEfectivoCreateComponent } from './cuentas-efectivo-create/cuentas-efectivo-create.component';
import { CuentasEfectivosEditComponent } from './cuentas-efectivos-edit/cuentas-efectivos-edit.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { CuentaEfectivoCuentasContablesComponent } from './cuenta-efectivo-cuentas-contables/cuenta-efectivo-cuentas-contables.component';

@Component({
  selector: 'app-cuentas-efectivo',
  templateUrl: './cuentas-efectivo.component.html',
  styleUrls: ['./cuentas-efectivo.component.scss']
})
export class CuentasEfectivoComponent implements OnInit {

  cuentas_efectivo:any=[]; 
  data:[];
  datacuentasefectivoEdit: any = [];
  
  displayedColumns = ['id', 'descripcion', 'balance', 'fecha', 'tipo_movimiento', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;  

  myControl = new FormControl<string | fncuenta>('');
  options: fncuenta[] = [];
  filteredOptions: Observable<fncuenta[]>;
  userConn:any;

  nombre_ventana:string="abmfncuenta.vb";
  public ventana="Cuentas Efectivo"
  public detalle="uentas Efectivo-delete";
  public tipo="uentas Efectivo-DELETE";


  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module:LogService, private toastr: ToastrService, public nombre_ventana_service:NombreVentanaService){
    this.mandarNombre();
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;    
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
    this.getAllCuentas();
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllCuentas(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/fondos/mant/fncuenta/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.cuentas_efectivo = datav;
          console.log(this.cuentas_efectivo);
          
          this.dataSource = new MatTableDataSource(this.cuentas_efectivo);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
  
  openDialog(): void {
    this.dialog.open(CuentasEfectivoCreateComponent, {
      width: 'auto',
      height:'auto',
    });
  }

  private _filter(name: string): fncuenta[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fncuenta): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumChecCliEdit){
    this.datacuentasefectivoEdit ={...datanumChecCliEdit};
    console.log(this.datacuentasefectivoEdit);
    
    this.data = datanumChecCliEdit;
    this.dialog.open(CuentasEfectivosEditComponent, {
      data: {datacuentasefectivoEdit:this.datacuentasefectivoEdit},
      width: 'auto',
      height:'auto',
    });
  }

  cuentasContablesModal(datanumChecCliEdit) {
    this.datacuentasefectivoEdit ={...datanumChecCliEdit};
    console.log(this.datacuentasefectivoEdit);
    
    this.data = datanumChecCliEdit;
    this.dialog.open(CuentaEfectivoCuentasContablesComponent, {
      data: {datacuentasefectivoEdit:this.datacuentasefectivoEdit},
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  fondos/mant/fnnumeracioncheque_cliente/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/fondos/mant/fncuenta/'+this.userConn+"/"+ element.id)
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
