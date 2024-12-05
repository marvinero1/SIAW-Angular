import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { ServicioclienteService } from '../../serviciocliente/serviciocliente.service';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { VendedorService } from '../../serviciovendedor/vendedor.service';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { DatePipe } from '@angular/common';
import { MonedaServicioService } from '@components/mantenimiento/administracion/moneda/servicio-moneda/moneda-servicio.service';
import { SubTotalService } from '../../modal-sub-total/sub-total-service/sub-total.service';
import { FormBuilder } from '@angular/forms';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { TipoidService } from '../../serviciotipoid/tipoid.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from '@services/log-service.service';
import { SaldoItemMatrizService } from '../../matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicioTransfeAProformaService } from '../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { RecargoToProformaService } from '../../modal-recargos/recargo-to-proforma-services/recargo-to-proforma.service';
import { EtiquetaService } from '../../modal-etiqueta/servicio-etiqueta/etiqueta.service';
import { AnticipoProformaService } from '../../anticipos-proforma/servicio-anticipo-proforma/anticipo-proforma.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ComunicacionproformaService } from '../../serviciocomunicacionproforma/comunicacionproforma.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ModalClienteComponent } from '../../modal-cliente/modal-cliente.component';
import { ModalClienteInfoComponent } from '../../modal-cliente-info/modal-cliente-info.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { MonedaCatalogoComponent } from '@components/mantenimiento/administracion/moneda/moneda-catalogo/moneda-catalogo/moneda-catalogo.component';
import { MatrizItemsListaComponent } from '../../matriz-items-lista/matriz-items-lista.component';

@Component({
  selector: 'app-proforma-movil',
  templateUrl: './proforma-movil.component.html',
  styleUrls: ['./proforma-movil.component.scss']
})
export class ProformaMovilComponent implements OnInit {


  public nombre_ventana: string = "docveproforma.vb";
  public ventana: string = "Proforma";
  public detalle = "Doc.Proforma";
  public tipo = "transaccion-docveproforma-POST";


  //Parametros Iniciales
  id_tipo:any
  id_tipo_descripcion:any
  id_factura_numero_id:any;
  fecha_actual: any;
  hora_actual: any;
  hora_fecha_server: any = [];
  almacn_parame_usuario_almacen:any;
  cod_descuento:any;
  cod_tarifa:any;


  //primeroPaso
  codigo_cliente:any;


  //datosCliente
  cliente: any = [];
  public nombre_cliente: string;
  public nombre_comercial_cliente: string;
  public razon_social: any;
  public nombre_comercial_razon_social: string;
  public nombre_factura: string;
  public tipo_doc_cliente: any;
  public nit_cliente: string;
  public email_cliente: string;
  public email: string;
  public whatsapp_cliente: string;
  public moneda: string;
  public moneda_get_fuction: any = [];
  public documento_identidad: any = [];
  public cod_id_tipo_modal: any = [];
  public tipo_cliente: string = "";
  public parsed: string;
  public longitud_cliente: string;
  public latitud_cliente: string;
  public complemento_ci: string
  public cod_vendedor_cliente: string;
  public codigo_cliente_catalogo_real: string;
  public venta_cliente_oficina: boolean = false;
  public cliente_habilitado_get: any;
  public nombre_cliente_catalogo_real: string;
  public cliente_casual: boolean;
  public moneda_get_catalogo: any;
  public tipo_cambio_moneda_catalogo: any;


  usuarioLogueado: any;
  agencia_logueado: any;
  userConn: any;
  BD_storage: any;
  moneda_base: any = "BS";

  private debounceTimer: any;
  private unsubscribe$ = new Subject<void>();
  
  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private almacenservice: ServicioalmacenService, private cdr: ChangeDetectorRef,
    private serviciovendedor: VendedorService, private servicioPrecioVenta: ServicioprecioventaService,
    private datePipe: DatePipe, private serviciMoneda: MonedaServicioService, private subtotal_service: SubTotalService,
    private _formBuilder: FormBuilder, private servicioDesctEspecial: DescuentoService, private serviciotipoid: TipoidService,
    private toastr: ToastrService, private spinner: NgxSpinnerService, private log_module: LogService, private saldoItemServices: SaldoItemMatrizService,
    private _snackBar: MatSnackBar, private servicioTransfeProformaCotizacion: ServicioTransfeAProformaService,
    private servicio_recargo_proforma: RecargoToProformaService, private servicioEtiqueta: EtiquetaService,
    private anticipo_servicio: AnticipoProformaService, public nombre_ventana_service: NombreVentanaService,
    private communicationService: ComunicacionproformaService, private router:Router) {

      this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
      this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
      this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  }

  ngOnInit() {
    this.mandarNombre();
    this.getIdTipo();
    this.getHoraFechaServidorBckEnd();
    this.getAlmacenParamUsuario();
    this.getTipoDocumentoIdentidadProforma();
    this.getAllmoneda();

    //Item Sin Procesar DEL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsSeleccionadosSinProcesar.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Item Sin Procesar: ", data);
      // this.item_seleccionados_catalogo_matriz_sin_procesar = data;
      // this.totabilizar();

      // this.total = 0.00;
      // this.subtotal = 0.00;
      // this.recargos = 0.00;
      // this.des_extra = 0.00;
      // this.iva = 0.00;
    });
    //
  }

  getIdTipo() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/mant/venumeracion/catalogoNumProfxUsuario/";
    return this.api.getAll('/venta/mant/venumeracion/catalogoNumProfxUsuario/' + this.userConn + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          console.log("🚀 ~ ProformaMovilComponent ~ .pipe ~ datav:", datav)
          this.id_tipo= datav[0].id;
          this.id_tipo_descripcion = datav[0].descripcion;
          this.getIdTipoNumeracion(this.id_tipo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIdTipoNumeracion(id_tipo) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getNumActProd/";
    return this.api.getAll('/venta/transac/veproforma/getNumActProd/' + this.userConn + "/" + id_tipo)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.id_factura_numero_id = datav;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }
 

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // console.log(datav);
          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          this.hora_fecha_server = datav.horaServidor;
          // console.log(this.fecha_actual, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          // this.getMonedaTipoCambio(this.moneda_get_catalogo);
        }
      })
  }

  getAlmacenParamUsuario() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
    return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ ProformaMovilComponent ~ .pipe ~ datav:", datav)

          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_descuento = datav.coddescuento;
          this.cod_tarifa = datav.codtarifa;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getClientByID(codigo) {
    // console.log(codigo);
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vecliente/";
    return this.api.getAll('/venta/mant/vecliente/' + this.userConn + "/" + codigo)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.cliente = datav;
          console.log('data', this.cliente);

          // if(this.cliente.cliente.codigo?.startsWith('SN')){
          //   this.razon_social = this.cliente.cliente.razonsocial;
          // };

          this.codigo_cliente = this.cliente.cliente.codigo;
          // this.codigo_cliente_catalogo_real = this.cliente.cliente.codigo;
          this.nombre_comercial_cliente = this.cliente.cliente.nombre_comercial.trim();
          // this.nombre_factura = this.cliente.cliente.nombre_fact;
          this.razon_social = this.cliente.cliente.razonsocial.trim();
          this.complemento_ci = this.cliente.cliente.complemento_ci
          this.nombre_comercial_razon_social = this.nombre_comercial_cliente;
          this.tipo_doc_cliente = this.cliente.cliente.tipo_docid;
          this.nit_cliente = this.cliente.cliente.nit_fact.toString();
          this.email_cliente = this.cliente.vivienda.email === "" ? "facturasventas@pertec.com.bo" : this.cliente.vivienda.email;
          this.cliente_casual = this.cliente.cliente.casual;
          this.cliente_habilitado_get = this.cliente.cliente.habilitado;
          this.nombre_cliente_catalogo_real = this.cliente.cliente.razonsocial.trim();

          // this.cod_vendedor_cliente = this.cliente.cliente.codvendedor;
          this.moneda = this.cliente.cliente.moneda;
          // this.venta_cliente_oficina = this.cliente.cliente.venta_cliente_oficina;
          // this.tipo_cliente = this.cliente.cliente.tipo;

          // this.getDireccionCentral(codigo);
          
          this.whatsapp_cliente = this.cliente.vivienda.celular;
          // this.latitud_cliente = this.cliente.vivienda.latitud;
          // this.longitud_cliente = this.cliente.vivienda.longitud;
          // this.central_ubicacion = this.cliente.vivienda.central;

          // this.tabla_anticipos = [];
          // this.URL_maps = "https://www.google.com/maps/search/?api=1&query=" + this.latitud_cliente + "%2C" + this.longitud_cliente;
          // this.getUbicacionCliente(datav.cliente.codigo, datav.vivienda.direccion);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.warning('Usuario Inexiste! ⚠️');
        },
        complete: () => {

        }
      })
  }

  getTipoDocumentoIdentidadProforma() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTipoDocIdent/";
    return this.api.getAll('/venta/transac/veproforma/getTipoDocIdent/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.documento_identidad = datav;
          console.log(this.documento_identidad);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onPaste(event: any) {
    event.preventDefault();
    // También puedes mostrar un mensaje al usuario indicando que el pegado está bloqueado
    alert("EVENTO BLOQUEADO, NO PEGAR");
  }

  array_items_carrito_y_f4_catalogo:any=[]

  modalMatrizLista(): void {
    // Realizamos todas las validaciones
    // if (this.moneda_get_catalogo === '') {
    //   this.dialog.open(VentanaValidacionesComponent, {
    //     width: 'auto',
    //     height: 'auto',
    //     disableClose: true,
    //     data: {
    //       message: "SELECCIONE MONEDA",
    //     }
    //   });
    //   return; // Detenemos la ejecución de la función si la validación falla
    // }

    // if (this.codigo_cliente === undefined || this.codigo_cliente === '' || this.razon_social === undefined || this.razon_social === '') {
    //   this.dialog.open(VentanaValidacionesComponent, {
    //     width: 'auto',
    //     height: 'auto',
    //     disableClose: true,
    //     data: {
    //       message: "SELECCIONE CLIENTE EN PROFORMA",
    //     }
    //   });
    //   return;
    // }

    // Si todas las validaciones pasan, abrimos el MatrizItemsComponent
    this.dialog.open(MatrizItemsListaComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        //esta info tarifa ya esta en la matriz xd
        // tarifa: this.cod_precio_venta_modal_codigo,
        // descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        // desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        // descuento_nivel: this.desct_nivel_actual,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        // tamanio_carrito_compras: ultimo_valor?.nroitem,
      }
    });
  }

  verificarNit() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/transac/prgfacturarNR_cufd/getVerifComunicacionSIN/";
    return this.api.getAll('/venta/transac/veproforma/validarNITenSIN/' + this.userConn +"/"+ this.BD_storage+"/"+this.usuarioLogueado+"/"+this.agencia_logueado+"/"+this.nit_cliente+"/"+this.tipo_doc_cliente)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          if(datav.nit_es_valido === "VALIDO"){
            this.toastr.success(datav.nit_es_valido);
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          }else{
            this.toastr.error(datav.nit_es_valido);
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  setEmailDefault() {
    this.email_cliente = "facturasventas@pertec.com.bo";
  }


  guardarCorreo() {
    let ventana = "proforma"
    let detalle = "proforma-actualizoEmail";
    let tipo_transaccion = "transacc-proforma-PUT";

    // console.log(this.email_cliente);
    // console.log(this.codigo_cliente);

    let data = {
      codcliente: this.codigo_cliente,
      email: this.email_cliente
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: -/venta/transac/veproforma/actualizarCorreoCliente/ --Update";
    return this.api.update('/venta/transac/veproforma/actualizarCorreoCliente/' + this.userConn, data)
    .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // this.log_module.guardarLog(ventana, detalle, tipo_transaccion, "", "");
          // this.email_save = datav;
          // this.toastr.success('!CORREO GUARDADO!');
          // this.log_module.guardarLog(this.ventana, "Creacion" + detalle, "POST", this.id_tipo_view_get_codigo, this.id_proforma_numero_id);

          // this._snackBar.open('!CORREO GUARDADO!', 'Ok', {
          //   duration: 4000,
          //   panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          // });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! Ingrese un correo valido ! 📧');
        },
        complete: () => {
        }
      })
  }

  getAllmoneda() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.moneda_get_fuction = datav;
          // console.log(this.moneda_get_fuction);
          const encontrado = this.moneda_get_fuction.some((moneda) => moneda.codigo === 'BS');

          if (encontrado) {
            // console.log("HAY BS")
            this.moneda_get_catalogo = "BS";
            // console.log(encontrado, this.moneda_get_catalogo);
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { 
        }
      })
  }

  getMonedaTipoCambio(moneda) {
    let fechareg = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adtipocambio/getmonedaValor/";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getmonedaValor/' + this.userConn + "/" + this.moneda_base + "/" + moneda + "/" + fechareg)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.tipo_cambio_moneda_catalogo = datav;
          // console.log(this.tipo_cambio_moneda_catalogo);
          this.tipo_cambio_moneda_catalogo = this.tipo_cambio_moneda_catalogo.valor;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }


























  modalClientes(): void {
    this.dialog.open(ModalClienteComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        ventana: "ventana_catalogo"
      }
    });
  }

  modalClientesInfo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ModalClienteInfoComponent, {
      width: 'auto',
      height: '94vh',
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
      data: { codigo_cliente: this.codigo_cliente },
    });
  }

  modalCatalogoMoneda(): void {
    this.dialog.open(MonedaCatalogoComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
  }
  
  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
