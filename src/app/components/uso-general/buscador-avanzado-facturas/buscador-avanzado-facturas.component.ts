import { DatePipe } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ModalClienteComponent } from '@components/mantenimiento/ventas/modal-cliente/modal-cliente.component';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { CatalogoFacturasComponent } from '@components/mantenimiento/ventas/transacciones/facturas/catalogo-facturas/catalogo-facturas.component';
import { CatalogoFacturasService } from '@components/mantenimiento/ventas/transacciones/facturas/catalogo-facturas/servicio-catalogo-facturas/catalogo-facturas.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { BuscadorAvanzadoService } from '../servicio-buscador-general/buscador-avanzado.service';
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
  selector: 'app-buscador-avanzado-facturas',
  templateUrl: './buscador-avanzado-facturas.component.html',
  styleUrls: ['./buscador-avanzado-facturas.component.scss']
})

export class BuscadorAvanzadoFacturasComponent implements OnInit {

  @HostListener("dblclick", []) unloadHandler(event: KeyboardEvent) {
    // this.mandarAModificarFactura();
  };



  private unsubscribe$ = new Subject<void>();

  todas_id: boolean = false;
  todas_fecha: boolean = false;
  todas_almacen: boolean = false;
  todas_vendedor: boolean = false;
  todas_cliente: boolean = false;
  todas_dosificacion: boolean = false;
  todas: boolean = true;


  id_bool: boolean = false;
  fecha_bool: boolean = false;
  almacen_bool: boolean = false;
  vendedor_bool: boolean = false;
  cliente_bool: boolean = false;
  numero_dosificacion_bool: boolean = false;
  nombre_cliente_bool: boolean = false;
  nit_bool: boolean = false;

  buscadorObj!: buscadorGeneral[];
  selectebuscadorObj: buscadorGeneral[];


  public id_tipo_view_get_codigo1: string;
  public id_tipo_view_get_codigo2: string;

  public almacn_parame_usuario_almacen1: any;
  public almacn_parame_usuario_almacen2: any;

  public fecha_hasta: any;
  public fecha_desde: any;

  fecha_desde_input: any;
  fecha_hasta_input: any;

  public cod_vendedor_cliente1: string;
  public cod_vendedor_cliente2: string;

  public codigo_cliente1: string;
  public codigo_cliente2: string;

  public numero_dosificacion: any;
  public nit: any;

  public nombre_cliente: any;

  //GETS
  public clientes: any = [];
  public almacen_get: any = [];
  public vendedor_get: any = [];
  public id_tipo_view_get_array: any = [];

  id_buscador: any;
  num_id_buscador: any;
  codigo_documento: any;

  userConn: any;
  usuarioLogueado: any;

  constructor(private api: ApiService, public dialogRef: MatDialogRef<BuscadorAvanzadoFacturasComponent>, private messageService: MessageService,
    private almacenservice: ServicioalmacenService, private serviciovendedor: VendedorService,
    public servicioCatalogoFacturas: CatalogoFacturasService, public servicioBuscadorAvanzado: BuscadorAvanzadoService,
    private _snackBar: MatSnackBar, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private dialog: MatDialog, private serviciotipoid: TipoidService, private servicioCliente: ServicioclienteService,
    @Inject(MAT_DIALOG_DATA) public ventana: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.getIdTipo();
    this.getClienteCatalogo();
    this.getAlmacen();
    this.getVendedorCatalogo();

    // Id Tipo
    this.servicioCatalogoFacturas.disparadorDeIDFacturas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo ID Tipo Factura: ", data.factura);
      this.id_tipo_view_get_codigo1 = data.factura.id;
      this.id_tipo_view_get_codigo2 = data.factura.id;
    });

    //Almacen
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      if (this.almacn_parame_usuario_almacen1 === undefined) {
        this.almacn_parame_usuario_almacen1 = data.almacen.codigo;
        this.almacn_parame_usuario_almacen2 = this.almacn_parame_usuario_almacen1;
      } else {
        this.almacn_parame_usuario_almacen2 = data.almacen.codigo;
      }
    });
    //

    //Vendedor
    this.serviciovendedor.disparadorDeVendedoresBuscadorGeneral.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      if (this.cod_vendedor_cliente1 === undefined) {
        this.cod_vendedor_cliente1 = data.vendedor.codigo;
        this.cod_vendedor_cliente2 = this.cod_vendedor_cliente1
      } else {
        this.cod_vendedor_cliente2 = data.vendedor.codigo;
      }
    });
    //finvendedor

    //Clientes
    this.servicioCliente.disparadorDeClienteBuscadorGeneral.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      if (this.codigo_cliente1 === undefined) {
        this.codigo_cliente1 = data.cliente.codigo;
        this.codigo_cliente2 = this.codigo_cliente1;
      } else {
        this.codigo_cliente2 = data.cliente.codigo;
      }
    });
    //
  }

  buscadorFacturas() {
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

      facttodos1: this.numero_dosificacion_bool,
      nrofactura: this.numero_dosificacion,

      ntodos1: this.nombre_cliente_bool,
      nomcliente: this.nombre_cliente,

      ntodos2: this.nit_bool,
      nit: this.nit
    };

    const url = `/venta/busq/prgbusqfact/getFacturasByParam/${this.userConn}/true/true`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, data).subscribe({
      next: (datav) => {
        console.log(datav);
        this.buscadorObj = datav

        if (this.buscadorObj.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'NO HAY DATA' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'BUSQUEDA CORRECTA' });
        }

        setTimeout(() => {
          this.spinner.hide();
        }, 100);
      },
      error: (err) => {
        console.log(err, errorMessage);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! OCURRIO UN PROBLEMA AL BUSCAR !' });
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

  habilitarID() {
    if (this.todas) {
      this.todas_id = false;
    } else {
      this.id_bool = true;
    }
  }

  habilitarFecha() {
    if (this.todas_fecha) {
      this.todas_fecha = true;
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

  habilitarVendedor() {
    if (this.vendedor_bool) {
      this.vendedor_bool = true;
    } else {
      this.vendedor_bool = false;
    }
  }

  habilitarCliente() {
    if (this.cliente_bool) {
      this.cliente_bool = true;
    } else {
      this.cliente_bool = false;
    }
  }

  habilitarDosificacion() {
    if (this.numero_dosificacion_bool) {
      this.numero_dosificacion_bool = true;
    } else {
      this.numero_dosificacion_bool = false;
    }
  }

  habilitarNombreCliente() {
    if (this.nombre_cliente_bool) {
      this.nombre_cliente_bool = true;
    } else {
      this.nombre_cliente_bool = false;
    }
  }

  habilitarNIT() {
    if (this.nombre_cliente_bool) {
      this.nombre_cliente_bool = true;
    } else {
      this.nombre_cliente_bool = false;
    }
  }

  getProformaById(element) {
    this.id_buscador = element.data.id;
    this.num_id_buscador = element.data.numeroid;
    this.codigo_documento = element.data.codigo;

    console.log(element, this.id_buscador, this.num_id_buscador, this.codigo_documento);
  }

  mandarAModificarFactura() {
    this.spinner.show();

    this.servicioBuscadorAvanzado.disparadorDeID_NumeroIDModificarFacturaMostradorTiendas.emit({
      buscador_id: this.id_buscador,
      buscador_num_id: this.num_id_buscador,
      codigo: this.codigo_documento,
    });

    this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! FACTURA TRANSFERIDA CON EXITO !' });
    setTimeout(() => {
      this.spinner.hide();
    }, 500);

    this.close();
  }

  //GETS
  getClienteCatalogo() {
    // this.spinner.show();
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/mant/vecliente/catalogo/";
    return this.api.getAll('/venta/mant/vecliente/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.clientes = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveCliente(event: any) {
    const inputValue = event.target.value;

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.clientes.some(objeto => objeto.codigo === inputValue);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = inputValue;
    }
  }

  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
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

  getVendedorCatalogo() {
    let a
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/catalogo/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
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

  getIdTipo() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogoNumProfxUsuario/";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
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
    const inputValue = event.target.value;
    let cadena = inputValue.toString();
    const encontrado = this.id_tipo_view_get_array.some(objeto => objeto.id === cadena.toUpperCase());

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = cadena;
    }
  }










  modalTipoIDProformas(): void {
    this.dialog.open(CatalogoFacturasComponent, {
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
      width: '700px',
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
