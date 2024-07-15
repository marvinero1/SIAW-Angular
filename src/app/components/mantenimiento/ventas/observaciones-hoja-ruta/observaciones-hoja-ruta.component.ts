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
import { ObservHojaRutaCreateComponent } from './observ-hoja-ruta-create/observ-hoja-ruta-create.component';
import { ObserHojaRutaEditComponent } from './obser-hoja-ruta-edit/obser-hoja-ruta-edit.component';
@Component({
  selector: 'app-observaciones-hoja-ruta',
  templateUrl: './observaciones-hoja-ruta.component.html',
  styleUrls: ['./observaciones-hoja-ruta.component.scss']
})
export class ObservacionesHojaRutaComponent implements OnInit {

  hoja_ruta: any = [];
  data: [];
  userConn: any;

  public codigo: string = '';

  displayedColumns = ['codigo', 'descripcion', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmveobs_ruta.vb";
  public ventana = "Hojas de Ruta"
  public detalle = "HojaRuta-delete";
  public tipo = "HojaRuta-DELETE";

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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/mant/veobs_ruta/";
    return this.api.getAll('/venta/mant/veobs_ruta/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.hoja_ruta = datav;
          console.log(this.hoja_ruta);

          this.dataSource = new MatTableDataSource(this.hoja_ruta);
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
    this.dialog.open(ObservHojaRutaCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-- seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/veobs_ruta/' + this.userConn + "/" + element.codigo)
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

  editar(hoja) {
    this.data = hoja;
    //console.log(this.data);
    const dialogRef = this.dialog.open(ObserHojaRutaEditComponent, {
      data: { hoja: hoja },
      width: 'auto',
      height: 'auto'
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

}
