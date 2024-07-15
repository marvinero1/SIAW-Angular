import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiciorubroService } from '@components/mantenimiento/rubro/servicio/serviciorubro.service';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TiposCreditoCreateComponent } from './tipos-credito-create/tipos-credito-create.component';
import { TiposCreditoEditComponent } from './tipos-credito-edit/tipos-credito-edit.component';

@Component({
  selector: 'app-tipos-credito',
  templateUrl: './tipos-credito.component.html',
  styleUrls: ['./tipos-credito.component.scss']
})
export class TiposCreditoComponent implements OnInit {

  credito: any = [];
  data: [];
  userConn: any;

  public codigo: string = '';

  displayedColumns = ['codigo', 'descripcion', 'duracion', 'credito', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmvetipocredito.vb";
  public ventana = "Tipos de Credito"
  public detalle = "TipoCredito-delete";
  public tipo = "TipoCredito-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService,
    public servicioRubro: ServiciorubroService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllTipoCredito();
  }

  getAllTipoCredito() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/mant/verubro/";
    return this.api.getAll('/venta/mant/vetipocredito/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.credito = datav;
          console.log(this.credito);

          this.dataSource = new MatTableDataSource(this.credito);
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
    this.dialog.open(TiposCreditoCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:  venta/mant/vetipocredito Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/vetipocredito/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              location.reload();
            },
            error: (err: any) => {
              console.log(err, errorMessage);
              this.toastr.error('! NO ELIMINADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  editar(element) {
    console.log(element);
    let objCopia = Object.assign({}, element);
    this.dialog.open(TiposCreditoEditComponent, {
      data: { dataCreditoEdit: objCopia },
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

}
