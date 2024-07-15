import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RubroCreateComponent } from './rubro-create/rubro-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ModalRubroComponent } from './modal-rubro/modal-rubro.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ServiciorubroService } from './servicio/serviciorubro.service';
import { RubroEditComponent } from './rubro-edit/rubro-edit.component';
@Component({
  selector: 'app-rubro',
  templateUrl: './rubro.component.html',
  styleUrls: ['./rubro.component.scss']
})
export class RubroComponent implements OnInit {

  rubro: any = [];
  data: [];
  userConn: any;

  public codigo: string = '';

  displayedColumns = ['codigo', 'descripcion', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmverubro.vb";
  public ventana = "Rubro"
  public detalle = "rubro-delete";
  public tipo = "rubro-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, public dialogRef: MatDialogRef<RubroComponent>,
    private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService, public servicioRubro: ServiciorubroService) {
    this.mandarNombre();
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllRubro();
  }

  getAllRubro() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/mant/verubro/";
    return this.api.getAll('/venta/mant/verubro/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.rubro = datav;

          this.dataSource = new MatTableDataSource(this.rubro);
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
    this.dialog.open(RubroCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openDialogCatalogo(): void {
    this.dialog.open(ModalRubroComponent, {
      width: 'auto',
      height: 'auto',
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
        return this.api.delete('/venta/mant/verubro/' + this.userConn + "/" + element.codigo)
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

  editar(dataRubroEdit) {
    this.data = dataRubroEdit;
    this.dialog.open(RubroEditComponent, {
      data: { dataRubroEdit: dataRubroEdit },
      width: 'auto',
      height: 'auto',
    });
  }

  mandarRubro() {
    this.servicioRubro.disparadorDeRubro.emit({
      rubro: this.codigo,
    });
    this.close();
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
