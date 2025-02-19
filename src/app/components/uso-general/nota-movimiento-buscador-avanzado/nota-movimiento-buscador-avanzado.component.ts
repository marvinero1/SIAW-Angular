import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogonotasmovimientosComponent } from '@components/inventario/CRUD/catalogonotasmovimientos/catalogonotasmovimientos.component';
import { CatalogoNotasMovimientoService } from '@components/inventario/CRUD/servicio-catalogo-notas-movimiento/catalogo-notas-movimiento.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BuscadorAvanzadoService } from '../servicio-buscador-general/buscador-avanzado.service';
interface buscadorGeneral {
  id: any,
  numeroid: any,
  a: any,
  concepto: any,
  fecha: any,
  cod_almacen: any,
  origen: any,
  destino: any,
  observacion: any,
}

@Component({
  selector: 'app-nota-movimiento-buscador-avanzado',
  templateUrl: './nota-movimiento-buscador-avanzado.component.html',
  styleUrls: ['./nota-movimiento-buscador-avanzado.component.scss']
})
export class NotaMovimientoBuscadorAvanzadoComponent implements OnInit {

  public id_tipo_view_get_codigo1: string;
  public id_tipo_view_get_codigo2: string;

  public almacn_parame_usuario_almacen1: any;
  public almacn_parame_usuario_almacen2: any;

  public fecha_hasta: any;
  public fecha_desde: any;

  buscadorObj!: buscadorGeneral[];
  selectebuscadorObj: buscadorGeneral[];

  private unsubscribe$ = new Subject<void>();

  todas: boolean = true;
  todas_id: boolean = false;
  todas_fecha: boolean = false;
  todas_almacen: boolean = false;

  id_buscador: any;
  num_id_buscador: any;
  codigo_documento: any;

  id_bool: boolean = false;
  fecha_bool: boolean = false;
  almacen_bool: boolean = false;

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  constructor(private api: ApiService, public dialogRef: MatDialogRef<NotaMovimientoBuscadorAvanzadoComponent>,
    private toastr: ToastrService, private dialog: MatDialog, private almacenservice: ServicioalmacenService,
    private _snackBar: MatSnackBar, private datePipe: DatePipe, private spinner: NgxSpinnerService, private messageService: MessageService,
    private serviciotipoid: TipoidService, private servicioNotasMovimientoCatalogo: CatalogoNotasMovimientoService,
    public servicioBuscadorAvanzado: BuscadorAvanzadoService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

  }

  ngOnInit() {
    // Catalogo Notas de Movimiento
    this.servicioNotasMovimientoCatalogo.disparadorDeCatalogoNotasMovimiento.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID Catalogo Notas Movimiento: ", data);
      if (this.id_tipo_view_get_codigo1 === undefined) {
        this.id_tipo_view_get_codigo1 = data.id_nota_movimiento.codigo;
        this.id_tipo_view_get_codigo2 = data.id_nota_movimiento.codigo;
      } else {
        this.id_tipo_view_get_codigo2 = data.id_nota_movimiento.codigo;
      }
    });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      if (this.almacn_parame_usuario_almacen1 === undefined) {
        this.almacn_parame_usuario_almacen1 = data.almacen.codigo;
        this.almacn_parame_usuario_almacen2 = data.almacen.codigo;
      } else {
        this.almacn_parame_usuario_almacen2 = data.almacen.codigo;
      }
    });
    //
  }

  habilitarTodo() {
    this.todas = true;

    this.id_bool = false;
    this.fecha_bool = false;
    this.almacen_bool = false;
  }

  habilitarID() {
    if (this.todas) {
      this.todas_id = false;
    } else {
      this.id_bool = true;
    }
  }

  habilitarTodoID() {
    if (!this.todas_id) {
      this.todas_id = true;
    } else {
      this.id_bool = false;
    }
  }

  habilitarFecha() {
    if (this.todas_fecha) {
      this.todas_fecha = false;
    } else {
      this.fecha_bool = true;
    }
  }

  habilitarFechaTodo() {
    if (!this.todas_fecha) {
      this.todas_fecha = false;
    } else {
      this.fecha_bool = false;
    }
  }

  habilitarAlmacen() {
    if (this.todas_almacen) {
      this.todas_almacen = false;
    } else {
      this.almacen_bool = true;
    }
  }

  habilitarAlmacenTodo() {
    if (!this.todas_almacen) {
      this.todas_almacen = false;
    } else {
      this.almacen_bool = false;
    }
  }

  getProformaById(element) {
    this.id_buscador = element.data.id;
    this.num_id_buscador = element.data.numeroid;
    this.codigo_documento = element.data.codigo;
  }

  buscadorNotasMovimiento() {
    let fecha_desde = this.datePipe.transform(this.fecha_desde, "yyyy-MM-dd");
    let fecha_hasta = this.datePipe.transform(this.fecha_hasta, "yyyy-MM-dd");

    if (this.almacn_parame_usuario_almacen1 === undefined) {
      this.almacn_parame_usuario_almacen1 = 0
    }

    if (this.almacn_parame_usuario_almacen2 === undefined) {
      this.almacn_parame_usuario_almacen2 = 0
    }

    if (this.fecha_desde === undefined && this.fecha_hasta === undefined) {
      fecha_desde = "1900-01-01";
      fecha_hasta = "1900-01-01";
    }

    let data = {
      itodos1: this.id_bool,
      id1: this.id_tipo_view_get_codigo1,
      id2: this.id_tipo_view_get_codigo2,

      ftodos1: this.fecha_bool,
      fechade: fecha_desde,
      fechaa: fecha_hasta,

      atodos1: this.almacen_bool,
      codalmacen1: Number(this.almacn_parame_usuario_almacen1) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen1),
      codalmacen2: Number(this.almacn_parame_usuario_almacen2) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen2),
    };

    const url = `/inventario/busq/prgbusqinnota/getNotMovByParam/${this.userConn}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, data).subscribe({
      next: (datav) => {
        console.log(datav);
        this.buscadorObj = datav;
        if (this.buscadorObj.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'NO HAY DATA' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'BUSQUEDA CORRECTA' });
        }

        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! OCURRIO UN PROBLEMA AL TRAER LA DATA !' });
        setTimeout(() => {
          this.spinner.hide();
        }, 100);
      },
      complete: () => {

        setTimeout(() => {
          this.spinner.hide();
        }, 100);
      }
    });
  }

  mandarAModificarNM() {
    this.spinner.show();

    this.servicioBuscadorAvanzado.disparadorDeID_NumeroIDNotasMovimiento.emit({
      buscador_id: this.id_buscador,
      buscador_num_id: this.num_id_buscador
    })
    this.toastr.success("NOTA DE MOVIMIENTO SELECCIONADA CON EXITO !");
    setTimeout(() => {
      this.spinner.hide();
    }, 100);

    this.close();
  }



  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        almacen: "almacen",
        ventana: "ventana_buscador"
      }
    });
  }

  modalTipoIDNotasMovimiento(): void {
    this.dialog.open(CatalogonotasmovimientosComponent, {
      width: '520px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana_buscador"
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
