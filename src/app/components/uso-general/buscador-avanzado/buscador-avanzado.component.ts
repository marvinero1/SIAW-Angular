import { Component, HostListener, OnInit } from '@angular/core';
import { BuscadorAvanzadoService } from '../servicio-buscador-general/buscador-avanzado.service';
import { ApiService } from '@services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalIdtipoComponent } from '@components/mantenimiento/ventas/modal-idtipo/modal-idtipo.component';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ModalClienteComponent } from '@components/mantenimiento/ventas/modal-cliente/modal-cliente.component';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
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
  selector: 'app-buscador-avanzado',
  templateUrl: './buscador-avanzado.component.html',
  styleUrls: ['./buscador-avanzado.component.scss']
})
export class BuscadorAvanzadoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarAModificarProforma();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarAModificarProforma();
  };

  public id_tipo_view_get_codigo1: string;
  public id_tipo_view_get_codigo2: string;

  public almacn_parame_usuario_almacen1: any;
  public almacn_parame_usuario_almacen2: any;

  public fecha_hasta: any;
  public fecha_desde: any;

  public cod_vendedor_cliente1: string;
  public cod_vendedor_cliente2: string;

  public codigo_cliente1: string;
  public codigo_cliente2: string;

  todas: boolean = true;
  todas_id: boolean = false;
  todas_fecha: boolean = false;
  todas_cliente: boolean = false;
  todas_almacen: boolean = false;
  todas_vendedor: boolean = false;

  id_bool: boolean = false;
  fecha_bool: boolean = false;
  almacen_bool: boolean = false;
  vendedor_bool: boolean = false;
  cliente_bool: boolean = false;

  id_tipo_view_get_array: any = [];
  almacen_get: any = [];
  vendedor_get: any = [];

  buscadorObj!: buscadorGeneral[];
  selectebuscadorObj: buscadorGeneral[];

  fecha_desde_input: any;
  fecha_hasta_input: any;

  id_buscador: any
  num_id_buscador: any;

  userConn: any;
  BD_storage: any;

  usuarioLogueado: any;
  agencia_logueado: any;

  constructor(private api: ApiService, public servicioBuscadorAvanzado: BuscadorAvanzadoService,
    public dialogRef: MatDialogRef<BuscadorAvanzadoComponent>, private toastr: ToastrService,
    private almacenservice: ServicioalmacenService, private serviciovendedor: VendedorService,
    private _snackBar: MatSnackBar, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private dialog: MatDialog, private serviciotipoid: TipoidService, private servicioCliente: ServicioclienteService,) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

  }

  ngOnInit() {
    this.getIdTipo();
    this.getAlmacen();
    this.getVendedorCatalogo();

    //ID TIPO
    this.serviciotipoid.disparadorDeIDTipo.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);

      if (this.id_tipo_view_get_codigo1 === undefined) {
        this.id_tipo_view_get_codigo1 = data.id_tipo.id;
      } else {
        this.id_tipo_view_get_codigo2 = data.id_tipo.id;
      }
    });
    //

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);

      if (this.almacn_parame_usuario_almacen1 === undefined) {
        this.almacn_parame_usuario_almacen1 = data.almacen.codigo;
      } else {
        this.almacn_parame_usuario_almacen2 = data.almacen.codigo;
      }
    });
    //

    //Vendedor
    this.serviciovendedor.disparadorDeVendedoresBuscadorGeneral.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);

      if (this.cod_vendedor_cliente1 === undefined) {
        this.cod_vendedor_cliente1 = data.vendedor;
      } else {
        this.cod_vendedor_cliente2 = data.vendedor;
      }
    });
    //finvendedor

    //Clientes
    this.servicioCliente.disparadorDeClienteBuscadorGeneral.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);

      if (this.codigo_cliente1 === undefined) {
        this.codigo_cliente1 = data.cliente.codigo;
      } else {
        this.codigo_cliente2 = data.cliente.codigo;
      }
    });
    //
  }

  habilitarTodo() {
    this.todas = true;

    this.id_bool = false;
    this.fecha_bool = false;
    this.almacen_bool = false;
    this.vendedor_bool = false;
    this.cliente_bool = false;
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

  habilitarCliente() {
    if (this.todas_cliente) {
      this.todas_cliente = false;
    } else {
      this.cliente_bool = true;
    }
  }

  habilitarClienteTodo() {
    if (this.todas_cliente) {
      this.todas_cliente = false;
    } else {
      this.cliente_bool = false;
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

  habilitarVendedor() {
    if (this.todas_vendedor) {
      this.todas_vendedor = false;
    } else {
      this.vendedor_bool = true;
    }
  }

  habilitarVendedorTodo() {
    if (!this.todas_vendedor) {
      this.todas_vendedor = false;
    } else {
      this.vendedor_bool = false;
    }
  }
















  //id tipo
  getIdTipo() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogoNumProfxUsuario/";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo_view_get_array = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveIDTipo(event: any) {
    console.log(this.id_tipo_view_get_array);
    const inputValue = event.target.value;

    let cadena = inputValue.toString();
    console.log(cadena);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.id_tipo_view_get_array.some(objeto => objeto.id === cadena.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = cadena;
    }
  }

  //almacen
  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen_get = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.almacen_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  // vendedor
  getVendedorCatalogo() {
    let a
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor_get = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveVendedor(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.vendedor_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  buscador() {
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
      id1: this.id_tipo_view_get_codigo1,
      id2: this.id_tipo_view_get_codigo2,

      ftodos1: this.fecha_bool,
      fechade: fecha_desde,
      fechaa: fecha_hasta,

      atodos1: this.almacen_bool,
      codalmacen1: Number(this.almacn_parame_usuario_almacen1) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen1),
      codalmacen2: Number(this.almacn_parame_usuario_almacen2) === undefined ? 0 : Number(this.almacn_parame_usuario_almacen2),

      vtodos1: this.vendedor_bool,
      codvendedor1: this.cod_vendedor_cliente1,
      codvendedor2: this.cod_vendedor_cliente2,

      ctodos1: this.cliente_bool,
      codcliente1: this.codigo_cliente1,
      codcliente2: this.codigo_cliente2,
    };

    const url = `/venta/busq/prgbusqprof/getProformasByParam/${this.userConn}`;
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
    this.id_buscador = element.data.id;
    this.num_id_buscador = element.data.numeroid;

    console.log(this.id_buscador, this.num_id_buscador);
  }

  mandarAModificarProforma() {
    this.spinner.show();

    this.servicioBuscadorAvanzado.disparadorDeID_NumeroID.emit({
      buscador_id: this.id_buscador,
      buscador_num_id: this.num_id_buscador
    })
    this.toastr.success("PROFORMA TRANSFERIDA CON EXITO !");
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    this.close();
  }

  modalTipoID(): void {
    this.dialog.open(ModalIdtipoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana_buscador"
      }
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        almacen: "almacen",
        ventana: "ventana_buscador"
      }
    });
  }

  modalVendedor(): void {
    this.dialog.open(ModalVendedorComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana_buscador"
      }
    });
  }

  modalClientes(): void {
    this.dialog.open(ModalClienteComponent, {
      width: 'auto',
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
