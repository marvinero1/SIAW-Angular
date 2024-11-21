import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ModalAnticiposComponent } from '@components/mantenimiento/ventas/modal-anticipos/modal-anticipos.component';
import { AnticiposService } from '@components/mantenimiento/ventas/modal-anticipos/servicio-mandar-anticipos/anticipos.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { BuscadorAvanzadoService } from '../servicio-buscador-general/buscador-avanzado.service';
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
  selector: 'app-buscador-avanzado-anticipos',
  templateUrl: './buscador-avanzado-anticipos.component.html',
  styleUrls: ['./buscador-avanzado-anticipos.component.scss']
})
export class BuscadorAvanzadoAnticiposComponent implements OnInit {


  buscadorObj!: buscadorGeneral[];
  selectebuscadorObj: buscadorGeneral[];

  id_anticipo:any;

  public almacn_parame_usuario_almacen1: any;
  public almacn_parame_usuario_almacen2: any;

  public fecha_hasta: any;
  public fecha_desde: any;

  fecha_desde_input: any;
  fecha_hasta_input: any;

  id_bool: boolean = false;
  fecha_bool: boolean = false;
  almacen_bool: boolean = false;

  id_buscador:any;
  num_id_buscador:any;

  todas: boolean = true;
  todas_id: boolean = false;
  todas_fecha: boolean = false;
  todas_almacen: boolean = false;

  userConn: any;
  BD_storage: any;

  usuarioLogueado: any;
  agencia_logueado: any;
  codigo_documento: any;

  monto_rest_anticipo:number;
  
  private unsubscribe$ = new Subject<void>();

  constructor(private api: ApiService, private datePipe: DatePipe, private dialog: MatDialog,
    public dialogRef: MatDialogRef<BuscadorAvanzadoAnticiposComponent>, private toastr: ToastrService,
    private almacenservice: ServicioalmacenService, private spinner: NgxSpinnerService,public servicioBuscadorAvanzado: BuscadorAvanzadoService,
    private _snackBar: MatSnackBar, public servicioAnticipos: AnticiposService){

      this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
      this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
      this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  }

  ngOnInit() {
    this.getHoraFechaServidorBckEnd();

    //Anticipos
    this.servicioAnticipos.disparadorDeCatalagoAnticipo.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.id_anticipo = data.id_anticipo.id;
    });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenesBuscadorAvanzadoAnticipos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.almacn_parame_usuario_almacen1 = data.almacen.codigo;
      this.almacn_parame_usuario_almacen2 =  this.almacn_parame_usuario_almacen1;
    });
    //
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // console.log(datav);
          this.fecha_desde = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
          this.fecha_hasta = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");

          // console.log(this.fecha_actual, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  buscadorAnticipos(){
      console.log("FECHAS: ", this.fecha_desde, this.fecha_hasta);
  
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
        id1: this.id_anticipo,
        id2: this.id_anticipo,
  
        ftodos1: this.fecha_bool,
        fechade: fecha_desde,
        fechaa: fecha_hasta,
  
        atodos1: this.almacen_bool,
        codalmacen1: Number(this.almacn_parame_usuario_almacen1) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen1),
        codalmacen2: Number(this.almacn_parame_usuario_almacen2) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen2),
      };
  
      const url = `/venta/busq/prgbusqanticipo/getAnticiposByParam/${this.userConn}`;
      const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;
  
      this.api.create(url, data).subscribe({
        next: (datav) => {
          console.log(datav);
          this.buscadorObj = datav
  
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! OCURRIO UN PROBLEMA AL GRABAR !');
          //this.detalleProformaCarritoTOExcel();
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
  }

  getProformaById(element) {
    console.log("🚀 ~ BuscadorAvanzadoAnticiposComponent ~ getProformaById ~ element:", element)
    this.id_buscador = element.data.id;
    this.num_id_buscador = element.data.numeroid;
    this.monto_rest_anticipo = element.data.montorest;
  }

  mandarAFacturacionMostradorAnticipoElegido(){
    this.spinner.show();

    this.servicioBuscadorAvanzado.disparadorDeAnticipoSeleccionado.emit({
      id_anticipo: this.id_buscador,
      num_id_anticipo: this.num_id_buscador,
      monto_rest: this.monto_rest_anticipo,
    });

    this.toastr.success("ANTICIPO TRANSFERIDO CON EXITO !");
    setTimeout(() => {
      this.spinner.hide();
    }, 500);

    this.close();
  }

  habilitarTodoID(){
    if (!this.todas_id) {
      this.todas_id = true;
    } else {
      this.id_bool = false;
    }
  }

  habilitarID(){
    if (this.todas) {
      this.todas_id = false;
    } else {
      this.id_bool = true;
    }
  }

  habilitarTodo() {
    this.todas = true;

    this.id_bool = false;
    this.fecha_bool = false;
    this.almacen_bool = false;
  }

  habilitarFecha() {
    if (this.todas_fecha) {
      this.todas_fecha = false;
    } else {
      this.fecha_bool = true;
    }
  }

  habilitarAlmacen() {
    if (this.todas_almacen) {
      this.todas_almacen = false;
    } else {
      this.almacen_bool = true;
    }
  }

  habilitarFechaTodo() {
    if (!this.todas_fecha) {
      this.todas_fecha = false;
    } else {
      this.fecha_bool = false;
    }
  }











  modalTipoIDAnticipos(): void {
    this.dialog.open(ModalAnticiposComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        almacen: "almacen",
        ventana: "ventana_buscador_general_anticipos"
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
