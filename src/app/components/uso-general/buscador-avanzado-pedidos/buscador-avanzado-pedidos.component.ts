import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BuscadorAvanzadoService } from '../servicio-buscador-general/buscador-avanzado.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
interface buscadorGeneral {
  id: any,
  numeroid: any,
  fecha: any,
  nomcliente: any,
  codvendedor: any,
  codalmacen: any,
  total: any,
}

@Component({
  selector: 'app-buscador-avanzado-pedidos',
  templateUrl: './buscador-avanzado-pedidos.component.html',
  styleUrls: ['./buscador-avanzado-pedidos.component.scss']
})

export class BuscadorAvanzadoPedidosComponent implements OnInit {

  buscadorObj!: buscadorGeneral[];
  selectebuscadorObj: buscadorGeneral[];

  private unsubscribe$ = new Subject<void>();

  public fecha_hasta: any;
  public fecha_desde: any;

  public almacn_parame_usuario_almacen1: any;
  public almacn_parame_usuario_almacen2: any;

  id_buscador: any;
  num_id_buscador: any;

  fecha_bool: boolean = false;
  almacen_bool: boolean = false;

  fecha_desde_input: any;
  fecha_hasta_input: any;

  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  codigo_documento: any;

  constructor(private api: ApiService, private datePipe: DatePipe, private dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscadorAvanzadoPedidosComponent>, private messageService: MessageService,
    private almacenservice: ServicioalmacenService, private spinner: NgxSpinnerService, private _snackBar: MatSnackBar,
    public servicioBuscadorAvanzado: BuscadorAvanzadoService,) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  }

  ngOnInit() {
    this.getHoraFechaServidorBckEnd();

    //Almacen
    this.almacenservice.disparadorDeAlmacenesBuscadorAvanzadoPedidos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacn_parame_usuario_almacen1 = data.almacen.codigo;
      this.almacn_parame_usuario_almacen2 = this.almacn_parame_usuario_almacen1;
    });
    //
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.fecha_desde = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
          this.fecha_hasta = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  buscadorAnticipos() {
    console.log("FECHAS: ", this.fecha_desde, this.fecha_hasta);

    let fecha_desde = this.datePipe.transform(this.fecha_desde, "yyyy-MM-dd");
    let fecha_hasta = this.datePipe.transform(this.fecha_hasta, "yyyy-MM-dd");

    if (this.almacn_parame_usuario_almacen1 === undefined) {
      this.almacn_parame_usuario_almacen1 = 0;
    }

    if (this.almacn_parame_usuario_almacen2 === undefined) {
      this.almacn_parame_usuario_almacen2 = 0;
    }

    if (this.fecha_desde === undefined && this.fecha_hasta === undefined) {
      fecha_desde = "1900-01-01";
      fecha_hasta = "1900-01-01";
    }

    let data = {
      ftodos1: this.fecha_bool,
      fechade: fecha_desde,
      fechaa: fecha_hasta,

      atodos1: this.almacen_bool,
      codalmacen1: Number(this.almacn_parame_usuario_almacen1) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen1),
      codalmacen2: Number(this.almacn_parame_usuario_almacen2) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen2),
    };

    const url = `/inventario/busq/prgbusqinpedi/getPedidosByParam/${this.userConn}`;
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
        }, 10);
      },
      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! OCURRIO UN PROBLEMA AL GRABAR !' });
        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      },
      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      }
    });
  }

  mandarAPedido() {
    this.spinner.show();

    this.servicioBuscadorAvanzado.disparadorDePedidoSeleccionado.emit({
      buscador_id: this.id_buscador,
      buscador_num_id: this.num_id_buscador
    });

    this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! PEDIDO SELECCIONADO !' });
    setTimeout(() => {
      this.spinner.hide();
    }, 100);

    this.close();
  }

  getPedidoById(element) {
    console.log("🚀 ~ BuscadorAvanzadoAnticiposComponent ~ getProformaById ~ element:", element)
    this.id_buscador = element.data.id;
    this.num_id_buscador = element.data.numeroid;
  }

  habilitarFecha() {
    if (this.fecha_bool) {
      this.fecha_bool = true;
    } else {
      this.fecha_bool = false;
    }
  }

  habilitarAlmacen() {
    if (this.almacen_bool) {
      this.almacen_bool = true;
    } else {
      this.almacen_bool = false;
    }
  }
























  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        almacen: "almacen",
        ventana: "ventana_buscador_general_pedidos"
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

}
