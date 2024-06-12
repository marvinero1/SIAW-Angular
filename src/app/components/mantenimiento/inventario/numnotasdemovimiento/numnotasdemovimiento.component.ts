import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NumnotasdemovimientoCreateComponent } from './numnotasdemovimiento-create/numnotasdemovimiento-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NumnotasdemovimientoEditComponent } from './numnotasdemovimiento-edit/numnotasdemovimiento-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-numnotasdemovimiento',
  templateUrl: './numnotasdemovimiento.component.html',
  styleUrls: ['./numnotasdemovimiento.component.scss']
})
export class NumnotasdemovimientoComponent implements OnInit {

  public movimiento = [];
  public data_edit = [];
  usuarioLogueado: any;
  userConn: any;

  displayedColumns = ['id', 'descripcion', 'nroactual', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmintipomovimiento.vb";
  public ventana = "Numeración de Notas de Movimiento"
  public detalle = "nts-movimiento-detalle";
  public tipo = "transaccion-nts-movimiento-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public _snackBar: MatSnackBar,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {
    this.mandarNombre();
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllmovimiento();
  }

  getAllmovimiento() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intipomovimiento/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.movimiento = datav;

          this.dataSource = new MatTableDataSource(this.movimiento);
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
    this.dialog.open(NumnotasdemovimientoCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(dataAreaEdit) {
    this.data_edit = dataAreaEdit;
    console.log(this.data_edit);
    this.dialog.open(NumnotasdemovimientoEditComponent, {
      data: { dataAreaEdit: dataAreaEdit },
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /inventario/mant/intipomovimiento Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      // console.log(result);
      if (result) {
        return this.api.delete('/inventario/mant/intipomovimiento/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);

              this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
                duration: 3000,
                panelClass: ['coorporativo-snackbar', 'login-snackbar'],
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
