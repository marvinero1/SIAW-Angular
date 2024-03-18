import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoinventarioCreateComponent } from './tipoinventario-create/tipoinventario-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { TipoinventarioEditComponent } from './tipoinventario-edit/tipoinventario-edit.component';
@Component({
  selector: 'app-tipoinventario',
  templateUrl: './tipoinventario.component.html',
  styleUrls: ['./tipoinventario.component.scss']
})
export class TipoinventarioComponent implements OnInit {
  
  public solicitudes_urgentes:any=[];
  public data:any=[];
  userConn: any;
  
  displayedColumns = ['id','descripcion','nroactual','fechareg','horareg','usuarioreg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana:string="abmintipoinv.vb";
  public ventana="Numeración Tipos Inventario"
	public detalle="nts-tipoinventario-detalle";
  public tipo = "nts-tipoinventario-DELETE";
  
  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module:LogService,
    public _snackBar: MatSnackBar, public nombre_ventana_service: NombreVentanaService) {
    this.mandarNombre();
      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  
      let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

      this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllPedidoMercaderiaUrgente();
  }

  getAllPedidoMercaderiaUrgente(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intipoinv/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.solicitudes_urgentes = datav;
          console.log('TIPO INVENTARIO', datav);

          this.dataSource = new MatTableDataSource(this.solicitudes_urgentes);
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
    this.dialog.open(TipoinventarioCreateComponent, {
      width: 'auto',
      height:'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(dataInventarioEdit){
    // console.log(this.data_edit);
    this.dialog.open(TipoinventarioEditComponent, {
      data: {dataInventarioEdit:dataInventarioEdit},
      width: 'auto',
      height:'auto',
    });
  }

  eliminar(element): void{
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/inventario/mant/intipoinv/'+this.userConn+"/"+element.id)
        .subscribe({
          next: ()=>{
            this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
            this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
              duration: 3000,
              panelClass: ['coorporativo-snackbar', 'login-snackbar'],
            });

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
}
