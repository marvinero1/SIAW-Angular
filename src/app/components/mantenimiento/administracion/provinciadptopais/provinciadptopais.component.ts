import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProvinciadptopaisCreateComponent } from './provinciadptopais-create/provinciadptopais-create.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-provinciadptopais',
  templateUrl: './provinciadptopais.component.html',
  styleUrls: ['./provinciadptopais.component.scss']
})
export class ProvinciadptopaisComponent implements OnInit {

  provincias_dpto: any = [];
  provincia_get: any = [];
  userConn;

  displayedColumns = ['codigo', 'nombre', 'coddepto', 'horareg', 'fechareg', 'accion'];
  dataSource = new MatTableDataSource();

  nombre_ventana: string = "abmadprovincia.vb";
  public ventana = "Provincias de Dpto."
  public detalle = "provdpto-delete";
  public tipo = "transaccion-provdpto-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public nombre_ventana_service: NombreVentanaService,
    public log_module: LogService, private toastr: ToastrService) {

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllprovincias_dpto();
  }

  openDialog(): void {
    this.dialog.open(ProvinciadptopaisCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  getAllprovincias_dpto() {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adprovincia/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.provincias_dpto = datav;
          this.spinner.show();
          this.dataSource = new MatTableDataSource(this.provincias_dpto);
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

  eliminar(element) {
    let user_conn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la eliminacion" + "Ruta:--  /seg_adm/mant/adprovincia Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {

      if (result) {
        return this.api.delete('/seg_adm/mant/adprovincia/' + user_conn + '/' + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
              this.toastr.success('!SE ELIMINO EXITOSAMENTE!');
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
        this.toastr.error('! ELIMINACION CANCELADA !');
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
