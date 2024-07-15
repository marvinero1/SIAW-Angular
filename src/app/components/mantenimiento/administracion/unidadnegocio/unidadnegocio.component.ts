import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UnidadnegocioCreateComponent } from './unidadnegocio-create/unidadnegocio-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-unidadnegocio',
  templateUrl: './unidadnegocio.component.html',
  styleUrls: ['./unidadnegocio.component.scss']
})
export class UnidadnegocioComponent implements OnInit {

  uni_negocio: any = [];
  userConn: string;
  usuarioLogueado: string;

  displayedColumns = ['codigo', 'descripcion', 'horareg', 'accion'];
  dataSource = new MatTableDataSource();

  nombre_ventana: string = "abmadunidad.vb";
  public ventana = "Unidad de Negocio"
  public detalle = "unidadnegocio-delete";
  public tipo = "transaccion-unidadnegocio-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.mandarNombre();
  }

  ngOnInit() {
    this.getAllUnidadNegocio();
  }

  getAllUnidadNegocio() {

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adunidad/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.uni_negocio = datav;
          // console.log(this.uni_negocio);

          this.spinner.show();
          this.dataSource = new MatTableDataSource(this.uni_negocio);

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

  openDialog(): void {
    this.dialog.open(UnidadnegocioCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /moneda Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/adunidad/' + this.userConn + '/' + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
              this.toastr.success('! SE ELIMINO EXITOSAMENTE !');
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
        this.toastr.error('! NO SE ELIMINO !');
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
