import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LineaproductoCreateComponent } from './lineaproducto-create/lineaproducto-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { FormControl } from '@angular/forms';
import { inLineaProducto } from '@services/modelos/objetos';
import { Observable } from 'rxjs';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { LineaProductoCatalogoComponent } from './linea-producto-catalogo/linea-producto-catalogo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lineaproducto',
  templateUrl: './lineaproducto.component.html',
  styleUrls: ['./lineaproducto.component.scss']
})
export class LineaproductoComponent implements OnInit {

  public ingrupo=[];
  public data_edit=[];
  displayedColumns = ['codigo','descripcion','codgrupomer','codgrupomer','codgrupo','codsubgrupo_vta','descdetallada',
                      'porcentaje_comis','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();
  userConn:any;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | inLineaProducto>('');
  options: inLineaProducto[] = [];
  filteredOptions: Observable<inLineaProducto[]>;

  nombre_ventana:string="abminlinea.vb";
  public ventana="Linea Producto"
	public detalle="lineaProd-detalle";
  public tipo = "transaccion-lineaProd-DELETE";
  
  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, 
    public _snackBar: MatSnackBar, public log_module: LogService,private toastr: ToastrService, 
    public nombre_ventana_service: NombreVentanaService) {
      this.mandarNombre();
      let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

      this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit() {
    this.getAlllineaProducto();
  }

  private _filter(name: string): inLineaProducto[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }
  
  displayFn(user: inLineaProducto): string {
    return user && user.codigo ? user.codigo : '';
  }

  getAlllineaProducto(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inlinea/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.ingrupo = datav;
          console.log('inlinea', datav);

          this.dataSource = new MatTableDataSource(this.ingrupo);
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LineaproductoCreateComponent, {
      width: '950px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  eliminar(element): void{
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:-- /inventario/mant/inlinea Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/inventario/mant/inlinea/'+this.userConn+"/"+element.codigo)
        .subscribe({
          next: ()=>{
            this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
            this._snackBar.open('Se elimino correctamente!', 'Ok', {
              duration: 3000,
            });
            this.toastr.success('Eliminado con Exito! 🎉'); 
            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 1500);

            location.reload();
          },
          error: (err: any) => { 
            console.log(errorMessage);
          },
          complete: () => { }
        })
      }else{
        alert("¡No se elimino!");
      }
    });
  }

  mandarNombre(){
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent:this.ventana,
    });
  }

  catalogoLineas() { 
    this.dialog.open(LineaProductoCatalogoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
}
