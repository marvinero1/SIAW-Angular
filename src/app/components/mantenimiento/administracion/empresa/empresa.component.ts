import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmpresaCreateComponent } from './empresa-create/empresa-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  empresa: any = [];
  panelOpenState = false;
  userConn;

  nombre_ventana: string = "abmadempresa.vb";
  public ventana = "Empresa"
  public detalle = "empresa-detalle";
  public tipo = "transaccion-empresa-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    public nombre_ventana_service: NombreVentanaService) {

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.mandarNombre();
    this.getAllEmpresa();
  }

  openDialog(): void {
    this.dialog.open(EmpresaCreateComponent, {
      width: '1020px',
      height: 'auto',
    });
  }

  getAllEmpresa() {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/adempresa/";
    return this.api.getAll('/seg_adm/mant/adempresa/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
          console.log(this.empresa);


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

  eliminar(element): void {
    let user_conn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /moneda Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/adempresa/' + user_conn + '/' + element)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
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
