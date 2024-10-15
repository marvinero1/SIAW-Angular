import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GruposlineasdescuentosCreateComponent } from './gruposlineasdescuentos-create/gruposlineasdescuentos-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-gruposlineasdescuentos',
  templateUrl: './gruposlineasdescuentos.component.html',
  styleUrls: ['./gruposlineasdescuentos.component.scss']
})
export class GruposlineasdescuentosComponent implements OnInit {

  public ingrupo = [];
  public data_edit = [];
  userConn: any;
  displayedColumns = ['codigo', 'descripcion', 'rango_monto', 'rango_peso', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmingrupo.vb";
  public ventana = "Grupos de Lineas Para Descuentos"
  public detalle = "grupo-lindesct-detalle";
  public tipo = "grupo-lindesct-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public _snackBar: MatSnackBar, public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAlllineaDescuento();
  }

  getAlllineaDescuento() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/ingrupo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.ingrupo = datav;
          // console.log('ingrupo', datav);

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
    this.dialog.open(GruposlineasdescuentosCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- /inventario/mant/ingrupo Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/ingrupo/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
              this._snackBar.open('Se elimino correctamente!', 'Ok', {
                duration: 3000,
                panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
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
