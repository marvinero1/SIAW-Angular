import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clasificacion-clientes',
  templateUrl: './clasificacion-clientes.component.html',
  styleUrls: ['./clasificacion-clientes.component.scss']
})
export class ClasificacionClientesComponent implements OnInit {
  
  userConn: any;
  usuarioLogueado: any;
  clasificacion: string;
  
  nivel: any = [];
  nivel_clientes: any = [];
  add_clasificacion: any = [];

  displayedColumns = ['clasificacion','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  public ventana="clasificacion-cliente-create"
  public detalle="clasiCliente";
  public tipo="clasiCliente-POST";

  constructor(private api:ApiService, public dialogRef: MatDialogRef<ClasificacionClientesComponent>,
    private _formBuilder: FormBuilder, public log_module: LogService, private spinner: NgxSpinnerService,
    private toastr: ToastrService, public _snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public nivel_get: any,
    public dialog: MatDialog) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.nivel = this.nivel_get.nivel;
    console.log(this.nivel_get);
  }

  ngOnInit() {
    this.getNivelesClientes();
  }

  getNivelesClientes(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/vedesnivel/vedesnivel_clasificacion/'+this.userConn+"/"+this.nivel.codigo)
      .subscribe({
        next: (datav) => {
          this.nivel_clientes = datav;
          console.log('inlinea', datav);

          this.dataSource = new MatTableDataSource(this.nivel_clientes);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  agregarClasificacion() { 
    let data = {
                  codvedesnivel: this.nivel.codigo,
                  clasificacion: this.clasificacion
                };
    console.log(data);
    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:  /venta/mant/vedesnivel/ POST";
    return this.api.create("/venta/mant/vedesnivel/vedesnivel_clasificacion/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.add_clasificacion = datav;

          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');  
          
          location.reload();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
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
        return this.api.delete('/venta/mant/vedesnivel/vedesnivel_clasificacion/'+this.userConn+"/"+this.nivel.codigo+"/"+element.clasificacion)
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
  
  close(){
    this.dialogRef.close();
  }
}
