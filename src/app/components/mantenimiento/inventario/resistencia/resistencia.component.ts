import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ResistenciaCreateComponent } from './resistencia-create/resistencia-create.component';
import { ResistenciaEditComponent } from './resistencia-edit/resistencia-edit.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-resistencia',
  templateUrl: './resistencia.component.html',
  styleUrls: ['./resistencia.component.scss']
})
export class ResistenciaComponent implements OnInit {

  public resistencia:any=[];
  public data:any=[];
  usuarioLogueado:any;
  userConn:any;

  displayedColumns = ['codigo','descripcion','fechareg','horareg','usuarioreg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana:string="abminresistencia.vb";
  public ventana="Resistencia Item"
	public detalle="resistencia-detalle";
  public tipo = "transaccion-resistencia-DELETE";

  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {
    this.mandarNombre();
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.api.getRolUserParaVentana(this.usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllResistencia();
  }

  getAllResistencia(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inresistencia/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.resistencia = datav;
          // console.log('roscas', datav);

          this.dataSource = new MatTableDataSource(this.resistencia);
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
    this.dialog.open(ResistenciaCreateComponent, {
      width: '750px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(dataRoscaEdit){
    this.data = dataRoscaEdit;
    //console.log(this.data);
    this.dialog.open(ResistenciaEditComponent, {
      data: {dataRoscaEdit:dataRoscaEdit},
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

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      // console.log(result);
      if(result) {
        return this.api.delete('/inventario/mant/inresistencia/'+this.userConn+"/"+element.codigo)
        .subscribe({
          next: () => {
            this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
            
            this.toastr.success('! Eliminado Exitosamente !');
            
            location.reload();
          },
          error: (err: any) => { 
            console.log(errorMessage);
            this.toastr.error('! NO SE Eliminado !');

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
