import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DptopaisCreateComponent } from './dptopais-create/dptopais-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { DptopaisEditComponent } from './dptopais-edit/dptopais-edit.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-dptopais',
  templateUrl: './dptopais.component.html',
  styleUrls: ['./dptopais.component.scss']
})
export class DptopaisComponent implements OnInit {

  nombre_ventana: string = "abmaddepto.vb";
  dpto: any = [];
  userConn: any;

  displayedColumns = ['codigo', 'nombre', 'horareg', 'fechareg', 'usuarioreg', 'accion'];
  dataSource = new MatTableDataSource();

  public ventana = "Departamentos del Pais"
  public detalle = "dptopais-delete";
  public tipo = "dptopais-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.mandarNombre();

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAlldpto();
  }

  getAlldpto() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/addepto/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.dpto = datav;

          this.spinner.show();
          this.dataSource = new MatTableDataSource(this.dpto);

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
    this.dialog.open(DptopaisCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  editar(dataDptoEdit) {
    const dialogRef = this.dialog.open(DptopaisEditComponent, {
      data: { dataDptoEdit: dataDptoEdit },
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(element): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/addepto/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              location.reload();
            },
            error: (err: any) => {
              console.log(err);
              this.toastr.error('! NO ELIMINADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
