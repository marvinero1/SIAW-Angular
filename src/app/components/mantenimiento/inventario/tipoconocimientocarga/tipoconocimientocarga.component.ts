import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoconocimientocargaCreateComponent } from './tipoconocimientocarga-create/tipoconocimientocarga-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { TipoconocimientocargaEditComponent } from './tipoconocimientocarga-edit/tipoconocimientocarga-edit.component';
@Component({
  selector: 'app-tipoconocimientocarga',
  templateUrl: './tipoconocimientocarga.component.html',
  styleUrls: ['./tipoconocimientocarga.component.scss']
})
export class TipoconocimientocargaComponent implements OnInit {

  public num_conocimiento_carga:any=[];
  public data:any=[];
  userConn:any;

  displayedColumns = ['id','descripcion','nroactual','fechareg','horareg','usuarioreg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana:string="abmintipocarga.vb";
  public ventana="Numeración Tipos de Conocimiento de Carga"
	public detalle="nts-conocimicarga-detalle";
	public tipo="nts-conocimicarga-DELETE";

  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService,) {
    this.mandarNombre();
    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
  
    this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllPedidoMercaderia();
  }

  getAllPedidoMercaderia(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intipocarga/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.num_conocimiento_carga = datav;
          // console.log('num_conocimiento_carga', datav);

          this.dataSource = new MatTableDataSource(this.num_conocimiento_carga);
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
    this.dialog.open(TipoconocimientocargaCreateComponent, {
      width: 'auto',
      height:'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(dataConocimientoEdit){
    // console.log(this.data_edit);
    this.dialog.open(TipoconocimientocargaEditComponent, {
      data: {dataConocimientoEdit:dataConocimientoEdit},
      width: 'auto',
      height:'auto',
    });
  }

  eliminar(element): void{
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /inventario/mant/intipocarga/";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/inventario/mant/intipocarga/'+this.userConn+"/"+element.id)
        .subscribe({
          next: () => {
            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
            this.toastr.success('Eliminado Exitosamente!');
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
