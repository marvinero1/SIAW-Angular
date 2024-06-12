import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TerminacionCreateComponent } from './terminacion-create/terminacion-create.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-terminacion',
  templateUrl: './terminacion.component.html',
  styleUrls: ['./terminacion.component.scss']
})
export class TerminacionComponent implements OnInit {

  public terminacion: any = [];
  public data: any = [];
  userConn: any;
  usuarioLogueado: any;

  displayedColumns = ['codigo', 'descripcion', 'fechareg', 'horareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abminterminacion.vb";
  public ventana = "Terminación Item"
  public detalle = "terminacion-detalle";
  public tipo = "transaccion-terminacion-DELETE";


  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, public _snackBar: MatSnackBar, public nombre_ventana_service: NombreVentanaService) {

    this.mandarNombre();

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllTerminacion();
  }

  getAllTerminacion() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/interminacion/";
    return this.api.getAll('/inventario/mant/interminacion/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.terminacion = datav;
          console.log('terminaciones', datav);

          this.dataSource = new MatTableDataSource(this.terminacion);
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
    this.dialog.open(TerminacionCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: -/inventario/mant/interminacion/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      // console.log(result);
      if (result) {
        return this.api.delete('/inventario/mant/interminacion/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {

              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
              this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
                duration: 3000,
              });

              location.reload();
            },
            error: (err: any) => {
              console.log(errorMessage);
            },
            complete: () => { }
          })
      } else {
        alert("¡No se elimino!");
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
