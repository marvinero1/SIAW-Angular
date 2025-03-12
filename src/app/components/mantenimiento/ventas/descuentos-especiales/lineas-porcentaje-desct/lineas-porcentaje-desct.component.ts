import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from '@services/log-service.service';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { LineaProductoCatalogoComponent } from '@components/mantenimiento/inventario/lineaproducto/linea-producto-catalogo/linea-producto-catalogo.component';
import { ServicioLineaProductoService } from '@components/mantenimiento/inventario/lineaproducto/service-linea/servicio-linea-producto.service';
@Component({
  selector: 'app-lineas-porcentaje-desct',
  templateUrl: './lineas-porcentaje-desct.component.html',
  styleUrls: ['./lineas-porcentaje-desct.component.scss']
})
export class LineasPorcentajeDesctComponent implements OnInit {

  descuento_edit: any = [];
  userConn: any;
  desct_codigo: any;
  userLogueado: any = [];
  lineas: any = [];
  cod_precio_venta_modal: any = [];
  save_precio: any = [];
  codigo_item_catalogo: any = [];
  linea_catalogo: any = [];

  displayedColumns = ['coddescuento', 'descripcion', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild("dialogD") dialogD: ElementRef;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmvedescuento1.vb";
  public ventana = "linea-porcentaje-CREATE"
  public detalle = "linea-porcentaje";
  public tipo = "linea-porcentaje-CREATE";

  constructor(private api: ApiService, public dialogRef: MatDialogRef<LineasPorcentajeDesctComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, @Inject(MAT_DIALOG_DATA) public descuento: any, public dialog: MatDialog, public itemservice: ItemServiceService,
    private spinner: NgxSpinnerService, private toastr: ToastrService, public servicioPrecioVenta: ServicioprecioventaService,
    private servicioLinea: ServicioLineaProductoService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.descuento_edit = this.descuento?.descuento;
    this.desct_codigo = this.descuento?.descuento?.codigo;
    console.log(this.descuento_edit);

    this.getLineas()
  }

  ngOnInit() {
    this.servicioLinea.disparadorDeLineaItem.subscribe(data => {
      console.log("Recibiendo Linea: ", data);
      this.linea_catalogo = data.linea;

      console.log(this.linea_catalogo);
    });
  }

  getLineas() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vedescuento/vedescuento_tarifa/";
    return this.api.getAll('/venta/mant/vedescuento/vedescuento1/' + this.userConn + "/" + this.desct_codigo)
      .subscribe({
        next: (datav) => {
          this.lineas = datav;
          console.log(this.lineas);

          this.dataSource = new MatTableDataSource(this.lineas);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  submitData() {
    let data = {
      codigo: this.descuento_edit.codigo,
      coddescuento: this.descuento_edit.codigo,
      codlinea: this.linea_catalogo.codigo,
      descuento: 0
    };

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/vedescuento/vedescuento1/";

    return this.api.create("/venta/mant/vedescuento/vedescuento1/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.save_precio = datav;
          console.log(this.save_precio);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.getLineas();
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
          this.toastr.success('Guardado con Exito! 🎉');
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  catalogoLineas() {
    this.dialog.open(LineaProductoCatalogoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(element) {

    let errorMessage = "La Ruta presenta fallos al hacer peticion" + "Ruta:--/venta/mant/vedescuento/vedescuento1/ Delete";
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete("/venta/mant/vedescuento/vedescuento1/" + this.userConn + "/" + element.codigo + "/" + this.descuento_edit.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              this.toastr.success('!SE ELIMINO EXITOSAMENTE!');
              setTimeout(() => {
                this.spinner.hide();
              }, 1500);

              this.getLineas();
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

  eliminarTodo() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion" + "Ruta:--/venta/mant/vedescuento/deleteTodo_vedescuento1/ Delete";
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: "" },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete("/venta/mant/vedescuento/deleteTodo_vedescuento1/" + this.userConn + "/" + this.desct_codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              this.toastr.success('!SE ELIMINO EXITOSAMENTE!');
              setTimeout(() => {
                this.spinner.hide();
              }, 1500);

              this.getLineas();
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
