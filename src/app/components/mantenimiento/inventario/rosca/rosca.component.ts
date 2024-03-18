import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoscaCreateComponent } from './rosca-create/rosca-create.component';
import { RoscaEditComponent } from './rosca-edit/rosca-edit.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-rosca',
  templateUrl: './rosca.component.html',
  styleUrls: ['./rosca.component.scss']
})
export class RoscaComponent implements OnInit {

  
  public rosca:any=[];
  public data:any=[];
  userConn:any

  displayedColumns = ['codigo','descripcion','fechareg','horareg','usuarioreg','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;


  nombre_ventana:string="abminrosca.vb";
  public ventana="Rosca"
	public detalle="rosca-detalle";
	public tipo="transaccion-rosca-DELETE";

  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module:LogService,
    public _snackBar: MatSnackBar,public nombre_ventana_service:NombreVentanaService) {
    this.mandarNombre();
      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

      let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

      this.api.getRolUserParaVentana(usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllRosca();
  }

  getAllRosca(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/inrosca/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.rosca = datav;
          // console.log('roscas', datav);

          this.dataSource = new MatTableDataSource(this.rosca);
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
    this.dialog.open(RoscaCreateComponent, {
      width: 'auto',
      height:'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(dataRoscaEdit){
    this.data = dataRoscaEdit;
    //console.log(this.data);
      const dialogRef = this.dialog.open(RoscaEditComponent, {
        data: {dataRoscaEdit:dataRoscaEdit},
        width: 'auto',
        height:'auto'
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
        return this.api.delete('/inventario/mant/inrosca/'+this.userConn+"/"+element.codigo)
        .subscribe({
          next: () => {
            this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
            this._snackBar.open('Se elimino correctamente!', 'Ok', {
              duration: 3000,
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
