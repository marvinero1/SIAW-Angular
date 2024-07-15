import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NumpedidomercaderiaCreateComponent } from './numpedidomercaderia-create/numpedidomercaderia-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NumpedidomercaderiaEditComponent } from './numpedidomercaderia-edit/numpedidomercaderia-edit.component';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-numpedidomercaderia',
  templateUrl: './numpedidomercaderia.component.html',
  styleUrls: ['./numpedidomercaderia.component.scss']
})
export class NumpedidomercaderiaComponent implements OnInit {

  public pedido_mercaderia: any = [];
  public data: any = [];
  data_edit = [];
  userConn: any;

  displayedColumns = ['id', 'descripcion', 'nroactual', 'fechareg', 'horareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmintipopedido.vb";
  public ventana = "Numeración Tipos de Pedidos de Mercaderia"
  public detalle = "nts-movpedmerca-detalle";
  public tipo = "transaccion-nts-movpedmerca-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.mandarNombre();

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllPedidoMercaderia();
  }

  getAllPedidoMercaderia() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intipopedido/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.pedido_mercaderia = datav;
          // console.log('pedidos mercaderia', datav);

          this.dataSource = new MatTableDataSource(this.pedido_mercaderia);
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
    this.dialog.open(NumpedidomercaderiaCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(dataMercaderiaEdit) {
    this.data_edit = dataMercaderiaEdit;
    // console.log(this.data_edit);
    const dialogRef = this.dialog.open(NumpedidomercaderiaEditComponent, {
      data: { dataMercaderiaEdit: dataMercaderiaEdit },
      width: 'auto',
      height: 'auto',
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
      // console.log(result);
      if (result) {
        return this.api.delete('/inventario/mant/intipopedido/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.toastr.success('! Eliminado Exitosamente !');
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              location.reload();
            },
            error: (err: any) => {
              this.toastr.error('! NO SE ELIMINO !');
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
