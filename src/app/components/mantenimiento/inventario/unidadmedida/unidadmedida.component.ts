import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { UnidadmedidaCreateComponent } from './unidadmedida-create/unidadmedida-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-unidadmedida',
  templateUrl: './unidadmedida.component.html',
  styleUrls: ['./unidadmedida.component.scss']
})
export class UnidadmedidaComponent implements OnInit {

  public rosca: any = [];
  public data: any = [];
  userConn: any;

  displayedColumns = ['codigo', 'descripcion', 'entera', 'fechareg', 'horareg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abminudemed.vb";
  public ventana = "Unidad de Medida"
  public detalle = "nts-unimedida-detalle";
  public tipo = "transaccion-nts-unimedida-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    public _snackBar: MatSnackBar, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.mandarNombre();

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllUnidadMedida();
  }

  getAllUnidadMedida() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inudemed/";
    return this.api.getAll('/inventario/mant/inudemed/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.rosca = datav;
          // console.log('medida', datav);
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
    this.dialog.open(UnidadmedidaCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/inudemed/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
              this.toastr.error('! No Se Guardo Correctamente !');

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
