import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';

@Component({
  selector: 'app-precios-permitido-desct',
  templateUrl: './precios-permitido-desct.component.html',
  styleUrls: ['./precios-permitido-desct.component.scss']
})
export class PreciosPermitidoDesctComponent implements OnInit {

  descuento_edit: any = [];
  userConn: any;
  desct_codigo: any;
  userLogueado: any = [];
  precios_codigo: any = [];
  cod_precio_venta_modal: any = [];
  save_precio: any = [];
  BD_storage: any;

  displayedColumns = ['coddescuento', 'descripcion', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmvedescuento2.vb";
  public ventana = "punto-venta-CREATE"
  public detalle = "punto-venta";
  public tipo = "punto-venta-CREATE";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<PreciosPermitidoDesctComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, @Inject(MAT_DIALOG_DATA) public descuento: any, public dialog: MatDialog, private spinner: NgxSpinnerService,
    private toastr: ToastrService, public servicioPrecioVenta: ServicioprecioventaService) {

    this.descuento_edit = this.descuento.descuento;
    this.desct_codigo = this.descuento.descuento?.codigo;
    console.log(this.descuento_edit);
  }

  ngOnInit(): void {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.getPreciosCodigo();

    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
    });
  }

  savePrecioVenta() {
    let data = {
      coddescuento: this.descuento_edit?.codigo,
      codtarifa: this.cod_precio_venta_modal?.codigo,
    };

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/vedescuento/vedescuento_tarifa/";

    return this.api.create("/venta/mant/vedescuento/vedescuento_tarifa/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.save_precio = datav;
          console.log(this.save_precio);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.getPreciosCodigo();
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
          this.toastr.success('Guardado con Exito! 🎉');
          this.getPreciosCodigo();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  getPreciosCodigo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vedescuento/vedescuento_tarifa/";
    return this.api.getAll('/venta/mant/vedescuento/vedescuento_tarifa/' + this.userConn + "/" + this.desct_codigo)
      .subscribe({
        next: (datav) => {
          this.precios_codigo = datav;
          console.log(this.precios_codigo);

          this.dataSource = new MatTableDataSource(this.precios_codigo);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  catalogoVentas(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(element) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion" + "Ruta:--/venta/mant/vedescuento/vedescuento_tarifa/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete("/venta/mant/vedescuento/vedescuento_tarifa/" + this.userConn + "/" + this.desct_codigo + "/" + element.codtarifa)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              this.toastr.success('!SE ELIMINO EXITOSAMENTE!');
              setTimeout(() => {
                this.spinner.hide();
              }, 1500);

              this.getPreciosCodigo();
            },
            error: (err: any) => {
              console.log(errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! NO SE ELIMINO !');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
