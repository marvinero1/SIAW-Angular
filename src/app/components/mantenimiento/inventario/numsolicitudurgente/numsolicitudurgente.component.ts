import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NumsolicitudurgenteCreateComponent } from './numsolicitudurgente-create/numsolicitudurgente-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { NumsolicitudurgenteEditComponent } from './numsolicitudurgente-edit/numsolicitudurgente-edit.component';
@Component({
  selector: 'app-numsolicitudurgente',
  templateUrl: './numsolicitudurgente.component.html',
  styleUrls: ['./numsolicitudurgente.component.scss']
})
export class NumsolicitudurgenteComponent implements OnInit {

  nombre_ventana: string = "abmintiposolurgente.vb";
  public solicitudes_urgentes: any = [];
  public data: any = [];
  userConn: any;

  displayedColumns = ['id', 'descripcion', 'nroactual', 'fechareg', 'horareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  public ventana = "Numeracion Solicitudes Urgentes"
  public detalle = "nts-movurgentes-detalle";
  public tipo = "transaccion-nts-movurgentes-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public _snackBar: MatSnackBar, public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.mandarNombre()
  }

  ngOnInit() {
    this.getAllPedidoMercaderiaUrgente();
  }

  getAllPedidoMercaderiaUrgente() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intiposolurgente/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.solicitudes_urgentes = datav;

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
    this.dialog.open(NumsolicitudurgenteCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(dataSolUrgenteEdit) {
    // console.log(this.data_edit);
    this.dialog.open(NumsolicitudurgenteEditComponent, {
      data: { dataSolUrgenteEdit: dataSolUrgenteEdit },
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/mant/intiposolurgente Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/intiposolurgente/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
              this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
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
