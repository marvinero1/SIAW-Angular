import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServicioUsuarioService } from '@components/mantenimiento/usuario/service-usuario/servicio-usuario.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ModalUsuarioComponent } from '@components/mantenimiento/usuario/modal-usuario/modal-usuario.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
@Component({
  selector: 'app-tarifa-permitidas-usuario',
  templateUrl: './tarifa-permitidas-usuario.component.html',
  styleUrls: ['./tarifa-permitidas-usuario.component.scss']
})
export class TarifaPermitidasUsuarioComponent implements OnInit {

  tarifa: any = [];
  id_proforma_service: any;
  cod_usuario: any;
  guardar_tarifa: any = [];
  precio_venta: any = [];
  tarifa_get: any = [];
  precio_venta_codigo: any;
  usuarioLogueado: any;
  data: [];
  usuario_get: any = [];
  userConn: any;

  displayedColumns = ['usuario', 'id', 'tarifa', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "prgusuario_tarifa.vb";
  public ventana = "Tarifas Permitidas por Usuario"
  public detalle = "tarifa-permitidas-user-detalle";
  public tipo = "transaccion-tarifa-permitidas-user-POST";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    private toastr: ToastrService, public servicioPrecioVenta: ServicioprecioventaService, public nombre_ventana_service: NombreVentanaService,
    public usuarioservice: ServicioUsuarioService) {

    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.getAllTarifaadUsuario();
    this.getUsuario();
    this.getTarifa();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.usuarioservice.disparadorDeUsuarios.subscribe(data => {
      console.log("Recibiendo Usuario: ", data);
      this.cod_usuario = data.usuario;
    });

    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio Venta: ", data);
      this.precio_venta = data.precio_venta;
      this.precio_venta_codigo = data.precio_venta.codigo;
    });
  }

  getAllTarifaadUsuario() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adusuario_tarifa/";
    return this.api.getAll('/seg_adm/mant/adusuario_tarifa/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.tarifa = datav;
          console.log(this.tarifa);

          this.dataSource = new MatTableDataSource(this.tarifa);
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

  submitData() {
    let data = {
      usuario: this.cod_usuario,
      codtarifa: this.precio_venta_codigo,
    };

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/mant/adusuario_tarifa/";
    return this.api.create("/seg_adm/mant/adusuario_tarifa/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.guardar_tarifa = datav;
          console.log(this.guardar_tarifa);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success("Guardado Exitosamente");
          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  getUsuario() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/adusuario/catalogo/"
    return this.api.getAll('/seg_adm/mant/adusuario/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.usuario_get = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveUsuario(event: any) {
    const inputValue = event.target.value;
    let mayus = inputValue.toUpperCase();

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.usuario_get.some(objeto => objeto.login === mayus);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      this.cod_usuario == mayus;
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', mayus);
  }

  getTarifa() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/intarifa/catalogo/";

    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get = datav;
          console.log(this.tarifa_get);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    var numberValue = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get.some(objeto => objeto.codigo === numberValue);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      this.precio_venta_codigo == numberValue;
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', numberValue);
  }

  eliminar(element): void {
    let ventana = "tarifa-permitidas-user"
    let detalle = "tarifa-permitidas-user-delete";
    let tipo = "tarifa-permitidas-user-DELETE";

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/mant/adusuario_tarifa/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/adusuario_tarifa/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");

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

  modalUsuario(): void {
    this.dialog.open(ModalUsuarioComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalCatalogoPrecio(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
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
