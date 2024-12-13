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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { MatSelectChange } from '@angular/material/select';
import { MessageService } from 'primeng/api';
import { VentanaValidacionesComponent } from '../../ventana-validaciones/ventana-validaciones.component';
import { AnticiposProformaComponent } from '../../anticipos-proforma/anticipos-proforma.component';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { ItemDetalle } from '@services/modelos/objetos';

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
  public cliente_catalogo_real: any;
  public desct_nivel_actual = "ACTUAL";



  FormularioData: FormGroup;
  dataform: any = '';
 selectedProducts: ItemDetalle[] = [];



  // segundo Paso
  public tipopago: any;
  public contra_entrega = false;
  public estado_contra_entrega_input: any;
  public preparacion: any;
  public anticipo_button: boolean;
  public monto_anticipo: number = 0;
  public tabla_anticipos:any = [];
  public pago_contado_anticipado: boolean = false;


  //tercerPaso items precios, desct
  public cod_precio_venta_modal_codigo: number;
  public array_items_carrito_y_f4_catalogo:any=[];
  public tarifa_get_unico:any = [];
  public cod_descuento_modal: any = 0;
  public descuentos_get:any=[];
  public habilitar_desct_sgn_solicitud: boolean = false;




  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;



  
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
    private messageService: MessageService, private spinner: NgxSpinnerService, private log_module: LogService, 
    private saldoItemServices: SaldoItemMatrizService, private router:Router, private servicioEtiqueta: EtiquetaService,
    private _snackBar: MatSnackBar, private servicioTransfeProformaCotizacion: ServicioTransfeAProformaService,
    private servicio_recargo_proforma: RecargoToProformaService, public nombre_ventana_service: NombreVentanaService,
    private anticipo_servicio: AnticipoProformaService, private communicationService: ComunicacionproformaService) {

      this.FormularioData = this.createForm();
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
    this.getDescuentos();   

    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data_carrito => {
      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      } else {
        // this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito);
      }

      // Agregar el número de orden a los objetos de datos
      const startIndex = this.array_items_carrito_y_f4_catalogo.length - data_carrito.length;

      for (let i = startIndex; i < this.array_items_carrito_y_f4_catalogo.length; i++) {
        const element = this.array_items_carrito_y_f4_catalogo[i];
        element.orden = i + 1;
        if (element.empaque === null) {
          element.empaque = 0;
        }
      }
      return this.array_items_carrito_y_f4_catalogo;
    });
    //

    //Monedas
    this.serviciMoneda.disparadorDeMonedas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Moneda: ", data);
      this.moneda_get_catalogo = data.moneda.codigo;
      this.tipo_cambio_moneda_catalogo = data.tipo_cambio;
    });
    //

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      // this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
    });
    // fin_precio_venta

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo Descuento: ", data);
      this.cod_descuento_modal = data.descuento;

      this.total = 0.00;
      this.subtotal = 0.00;
      this.des_extra = 0.00;
    });
    // findescuentos
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
          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          this.hora_fecha_server = datav.horaServidor;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          this.getMonedaTipoCambio(this.moneda_get_catalogo);
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
          this.codigo_cliente_catalogo_real = this.cliente.cliente.codigo;
          this.nombre_comercial_cliente = this.cliente.cliente.nombre_comercial.trim();
          this.nombre_factura = this.cliente.cliente.nombre_fact;
          this.razon_social = this.cliente.cliente.razonsocial.trim();
          this.complemento_ci = this.cliente.cliente.complemento_ci
          this.nombre_comercial_razon_social = this.nombre_comercial_cliente;
          this.tipo_doc_cliente = this.cliente.cliente.tipo_docid;
          this.nit_cliente = this.cliente.cliente.nit_fact.toString();
          this.email_cliente = this.cliente.vivienda.email === "" ? "facturasventas@pertec.com.bo" : this.cliente.vivienda.email;
          this.cliente_casual = this.cliente.cliente.casual;
          this.cliente_habilitado_get = this.cliente.cliente.habilitado;
          this.nombre_cliente_catalogo_real = this.cliente.cliente.razonsocial.trim();

          this.cod_vendedor_cliente = this.cliente.cliente.codvendedor;
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario Inexiste! ⚠️' });

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

  getTarifa() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {

          this.tarifa_get_unico = datav;
          console.log("Precio Venta: ", this.tarifa_get_unico);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }


  verificarNit() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/transac/prgfacturarNR_cufd/getVerifComunicacionSIN/";
    return this.api.getAll('/venta/transac/veproforma/validarNITenSIN/' + this.userConn +"/"+ this.BD_storage+"/"+this.usuarioLogueado+"/"+this.agencia_logueado+"/"+this.nit_cliente+"/"+this.tipo_doc_cliente)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          if(datav.nit_es_valido === "VALIDO"){
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.nit_es_valido });
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: datav.nit_es_valido });
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



  email_save:any=[];
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
          this.email_save = datav;

          this.log_module.guardarLog(ventana, detalle, tipo_transaccion, "", "");
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! CORREO GUARDADO ! 📧' });
          this.log_module.guardarLog(this.ventana, "CREACION CORREO" + detalle, "POST", this.id_tipo, this.id_factura_numero_id);

          this._snackBar.open('!CORREO GUARDADO!', '📧', {
            duration: 4000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! Ingrese un correo valido ! 📧' });
        },
        complete: () => {
        }
      })
  }


  definirClienteReferencia(codcliente_real, casual) {
    console.log(codcliente_real, casual)
    if (casual) {
      const dialogRefcasual = this.dialog.open(DialogConfirmActualizarComponent, {
        width: 'auto',
        height: 'auto',
        data: { mensaje_dialog: "El código del Cliente: " + codcliente_real + " no es casual, por tanto no puede vincular con otro cliente, ¿Esta seguro de continuar?" },
        disableClose: true,
      });

      dialogRefcasual.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          // this.modalClientesparaReferencia();
        }
      });
    } else {
      // this.modalClientesparaReferencia();
    }
  }

  onInputChangeTIPOPAGO(event: MatSelectChange) {
    // 0 CONTADO
    // 1 CREDITO
    console.log("Checkbox value: ", event.value);

    if (event.value === 1) {
      // this.estado_contra_entrega_input = "";
      console.warn("Es Venta a Credito", this.contra_entrega, "EstadoContraEntrega", this.estado_contra_entrega_input);
    } else {
      console.warn("Es Venta a Contado", this.contra_entrega, "EstadoContraEntrega", this.estado_contra_entrega_input);
    }
  }

  onCheckboxChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    console.log("Checkbox value: ", isChecked, "EstadoContraEntrega:", this.estado_contra_entrega_input);

    if (isChecked === true) {
      this.estado_contra_entrega_input = 'POR CANCELAR';
    } else {
      this.estado_contra_entrega_input = 'vacio';
    }
  }


  enabledPagoFormaAnticipada(val, pago_contado_anticipado) {
    console.warn("valor:", pago_contado_anticipado);

    if (this.anticipo_button === val) {
      this.anticipo_button = false;
      this.monto_anticipo = 0;
      this.tabla_anticipos = [];
    } else {
      this.anticipo_button = true;
      console.log("La data se conserva")
    }
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      // console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  aplicarPrecioVenta(value) {
    //this.total_desct_precio = true;
    this.total = 0;
    this.subtotal = 0;

    const dialogRefTOTALIZAR = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA ?, ESTA ACCION PUEDE TOMAR UN TIEMPO" },
      disableClose: true,
    });

    dialogRefTOTALIZAR.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // console.log("LE DIO AL SI hay QUE MAPEAR EL DETALLE CON EL DESCT Y DESPUES HAY Q TOTALIZAR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          codtarifa:value
        }));
    
        //this.totabilizar();
      } else {
        // console.log("LE DIO AL NO, NO HAY Q TOTALIZAR, SOLO PINTAR EL NUEVO VALOR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          codtarifa:value
        }));
      }
      return this.array_items_carrito_y_f4_catalogo;
    });
  }
  
  aplicarDesctEspc(value) {
    this.total = 0.00;
    this.subtotal = 0.00;

    const dialogRefITEM = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ DESEA TOTALIZAR LOS ITEM DE LA PROFORMA ?, ESTA ACCION PUEDE TOMAR UN TIEMPO" },
      disableClose: true,
    });

    dialogRefITEM.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // console.log("LE DIO AL SI HAY Q TOTALIZAR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          coddescuento:value
        }));
        //this.totabilizar();
      } else {
        // console.log("LE DIO AL NO, NO HAY Q TOTALIZAR");
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((item) => ({
          ...item,
          coddescuento:value
        }));
      }
      return this.array_items_carrito_y_f4_catalogo;
    });
  }


  formatNumberTotalSubTOTALES(numberString: number | string): string {
    if (numberString === null || numberString === undefined || numberString === '') {
      return '0.00'; // Valor predeterminado
    }
    
    // Intentar convertir a número, considerando posibles entradas como cadenas
    const parsedNumber = parseFloat(numberString.toString().replace(',', '.'));
    
    if (isNaN(parsedNumber)){
      return '0.00'; // Manejar entradas no válidas
    }
  
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parsedNumber);
  }


  onInputChange(products: any, value: any) {
    console.log("🚀 ~ ProformaComponent ~ onInputChange ~ products:", products)
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.pedidoChangeMatrix(products, value);
    }, 2000); // 300 ms de retardo
  }



  pedidoChangeMatrix(element: any, newValue: number) {
    // console.log("🚀 ~ ProformaComponent ~ pedidoChangeMatrix ~ element:", element)
    this.total = 0.00;
    this.subtotal = 0.00;
    this.iva = 0.00;
    this.des_extra = 0.00;
    this.recargos = 0.00;

    element.cantidad = element.cantidad_pedida;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";
    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + element.coddescuento + "/" + element.cantidad_pedida +
      "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/false/" + this.moneda_get_catalogo + "/" + fecha)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // console.log("🚀 ~ ProformaComponent ~ .pipe ~ datav:", datav)
          //this.almacenes_saldos = datav;
          // console.log("Total al cambio de DE en el detalle: ", datav);
          // Actualizar la coddescuento en el element correspondiente en tu array de datos
          element.coddescuento = Number(datav.coddescuento);
          element.preciolista = Number(datav.preciolista);
          element.preciodesc = Number(datav.preciodesc);
          element.precioneto = Number(datav.precioneto);
          element.porcen_mercaderia = Number(datav.porcen_mercaderia);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  onInputChangeMatrix(products: any, value: any) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.empaqueChangeMatrix(products, value);
    }, 1500); // 300 ms de retardo
  }


  precio: any = true;
  desct: any = false;
  empaqueChangeMatrix(element: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    console.log(element);
    var d_tipo_precio_desct: string;

    if (this.precio === true) {
      d_tipo_precio_desct = "Precio";
    } else {
      d_tipo_precio_desct = "Descuento"
    }

    if (element.empaque === null) {
      element.empaque = 0;
    }

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCantItemsbyEmp/";
    this.api.getAll('/venta/transac/veproforma/getCantItemsbyEmp/' + this.userConn + "/" + d_tipo_precio_desct + "/" + this.cod_precio_venta_modal_codigo + "/" + element.coditem + "/" + element.empaque)
    .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
        console.log("🚀 ~ .empaqueChangeMatrix ~ datav:", datav)

          // Actualizar la cantidad en el elemento correspondiente en tu array de datos
          element.empaque = Number(newValue);
          element.cantidad = Number(datav.total);
          element.cantidad_pedida = Number(datav.total);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  itemDataAll(codigo) {
    // this.getSaldoEmpaquePesoAlmacenLocal(codigo);
    // this.getEmpaqueItem(codigo);
    // this.getSaldoItemSeleccionadoDetalle(codigo);
    // this.getAlmacenesSaldos();
    // this.getSaldoItem(codigo);
    // this.getPorcentajeVentaItem(codigo);

    // this.saldo_modal_total_1 = "";
    // this.saldo_modal_total_2 = "";
    // this.saldo_modal_total_3 = "";
    // this.saldo_modal_total_4 = "";
    // this.saldo_modal_total_5 = "";

    this.total = 0.00;
    this.subtotal = 0.00;
    this.iva = 0.00;
    this.des_extra = 0.00;
    this.recargos = 0.00;
  }

  onRowUnselect(event: any) {
    // console.log('Row Unselected:', event.data);
    this.updateSelectedProducts();
  }

  onRowSelect(event: any) {
    console.log('Row Selected:', event.data);
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    // console.log('Selected Products:', this.selectedProducts);

    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);
    }
  }

  eliminarItemTabla(orden, coditem) {
    // console.log(orden, coditem, this.array_items_carrito_y_f4_catalogo);

    // Filtrar el array para eliminar el elemento con el número de orden dado y el código de ítem
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return item.orden !== orden || item.coditem !== coditem;
    });

    // Agregar el número de orden a los objetos de datos
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
      element.nroitem = index + 1;
    });

    this.total = 0;
    this.subtotal = 0;
  }




  onInputChangecantidadChangeMatrix(products: any, value: any) {
    let valor_input = value;
    if(value === '' || value === undefined){
      valor_input=0;
      products.cantidad = 0;
    };

    console.log("Valor Entrada:"+ value, valor_input);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.cantidadChangeMatrix(products, valor_input);
    }, 1000); // 300 ms de retardo
  }

  cantidadChangeMatrix(elemento: any, newValue: number) {
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    // this.total_desct_precio = false;
    // this.total_X_PU = true;

    this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
      + this.usuarioLogueado + "/" + elemento.coditem + "/" + elemento.codtarifa + "/" + elemento.coddescuento + "/" + elemento.cantidad_pedida +
      "/" + elemento.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          //this.almacenes_saldos = datav;
          console.log("Total al cambio de DE en el detalle: ", datav);
          // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
          elemento.coddescuento = Number(datav.coddescuento);
          elemento.preciolista = Number(datav.preciolista);
          elemento.preciodesc = Number(datav.preciodesc);
          elemento.precioneto = Number(datav.precioneto);
          elemento.porcen_mercaderia = Number(datav.porcen_mercaderia);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  public total_X_PU: boolean = false;
  recalcularPedidoXPU(cantidad, precioneto) {
    console.log(cantidad, precioneto);
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(formattedNumber);
  }

  calcularTotalCantidadXPU(cantidad_pedida: number, cantidad: number, precioneto: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && precioneto !== undefined && cantidad !== undefined) {
      if (this.total_X_PU === true) {
        return this.formatNumberTotalSub(cantidad * precioneto);
      } else {
        // console.log(input);
        let cantidadPedida = cantidad_pedida;
        // Realizar cálculos solo si los valores no son undefined
        //console.log(cantidadPedida, preciolista);
        return this.formatNumberTotalSub(cantidad * precioneto);
      }
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  calcularTotalPedidoXPU(newValue: number, preciolista: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (newValue !== undefined && preciolista !== undefined) {
      // console.log(input);
      let pedido = newValue;
      // Realizar cálculos solo si los valores no son undefined
      //console.log(cantidadPedida, preciolista);
      return pedido * preciolista;
    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  // PRECIO VENTA DETALLE
  TPChangeMatrix(element: any, newValue: number) {
    // Actualizar la codtarifa en el elemento correspondiente en tu array de datos
    // Esto se ejecutará inmediatamente, pero se sobrescribirá cuando se reciba el nuevo valor del servicio
    element.codtarifa = Number(newValue);

    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
  }


  // Función que se llama cuando se hace clic en el input

  elementoSeleccionadoPrecioVenta: any;
  elementoSeleccionadoDescuento: any;

  inputClickedPrecioVenta(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    // console.log('Elemento seleccionado:', elemento);
    this.elementoSeleccionadoPrecioVenta = elemento;

    this.servicioPrecioVenta.disparadorDePrecioVentaDetalle.subscribe(data => {
      // console.log("Recibiendo Descuento: ", data);
      this.elementoSeleccionadoPrecioVenta.codtarifa = data.precio_venta.codigo;
    });
  }
  // FIN PRECIO VENTA DETALLE





  // DESCUENTO ESPECIAL DETALLE
  DEChangeMatrix(element: any, newValue: number) {
    // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
    element.coddescuento = Number(newValue);
    // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
    // console.log(this.dataSource.filteredData);
    // this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;

    this.total = 0;
    this.subtotal = 0;
    this.iva = 0
    this.des_extra = 0;
    this.recargos = 0;
  }

  getDescuentos() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedescuento/catalogo/";
    return this.api.getAll('/venta/mant/vedescuento/catalogo/' + this.userConn)
    .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          //this.cod_descuento_modal = 0;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveDescuentoEspecial(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  onLeaveDescuentoEspecialDetalle(event: any, element) {
    console.log("Item seleccionado: ", element);
    // YA NO SE USA

    let fecha = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getItemMatriz_Anadir/";

    //desde aca verifica que lo q se ingreso al input sea data que existe en el array de descuentos descuentos_get
    let entero = Number(this.elementoSeleccionadoDescuento.coddescuento);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);
    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = 0;
      // console.log("NO ENCONTRADO VALOR DE INPUT");
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + "0" + "/" + element.cantidad_pedida +
        "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            //this.almacenes_saldos = datav;
            console.log("Total al cambio de DE en el detalle: ", datav);
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
            element.preciolista = Number(datav.preciolista);
            element.preciodesc = Number(datav.preciodesc);
            element.precioneto = Number(datav.precioneto);
            // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
            // console.log(this.dataSource.filteredData);

            //this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
          },

          error: (err: any) => {
            console.log(err, errorMessage);
          },
          complete: () => { }
        });
    } else {
      event.target.value = entero;

      // console.log('Elemento seleccionado:', element);
      this.elementoSeleccionadoDescuento = element;

      this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
        // console.log("Recibiendo Precio de Venta: ", data);
        this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;

        this.total = 0;
        this.subtotal = 0;
        this.iva = 0
        this.des_extra = 0;
        this.recargos = 0;
      });

      //"api/venta/transac/veproforma/getItemMatriz_Anadir/DPD2_Loc_PE/PE/DPD2/35CH1H14/1/301/100/100/300800/0/311/FALSE/BS/2024-04-23"
      this.api.getAll('/venta/transac/veproforma/getItemMatriz_Anadir/' + this.userConn + "/" + this.BD_storage + "/"
        + this.usuarioLogueado + "/" + element.coditem + "/" + element.codtarifa + "/" + element.coddescuento + "/" + element.cantidad_pedida +
        "/" + element.cantidad + "/" + this.codigo_cliente + "/" + "0/" + this.agencia_logueado + "/FALSE/" + this.moneda_get_catalogo + "/" + fecha)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            //this.almacenes_saldos = datav;
            console.log("Total al cambio de DE en el detalle: ", datav);
            // Actualizar la coddescuento en el elemento correspondiente en tu array de datos
            element.preciolista = Number(datav.preciolista);
            element.preciodesc = Number(datav.preciodesc);
            element.precioneto = Number(datav.precioneto);
            // Luego de actualizar la cantidad, puedes acceder al array completo con las modificaciones
            // console.log(this.dataSource.filteredData);

            // this.array_items_carrito_y_f4_catalogo = this.dataSource.filteredData;
            //this.simularTab();
          },

          error: (err: any) => {
            console.log(err, errorMessage);
            //this.simularTab();
          },
          complete: () => {
            //this.simularTab();
          }
        });
    }
  }

  inputClickedDescuento(elemento: any) {
    // Aquí puedes hacer lo que necesites con el elemento
    // console.log('Elemento seleccionado:', elemento);
    this.elementoSeleccionadoDescuento = elemento;

    this.servicioDesctEspecial.disparadorDeDescuentosDetalle.subscribe(data => {
      // console.log("Recibiendo Precio de Venta: ", data);
      this.elementoSeleccionadoDescuento.coddescuento = data.descuento.codigo;
    });
  }
  //FIN DESCUENTO ESPECIAL DETALLE



























































  createForm(): FormGroup {
    // console.log(this.tipo_complementopf_input, this.input_complemento_view);
    let fecha_actual = this.fecha_actual;
    let hora = this.hora_fecha_server;
    // let hour = this.hora_actual.getHours();
    // Asegurarse de que el valor de la hora esté en formato de 24 horas
    // let hora_inicial = hour < 10 ? '0' + hour : hour; // Agrega un 0 inicial si la hora es menor a 10

    // let minuts = this.hora_actual.getMinutes();
    // let hora_actual_complete = hour + ":" + minuts;
    // let fecha_actual = new Date();
    let valor_cero: number = 0;

    // if(this.tipo_complementopf_input === 0) {
    //   this.dataform.tipo_complementopf === tipo_complementopf_val0;
    // }

    // if (this.input_complemento_view === null) {
    //   this.input_complemento_view = valor_cero;
    // }
    
    return this._formBuilder.group({
      fechareg: [fecha_actual],
      horareg: this.dataform.horareg,
      hora: this.dataform.hora,
      usuarioreg: this.usuarioLogueado,
      horaaut: this.dataform.horaaut,
      hora_inicial: this.dataform.hora_inicial,

      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      fecha: [this.fecha_actual],
      celular: this.dataform.celular,
      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      // descuentos: [this.des_extra],
      tipopago: [this.dataform.tipopago === 0 ? 0 : 1, Validators.required],
      transporte: [this.dataform.transporte, Validators.compose([Validators.required])],
      nombre_transporte: [this.dataform.nombre_transporte, Validators.compose([Validators.required])],
      tipo_docid: [this.dataform.tipo_docid, Validators.compose([Validators.required])],
      preparacion: [this.dataform.preparacion],
      tipoentrega: [this.dataform.tipoentrega === undefined ? "ENTREGAR" : this.dataform.tipoentrega, Validators.compose([Validators.required])],
      fletepor: [this.dataform.fletepor === "CLIENTE"],

      fecha_inicial: [this.fecha_actual],
      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],
      fechaaut: ["1900-01-01"],
      fecha_confirmada: ["1900-01-01"],
      hora_confirmada: ["00:00"],
      usuarioaut: [""],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],

      obs: this.dataform.obs === null ? " " : this.dataform.obs,
      obs2: [""],
      direccion: [this.dataform.direccion],
      // peso: Number(this.peso),
      codcliente_real: this.codigo_cliente,
      latitud_entrega: [this.dataform.latitud_entrega === undefined ? this.dataform.latitud : this.dataform.latitud],
      longitud_entrega: [this.dataform.longitud_entrega === undefined ? this.dataform.longitud : this.dataform.longitud],
      ubicacion: [this.dataform.ubicacion === null ? 'LOCAL' : this.dataform.ubicacion],
      email: [this.dataform.email, Validators.compose([Validators.required])],

      venta_cliente_oficina: this.dataform.venta_cliente_oficina === undefined ? false : true,
      tipo_venta: ["0"],

      contra_entrega: this.contra_entrega,
      estado_contra_entrega: [this.dataform.estado_contra_entrega === undefined ? "" : this.dataform.estado_contra_entrega],

      odc: "",
      desclinea_segun_solicitud: [this.dataform.desclinea_segun_solicitud === undefined ? 0 : this.dataform.desclinea_segun_solicitud], //Descuentos de Linea de Solicitud

      idanticipo: [""], //anticipo VentasL
      numeroidanticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [this.dataform.pago_contado_anticipado === null ? false : this.dataform.pago_contado_anticipado], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      //complementar input
      idpf_complemento: this.dataform.idpf_complemento === undefined ? " " : this.dataform.idpf_complemento, //aca es para complemento de proforma
      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? 0 : this.dataform.nroidpf_complemento,


      idsoldesctos: "0", // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [valor_cero], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024
      monto_anticipo: 0, //anticipo Ventas
      tipo_complementopf: [this.dataform.tipo_complementopf], //aca es para complemento de proforma

      // fechaaut_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // subtotal_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // moneda_total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario

      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento

      // no hay mas en esta seccion xD
      subtotal: [this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos], //TOTALES
      //des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.dataform.iva], //TOTALES
      total: [this.dataform.total], //TOTALES
      porceniva: [0],
    });
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

  modalAnticiposProforma(): void {
    if (this.tipopago === 1 || this.tipopago === undefined) {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "EL TIPO DE PAGO EN LA PROFORMA TIENE QUE SER CONTADO",
        }
      });
      return;
    }

    this.dialog.open(AnticiposProformaComponent, {
      width: 'auto',
      height: '510',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        nombre_cliente: this.razon_social,
        nit: this.nit_cliente,
        cod_moneda: this.moneda_get_catalogo,
        totalProf: this.total,
        tipoPago: this.tipopago,
        vendedor: this.cod_vendedor_cliente,
        id: this.id_tipo,
        numero_id: this.id_factura_numero_id,
        cod_cliente_real: this.cliente_catalogo_real,
        total: this.total,
        tdc: this.tipo_cambio_moneda_catalogo,
        array_tabla_anticipos: this.tabla_anticipos,
        nombre_ventana: this.nombre_ventana
      },
    });
  }

  modalMatrizLista(): void {
    // Realizamos todas las validaciones
    if (this.moneda_get_catalogo === '') {
      this.dialog.open(VentanaValidacionesComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          message: "SELECCIONE MONEDA",
        }
      });
      return; // Detenemos la ejecución de la función si la validación falla
    }

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
        tarifa: this.cod_precio_venta_modal_codigo,
        descuento: this.cod_descuento_modal,
        codcliente: this.codigo_cliente,
        codcliente_real: this.codigo_cliente_catalogo_real,
        codalmacen: this.agencia_logueado,
        // ACA ES IMPORTANTE PASARLO A STRING, PORQ LA BD ESPERA STRING NO BOOLEAN habilitar_desct_sgn_solicitud
        // ESTA VARIABLE ESTA EN EL TAB DESCUENTOS DE LINEA DE SOLICITUD
        desc_linea_seg_solicitud: this.habilitar_desct_sgn_solicitud === false ? "false" : "true",
        codmoneda: this.moneda_get_catalogo,
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: this.array_items_carrito_y_f4_catalogo,
        descuento_nivel: this.desct_nivel_actual,
        tamanio_carrito_compras: 0,
      }
    });
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: false }
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      data: { detalle: false }
    });
  }
  
  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  atrasMenu(){
    const dialogRefLimpiara = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "¿ ESTA SEGUR@ DE SALIR AL MENU PRINCIPAL ?" },
      disableClose: true,
    });

    dialogRefLimpiara.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.router.navigateByUrl('');
      }
    });
  }
}
