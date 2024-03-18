import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NivelesDescuentosCreateComponent } from './niveles-descuentos-create/niveles-descuentos-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { LogService } from '@services/log-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ClasificacionClientesComponent } from './clasificacion-clientes/clasificacion-clientes.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-niveles-descuentos',
  templateUrl: './niveles-descuentos.component.html',
  styleUrls: ['./niveles-descuentos.component.scss']
})
export class NivelesDescuentosComponent implements OnInit {

  niveles_desct: any = [];
  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();
  userConn: any;
  
   displayedColumns = ['codigo','descripcion','accion'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;


  nombre_ventana:string="abmvedesnivel.vb";
  public ventana="Linea Producto"
	public detalle="lineaProd-detalle";
  public tipo = "transaccion-lineaProd-DELETE";
  
  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, 
    public _snackBar: MatSnackBar, public log_module: LogService,private toastr: ToastrService,
    public nombre_ventana_service: NombreVentanaService) {
      this.mandarNombre();
      let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

      this.getAllNivelesDesct();
      this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit(){

  }

  getAllNivelesDesct(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vedesnivel/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.niveles_desct = datav;
          console.log('inlinea', datav);

          this.dataSource = new MatTableDataSource(this.niveles_desct);
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

  eliminar(element): void{
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:-- /inventario/mant/inlinea Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/venta/mant/vedesnivel/'+this.userConn+"/"+element.codigo)
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NivelesDescuentosCreateComponent, {
      width: 'auto',
      height:'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  clasificacionClientes(enterAnimationDuration: string, exitAnimationDuration: string, element:object): void {
    this.dialog.open(ClasificacionClientesComponent, {
      width: 'auto',
      height: 'auto',
      data:{nivel:element},
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  
  mandarNombre(){
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent:this.ventana,
    });
  }
}
