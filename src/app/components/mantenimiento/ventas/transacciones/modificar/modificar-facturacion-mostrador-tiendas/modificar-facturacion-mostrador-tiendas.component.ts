import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ItemDetalle } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ModalSubTotalMostradorTiendasComponent } from '../../facturacion-mostrador-tiendas/modalSubTotalMostradorTiendas/modalSubTotalMostradorTiendas.component';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { FacturaTemplateComponent } from '../../facturas/factura-template/factura-template.component';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';

import pdfFonts from "../../../../../../../assets/vfs_fonts.js";
import { fonts } from '../../../../../../config/pdfFonts';

import * as QRCode from 'qrcode';
import pdfMake from "pdfmake/build/pdfmake";
import { ModalDetalleObserValidacionComponent } from '@components/mantenimiento/ventas/modal-detalle-obser-validacion/modal-detalle-obser-validacion.component';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { BuscadorAvanzadoFacturasComponent } from '@components/uso-general/buscador-avanzado-facturas/buscador-avanzado-facturas.component';
import { BuscadorAvanzadoService } from '@components/uso-general/servicio-buscador-general/buscador-avanzado.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { Router } from '@angular/router';
import { TiposAnulacionFelComponent } from './tipos-anulacion-fel/tipos-anulacion-fel.component';
import { ServicioCierreService } from './servicio-cierre-ventana/servicio-cierre.service';
import { MatTabGroup } from '@angular/material/tabs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modificar-facturacion-mostrador-tiendas',
  templateUrl: './modificar-facturacion-mostrador-tiendas.component.html',
  styleUrls: ['./modificar-facturacion-mostrador-tiendas.component.scss']
})
export class ModificarFacturacionMostradorTiendasComponent implements OnInit {

  public nombre_ventana: string = "docmodifvefactura_nsf.vb";
  public ventana: string = "Modificar Factura Mostrador FEL";
  public detalle = "Mod.Factura Mostrador FEL";
  public tipo = "transaccion-docveproforma-POST";

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "input_search":
          this.transferirFactura();
          break;
      }
    }
  };

  //data inicial
  codigo_ultima_factura: number;
  btn_anular_sin: boolean = false;
  btn_generar_xml_firma_enviar: boolean = false;
  // fin data inicial

  // primera barra de arriba CUFD
  CUFD: any;
  nrocaja: any;
  cod_control: string;
  codigo_control_get: any;
  codtipo_comprobante_get: any;
  dtpfecha_limite_get: any;
  nrolugar: any;
  tipo_get: any;

  //primeraColumna
  hora_fecha_server: any = [];
  almacen_get: any = [];
  almacn_parame_usuario: any = [];
  id_facturas: any = [];
  usuario_creado_save: any = [];
  codigo_secreto_vendedor: number;
  codigo_vendedor: any;
  id_factura: any;
  cta_ingreso: any;
  forma_pago: any;
  forma_pago_descripcion: any;
  documento_nro: any;
  nroticket: string;
  tipopago: number;
  CUF: number;
  codigo_recepcion_siat: any;

  //segundaColumna
  en_linea: boolean;
  en_linea_SIN: boolean;
  estado_contra_entrega: string;

  //cuartaColumna
  public email_save: any = [];
  public valor_nit: any;
  public codigo_cliente: string;
  public documento_identidad: any = [];
  public fletepor: any;
  public transporte: any;
  public direccion: any;
  public tipo_cambio_moneda_catalogo: any;
  public codigo_estado_siat: number;
  numero_factura: any;

  // formulario
  FormularioData: FormGroup;
  dataform: any = '';
  verDetalle: boolean;
  array_items_carrito_y_f4_catalogo: any = [];
  products!: ItemDetalle[];
  selectedProducts: ItemDetalle[] = [];
  // fin formulario

  public moneda_get_catalogo: any;
  public contra_entrega = false;
  public almacn_parame_usuario_almacen: any;
  public fecha_actual: any;
  public moneda_base: any = "BS";

  //Datos Cliente
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
  public tipo_cliente: string = "";
  public parsed: string;
  public longitud_cliente: string;
  public latitud_cliente: string;
  public complemento_ci: string
  public cod_vendedor_cliente: string;
  public codigo_cliente_catalogo_real: string;
  public cod_id_tipo_modal: any = [];
  public venta_cliente_oficina: boolean = false;
  public cliente_habilitado_get: any;
  public condicicion_cliente: any = "";
  public horareg: any;
  public pinta_empaque_minimo: boolean;
  public codigo: any;

  //formas pago
  public codtipopagodescripcion: any;

  //array de LOG/OBSERVACION
  array_observacions_logs: any = [];

  // antcipos
  id_anticipo: any;
  numero_anticipo: any;
  monto_anticipo: any;

  // Solicitud Anulacion
  public nombre_solicitud_anulacion: any;
  public ci_solicitud_anulacion: any;

  // Datos TOTALES de footer
  public subtotal: number = 0.00;
  public recargos: number = 0;
  public des_extra: number = 0;
  public iva: number = 0;
  public total: number = 0.00;
  public peso: number = 0.00;
  public total_X_PU: boolean = false;

  public tablaIva: any = [];
  public array_de_descuentos_ya_agregados: any = [];

  public nuevo_CUFD: any;

  // saldos empaques
  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;
  public id_tipo: any = [];
  public almacenes_saldos: any = [];
  public saldoItem: number;

  // LOGS
  array_de_logs: any = [];

  //saber si es tienda o agencia
  esTienda_bool: boolean;

  // TAB OBSERVACIONES
  eventosLogs: any = [];
  selectedEvento: { label: string } | null = null; // Modelo para el elemento seleccionado

  //buscador avanzado
  num_idd: any;
  num_id: any;
  private unsubscribe$ = new Subject<void>();

  // parametros del constructor
  userConn: any;
  BD_storage: any;
  usuarioLogueado: any;
  agencia_logueado: any;

  fecha_anulacion_input: any;
  anulada: boolean = false;
  boolean_cierre_ventana: boolean;
  fechaMinima: string;

  private numberFormatter_5decimales: Intl.NumberFormat;
  private numberFormatter_2decimales: Intl.NumberFormat;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(private api: ApiService, private dialog: MatDialog, private _formBuilder: FormBuilder, private messageService: MessageService,
    private datePipe: DatePipe, private spinner: NgxSpinnerService, private log_module: LogService, private _snackBar: MatSnackBar,
    public servicioBuscadorAvanzado: BuscadorAvanzadoService, public nombre_ventana_service: NombreVentanaService,
    public servicio_cierre_ventana: ServicioCierreService, private router: Router) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.FormularioData = this.createForm();

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_5decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    });

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    this.mandarNombre();
    this.getParamUsuario();
    this.getDataInicial();
    this.getTipoDocumentoIdentidadProforma();

    //ventana modal BuscadorGeneral
    this.servicioBuscadorAvanzado.disparadorDeID_NumeroIDModificarFacturaMostradorTiendas.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      // console.log("Recibiendo ID y numeroID Buscador: ", data);
      this.getDataUltimaFactura(data.codigo);
    });
    //fin ventana modal BuscadorGeneral

    this.servicio_cierre_ventana.disparadorDeBooleanCierreModalAnulacion.pipe(takeUntil(this.unsubscribe$)).subscribe(async data => {
      // console.log("Recibiendo Saldo Total: ", data);
      this.boolean_cierre_ventana = data.cierre_ventana;
      if (this.boolean_cierre_ventana) {
        this.num_idd = this.id_factura;
        this.num_id = this.documento_nro;

        await this.transferirFactura();
        // this.abrirTabPorLabel("Observaciones SIN");
        // await this.verificarFacturaEnSIN();
      }
    });
  }

  onPaste(event: any) {
    event.preventDefault();
    // También puedes mostrar un mensaje al usuario indicando que el pegado está bloqueado
    alert("EVENTO BLOQUEADO, NO PEGAR");
  }

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    // console.log(tabs);
    const index = tabs.findIndex(tab => tab.textLabel === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  getParamUsuario() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/docvefacturamos_cufd/getParametrosIniciales/";
    return this.api.getAll('/venta/transac/docvefacturamos_cufd/getParametrosIniciales/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log('Parametros Iniciales Usuario: ', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDataInicial() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifvefactura_nsf/getDataInicial/";
    return this.api.getAll('/venta/modif/docmodifvefactura_nsf/getDataInicial/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.agencia_logueado)
      .subscribe({
        next: (datav) => {
          console.log('Parametros Iniciales: ', datav);
          this.codigo_ultima_factura = datav.codUltimaFact;
          this.btn_anular_sin = datav.btnanular_en_el_sin;
          this.btn_generar_xml_firma_enviar = datav.btn_generar_xml_firmar_enviar;

          this.esTienda_bool = datav.esTienda;

          this.getDataUltimaFactura(datav.codUltimaFact);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTipoDocumentoIdentidadProforma() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTipoDocIdent/";
    return this.api.getAll('/venta/transac/veproforma/getTipoDocIdent/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.documento_identidad = datav;
          // console.log(this.documento_identidad);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getParametrosIniciales() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/principal/getParamIniciales/";
    return this.api.getAll('/principal/getParamIniciales/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.agencia_logueado = datav.codAlmacenUsr;
          this.BD_storage = datav.codempresa;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDataUltimaFactura(codigo_ultima_factura) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifvefactura_nsf/mostrarDatosFact/";
    return this.api.getAll('/venta/modif/docmodifvefactura_nsf/mostrarDatosFact/' + this.userConn + "/" + codigo_ultima_factura + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          console.log('Datos Ultima Factura: ', datav);

          this.almacn_parame_usuario_almacen = datav.cabecera.codalmacen;
          this.nrocaja = datav.cabecera.nrocaja;
          this.CUFD = datav.cabecera.cufd;
          this.dtpfecha_limite_get = datav.cabecera.fechalimite;
          this.nrolugar = datav.cabecera.nrolugar;
          this.numero_factura = datav.cabecera.nrofactura;
          this.id_factura = datav.cabecera.id;
          this.anulada = datav.cabecera.anulada;

          this.documento_nro = datav.cabecera.numeroid;
          this.codigo = datav.cabecera.codigo;

          this.codigo_control_get = datav.cabecera.codigocontrol;
          this.fecha_actual = this.datePipe.transform(datav.cabecera.fechareg, "yyyy-MM-dd");
          this.horareg = datav.cabecera.horareg;
          this.codigo_vendedor = datav.cabecera.codvendedor;
          this.cta_ingreso = datav.cabecera.idcuenta;
          this.tipopago = datav.cabecera.tipopago;
          this.CUF = datav.cabecera.cuf;
          this.codigo_recepcion_siat = datav.cabecera.cod_recepcion_siat;
          this.tipo_doc_cliente = datav.cabecera.tipo_docid;

          this.en_linea = datav.cabecera.en_linea;
          this.en_linea_SIN = datav.cabecera.en_linea_SIN;
          this.estado_contra_entrega = datav.cabecera.estado_contra_entrega;

          this.codigo_cliente = datav.cabecera.codcliente;
          this.moneda_get_catalogo = datav.cabecera.codmoneda;
          this.complemento_ci = datav.cabecera.complemento_ci;
          this.direccion = datav.cabecera.direccion;
          this.email_cliente = datav.cabecera.email === "" ? "facturasventas@pertec.com.bo" : datav.cabecera.email;
          this.fletepor = datav.cabecera.fletepor;
          this.nit_cliente = datav.cabecera.nit;
          this.nombre_cliente = datav.cabecera.nomcliente;
          this.razon_social = datav.cabecera.nomcliente;
          this.tipo_cambio_moneda_catalogo = datav.cabecera.tdc;
          this.tipopago = datav.cabecera.tipopago;
          this.transporte = datav.cabecera.transporte;

          this.codigo_estado_siat = datav.cabecera.cod_estado_siat

          this.verDetalle = datav.verDetalle;
          this.array_de_descuentos_ya_agregados = datav.descuentos;
          this.array_items_carrito_y_f4_catalogo = datav.detalle;


          //mat-tab inferior
          this.transporte = datav.cabecera.transporte;
          this.peso = datav.cabecera.peso;
          this.fletepor = datav.cabecera.fletepor;
          this.direccion = datav.cabecera.direccion;
          this.tipo_cambio_moneda_catalogo = datav.cabecera.tdc;


          this.subtotal = datav.cabecera.subtotal;
          this.recargos = datav.cabecera.recargos;
          this.des_extra = datav.cabecera.descuentos;
          this.iva = datav.cabecera.iva;
          this.total = datav.cabecera.total;

          //Forma Pago
          this.codtipopagodescripcion = datav.codtipopagodescripcion;

          // anticipos
          this.id_anticipo = datav.cabecera.idanticipo;
          this.numero_anticipo = datav.cabecera.numeroidanticipo;
          this.monto_anticipo = datav.cabecera.monto_anticipo;

          // fecha anulacion
          this.fecha_anulacion_input = this.datePipe.transform(datav.cabecera.fecha_anulacion, 'yyyy-MM-dd');
          // this.fechaMinima = this.fecha_anulacion_input.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onRowSelect(event: any) {
    console.log('Row Selected:', event.data);
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    console.log('Selected Products:', this.selectedProducts);

    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);
    }
  }

  itemDataAll(codigo) {
    this.getAlmacenesSaldos();
    this.getSaldoItem(codigo);

    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";
  }

  getAlmacenesSaldos() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/getCodAlmSlds/";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          console.log("Almacenes: ", this.almacenes_saldos);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getSaldoItem(item) {
    let agencia_concat = "AG" + this.agencia_logueado;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getsaldosCompleto/";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', datav, "+++ MENSAJE SALDO VPN: " + this.id_tipo[0].resp);
          // this.letraSaldos = this.id_tipo[0].resp;
          // this.saldo_variable = this.id_tipo[2];

          // LETRA
          this.id_tipo[1].forEach(element => {
            if (element.descripcion === 'Total Saldo') {
              if (element.valor < 0) {
                this.saldoItem = 0;
              } else {
                this.saldoItem = element.valor;
              }

              console.log(this.saldoItem);
            }
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  onRowUnselect(event: any) {
    console.log('Row Unselected:', event.data);
    this.updateSelectedProducts();
  }

  calcularTotalCantidadXPU(cantidad_pedida: number, precioneto: number) {
    // todo despues del if ya que si no siempre esta escuchando los eventos
    if (cantidad_pedida !== undefined && precioneto !== undefined) {
      if (this.total_X_PU === true) {
        console.log("🚀 ~ FacturacionMostradorTiendasComponent ~ calcularTotalCantidadXPU ~ cantidad_pedida * precioneto:", cantidad_pedida * precioneto)
        return this.formatNumberTotalSub(cantidad_pedida * precioneto);
      } else {
        //let cantidadPedida = cantidad_pedida;
        // Realizar cálculos solo si los valores no son undefined
        return this.formatNumberTotalSub(cantidad_pedida * precioneto);
      }

    } else {
      return 0; // O algún otro valor predeterminado
    }
  }

  empaquesMinimosPrecioValidacion() {
    let mesagge: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/empaquesMinimosVerifica/";
    return this.api.create('/venta/transac/veproforma/empaquesMinimosVerifica/' + this.userConn + "/" + this.codigo_cliente + "/" + this.agencia_logueado, this.array_items_carrito_y_f4_catalogo)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          if (datav.cumple === true) {
            mesagge = "CUMPLE";
          } else {
            mesagge = "NO CUMPLE";
            this.pinta_empaque_minimo = true;
          }

          this.modalDetalleObservaciones(datav.reg, mesagge);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'EMPAQUES MINIMO PROCESANDO ⚙️' });

          this.array_items_carrito_y_f4_catalogo = datav.tabladetalle;

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      });
  }

  transferirFactura() {
    console.log(this.num_idd, this.num_id);

    this.spinner.show()
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifvefactura_nsf/getCodigoFact/";

    return this.api.getAll('/venta/modif/docmodifvefactura_nsf/getCodigoFact/' + this.userConn + "/" + this.id_factura + "/" + this.num_id)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ transferirFactura ~ datav:", datav)

          this.getDataUltimaFactura(datav.codigoFact.codigo);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! TRANSFERENCIA EXITOSA !' });

          this.nuevo_CUFD = "";
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      })
  }






  createForm(): FormGroup {
    let fecha_actual = this.fecha_actual;

    return this._formBuilder.group({
      //data de la primera fila
      nrocaja: [this.dataform.nrocaja, Validators.compose([Validators.required])],
      CUFD: this.dataform.CUFD,
      CUF: this.dataform.CUF,
      nroautorizacion: this.dataform.cufd,
      codigo_control: this.dataform.codigo_control_get,
      dtpfecha_limite: this.dataform.dtpfecha_limite_get,
      nrolugar: this.dataform.nrolugar,
      codigo_recepcion_siat: this.dataform.codigo_recepcion_siat,
      numero_factura: this.dataform.numero_factura,

      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: this.dataform.numeroid,
      fechareg: [fecha_actual],
      horareg: this.dataform.horareg,
      hora: this.dataform.hora,
      usuarioreg: this.usuarioLogueado,
      horaaut: this.dataform.horaaut,
      hora_inicial: this.dataform.hora_inicial,

      nroticket: this.dataform.nroticket,

      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      fecha: [this.fecha_actual],
      fecha_inicial: [this.dataform.fecha_inicial],
      celular: this.dataform.celular,
      email: [this.dataform.email, Validators.compose([Validators.required])],

      //precio venta columna segunda primera fila verificar conq nombre se guarda
      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      descuentos: this.dataform.descuentos,
      tipopago: [this.dataform.tipopago === 1 ? 1 : 0, Validators.required],
      transporte: [this.dataform.transporte === "" ? "" : this.dataform.transporte, Validators.compose([Validators.required])],
      nombre_transporte: "",
      tipo_docid: [this.dataform.tipo_docid, Validators.compose([Validators.required])],
      preparacion: [""],
      tipoentrega: [""],
      fletepor: [this.dataform.fletepor == "" ? "" : this.dataform.fletepor, Validators.compose([Validators.required])],

      obs: [""],
      obs2: [""],
      odc: [""],
      ubicacion: [""],
      direccion: [this.dataform.direccion],
      peso: Number(this.peso),
      latitud_entrega: "",
      longitud_entrega: "",

      codbanco: "",
      idcuenta: this.cta_ingreso,
      idfc: this.dataform.idfc === undefined ? "" : this.dataform.idfc,
      nroidfc: this.dataform.numeroidfc === undefined ? "" : this.dataform.numeroidfc,
      fechalimite: this.dataform.fecha_limite,

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
      desclinea_segun_solicitud: false, //Descuentos de Linea de Solicitud
      vta_cliente_en_oficina: false,
      tipo_venta: ["0"],

      contra_entrega: this.contra_entrega,
      estado_contra_entrega: [""],

      pago_contado_anticipado: [this.dataform.pago_contado_anticipado === null ? false : this.dataform.pago_contado_anticipado], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      //complementar input
      idFC_complementaria: this.dataform.idfc === undefined ? " " : this.dataform.idfc, //aca es para complemento de proforma
      nroidFC_complementaria: this.dataform.numeroidfc === undefined ? 0 : this.dataform.numeroidfc,

      idsoldesctos: "0", // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [0], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024
      tipo_complementopf: [this.dataform.tipo_complementopf], //aca es para complemento de proforma

      // fechaaut_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // subtotal_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // moneda_total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario

      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento

      // no hay mas en esta seccion xD
      subtotal: [this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos], //TOTALES
      des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.dataform.iva], //TOTALES
      total: [this.dataform.total], //TOTALES
      porceniva: [0],

      // nueva data
      codigo_secreto_vendedor: this.dataform.codigo_secreto_vendedor,
      forma_pago: this.dataform.forma_pago,
      cta_ingreso: this.dataform.cta_ingreso,
      documento_nro: this.dataform.documento_nro,

      //anticipos
      idanticipo: this.dataform.idanticipo === undefined ? "" : this.dataform.idanticipo,
      numeroidanticipo: this.dataform.numeroidanticipo === undefined ? "" : this.dataform.numeroidanticipo,
      monto_anticipo: this.dataform.monto_anticipo === undefined ? "" : this.dataform.monto_anticipo,


      en_linea: { value: this.dataform.en_linea, disabled: true },
      en_linea_SIN: { value: this.dataform.en_linea_SIN, disabled: true },
    });
  }

  setEmailDefault() {
    this.email_cliente = "facturasventas@pertec.com.bo";
  }

  guardarCorreo() {
    console.log(this.email_cliente);
    console.log(this.codigo_cliente);

    let data = {
      codcliente: this.codigo_cliente,
      email: this.email_cliente
    };

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: -/venta/transac/veproforma/actualizarCorreoCliente/ --Update";
    return this.api.update('/venta/transac/veproforma/actualizarCorreoCliente/' + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.email_save = datav;
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! CORREO GUARDADO 📧 ! ' });

          this._snackBar.open('!CORREO GUARDADO!', '📧', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  formatNumberTotalSubTOTALES(numberString: number | string): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_5decimales.format(formattedNumber);
  }

  verificarNit() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/transac/prgfacturarNR_cufd/getVerifComunicacionSIN/";
    return this.api.getAll('/venta/transac/veproforma/validarNITenSIN/' + this.userConn + "/" + this.BD_storage + "/" + this.usuarioLogueado + "/" + this.agencia_logueado + "/" + this.nit_cliente + "/" + this.tipo_doc_cliente)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          if (datav.nit_es_valido === "VALIDO") {
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.nit_es_valido });
            this.dialog.open(DialogConfirmacionComponent, {
              width: '450px',
              height: 'auto',
              data: { mensaje_dialog: datav.nit_es_valido },
              disableClose: true,
            });
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: datav.nit_es_valido });
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
        complete: () => { }
      })
  }

  // SECCION EMAIL
  getDataFacturaArmarYenviarEmail() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDataFactura/";
    this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataFactura/' + this.userConn + "/" + this.documento_nro + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ FacturaNotaRemisionComponent ~ getDataFacturaParaArmar ~ datav:", datav)
          if (datav) {
            // ACA SE GENERA EL PDF CON SU ARCHIVO BLOB PARA QUE SE ENVIE POR CORREO ELECTRONICO
            this.generarPDF(datav);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO PASO LA DATA O NO LLEGO' });
          }
        },

        error: (err: any) => {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO SE PUDO TRAER INFORMACION DE LA FACTURA 😧 ' });
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  async getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  // Función para generar el código QR en base64
  async generateQRCodeBase64(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(data, { errorCorrectionLevel: 'M', scale: 5, width: 85 }, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);  // 'url' contiene la imagen en base64
        }
      });
    });
  }

  insertarSaltosDeLinea(texto: string, limite: number = 21): string {
    let resultado = '';
    for (let i = 0; i < texto.length; i += limite) {
      resultado += texto.substring(i, i + limite);
    }
    // console.log(resultado);
    return resultado.trim(); // Quita el salto de línea final si no lo deseas
  }

  cortarStringSiEsLargo(texto: string): string {
    if (texto.length >= 27) {
      return texto.slice(0, 27);  // Corta a los primeros 28 caracteres
    }
    return texto;  // Retorna el texto original si tiene menos de 28 caracteres
  }

  async generarPDF(data_pdf) {
    console.log("🚀 ~ FacturaNotaRemisionComponent ~ descargarPDF ~ data:", data_pdf, data_pdf.cabecera);

    // Agregar el número de orden a los objetos de datos
    data_pdf?.detalle.forEach((element, index) => {
      element.nroitem = index + 1;
      element.orden = index + 1;
    });

    try {
      const imageUrl = 'assets/img/logo.png'; // Ruta de tu imagen
      const base64Image = await this.getBase64ImageFromURL(imageUrl);
      // Asegúrate de que el QR ya está generado en qrCodeImage
      const base64QR = await this.generateQRCodeBase64(data_pdf.cadena_QR);

      const id = data_pdf?.cabecera.id;
      const numeroid = data_pdf?.cabecera.numeroid;

      const docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [12, 128, 140, 24],
        info: { title: "FACTURA - PERTEC - PRUEBAS" },
        header: {
          columns: [
            // Columna 1 (Imagen)
            {
              stack: [
                { image: base64Image, width: 76, height: 76, margin: [13, 12, 9, 5] },
                { text: "Lugar y Fecha:", alignment: 'left', fontSize: 8, margin: [10, 2, 10, 0], bold: true, font: 'Tahoma' },
                { text: "Nom/Razon Social: ", alignment: 'left', fontSize: 8, margin: [10, 0, 0, 0], bold: true, font: 'Tahoma' },
              ],
              margin: [12, 5, 0, 0], // Margen ajustado
              width: 'auto', // Auto ajuste de tamaño
            },
            // Columna 2 (Texto)
            {
              stack: [
                { text: "PERTEC S.R.L", alignment: 'center', fontSize: 9, bold: true, font: 'BookMan', margin: [0, 0, 4, 0] },
                { text: "CASA MATRIZ", alignment: 'center', fontSize: 6, bold: true, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: "Gral. Achá N° 330", alignment: 'center', fontSize: 6, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: "Tels: 4259660 - 4250800 - Fax: " + data_pdf.paramEmp.fax, alignment: 'center', fontSize: 6, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: "Cochabamba - Bolivia", alignment: 'center', fontSize: 6, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: data_pdf.paramEmp.sucursal, alignment: 'center', fontSize: 6, bold: true, font: 'Arial', margin: [0, 2, 2, 0] },
                { text: data_pdf.paramEmp.codptovta, alignment: 'center', fontSize: 6, bold: true, font: 'Arial' },
                { text: data_pdf.paramEmp.direccion, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: data_pdf.paramEmp.telefono, alignment: 'center', fontSize: 6, font: 'Arial' },
                { text: data_pdf.paramEmp.lugarEmision, alignment: 'center', fontSize: 6, margin: [0, 0, 0, 8], font: 'Arial' },

                { text: " " + data_pdf.paramEmp.lugarFechaHora, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                { text: " " + data_pdf.cabecera.nomcliente, alignment: 'left', fontSize: 8, colSpan: 6, font: 'Tahoma' },
              ],
              margin: [0, 12, 12, 15], // Margen ajustado
              width: 'auto', // Auto ajuste de tamaño
            },
            // Columna 3 (Texto)
            {
              stack: [{
                text: "FACTURA",
                alignment: 'center',
                margin: [2, 40, 5, 0], // Ajuste de margen superior
                fontSize: 11,
                font: 'BookMan',
                bold: true
              },
              {
                text: "CON DERECHO A CREDITO FISCAL",
                alignment: 'center',
                margin: [0, 0, 0, 0],
                fontSize: 8,
                font: 'BookMan',
                bold: true
              },
              ]
            },
            // Columna 4 (Texto)
            {
              stack: [
                {
                  text: [{ text: 'NIT: ', bold: true, alignment: 'right', fontSize: 7, font: 'Tahoma' },  // 'NIT:' en negrita
                  { text: '1023109029', bold: true, alignment: 'left', font: 'Tahoma' }  // Número sin negrita
                  ], fontSize: 7, margin: [0, 12, 52, 0]
                },

                {
                  text: [{ text: "Factura Nro: ", bold: true, alignment: 'right', fontSize: 7, font: 'Tahoma' },
                  { text: "00000" + data_pdf.cabecera.nrofactura, bold: true, alignment: 'left', font: 'Tahoma' }], fontSize: 7,
                  margin: [0, 0, 63, 0]
                },

                {
                  table: {
                    widths: [65, 70], // Ajusta las columnas
                    body: [
                      [
                        {
                          text: "Cód. Autorización:",
                          bold: true,
                          alignment: 'right',
                          fontSize: 7,
                          font: 'Tahoma',
                          margin: [0, 0, 0, 0]
                        },
                        {
                          text: this.insertarSaltosDeLinea(data_pdf.cabecera.cuf),
                          bold: true,
                          alignment: 'left',
                          characterSpacing: 0,
                          fontSize: 7,
                          font: 'Tahoma',
                          margin: [0, 0, 0, 25]
                        }
                      ]
                    ]
                  },
                  layout: 'noBorders', // Elimina los bordes si no los necesitas

                },

                {
                  text: [{ text: "Nit/Ci/Cex: ", bold: true, alignment: 'right' },
                  { text: data_pdf.cabecera.nit + this.complemento_ci, bold: false }], fontSize: 8, font: 'Tahoma',
                  margin: [0, 0, 56, 0]
                },
                {
                  text: [{ text: "Código Cliente: ", bold: true, alignment: 'right', font: 'Tahoma' },
                  { text: data_pdf.cabecera.nit, bold: false, font: 'Tahoma' }], fontSize: 8, margin: [0, 0, 48, 0]
                },
              ],
              margin: [10, 10, 10, 0], // Margen ajustado
            },
          ],
          margin: [0, 4, 2, 0], // Margen del header
        },

        content: [
          // Línea encima de la cabecera
          {
            canvas: [{
              type: 'line', x1: 12, y1: 0, x2: 575, y2: 0, lineWidth: 1
            }],
            margin: [0, 0, 0, 0], // Espacio entre la línea superior y la tabla
          },

          // Tabla con cabecera y contenido
          {
            table: {
              headerRows: 1,
              widths: [18, 56, 140, 56, 48, 48, 48, 58, 64],

              body: [
                [
                  { text: '#', style: 'tableHeader', alignment: 'left', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  { text: 'CODIGO PRODUCTO', style: 'tableHeader', alignment: 'center', fontSize: 8, bold: true, font: 'Tahoma' },
                  { text: 'DESCRIPCION', colSpan: 2, style: 'tableHeader', alignment: 'center', fontSize: 8, noWrap: false, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  {}, // Columna vacía para ajustar con el colSpan
                  { text: 'UNIDAD DE MEDIDA', style: 'tableHeader', alignment: 'center', fontSize: 8, bold: true, font: 'Tahoma' },
                  { text: 'CANTIDAD', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  { text: 'PRECIO UNITARIO', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, font: 'Tahoma' },
                  { text: 'DESCUENTO', style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                  { text: 'SUBTOTAL' + "(" + data_pdf.cabecera.codmoneda + ")", style: 'tableHeader', alignment: 'right', fontSize: 8, bold: true, margin: [0, 8, 0, 0], font: 'Tahoma' },
                ],

                ...data_pdf.detalle.map(items => [
                  { text: items.nroitem, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                  { text: items.coditem, alignment: 'center', fontSize: 8, font: 'Tahoma' },
                  { text: this.cortarStringSiEsLargo(items.descripcion), alignment: 'left', fontSize: 8, font: 'Tahoma' },
                  { text: items.medida, alignment: 'left', fontSize: 8, font: 'Tahoma' },
                  { text: items.udm, alignment: 'center', fontSize: 8, font: 'Tahoma' },
                  { text: this.formatNumberTotalSubTOTALES(items.cantidad), alignment: 'right', fontSize: 8, font: 'Tahoma' },
                  { text: items.precioneto, alignment: 'right', fontSize: 8, font: 'Tahoma' },
                  { text: items.preciodesc, alignment: 'right', fontSize: 8, font: 'Tahoma' },
                  { text: this.formatNumberTotalSub(items.total), alignment: 'right', fontSize: 8, font: 'Tahoma' }
                ]),

                [{ text: '___________________________________________________________________________________', colSpan: 9, margin: [0, 0, 0, 0] }, {}, {}, {}, {}, {}, {}, {}, {}],

                [{ text: data_pdf.imp_totalliteral, characterSpacing: 0, margin: [10, 0, 0, 0], bold: true, fontSize: 8, colSpan: 6, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Sub Total' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: this.subtotal, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '________________________________________________________', margin: [0, 0, 0, 0], colSpan: 6, },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Descuentos' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 2, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: data_pdf.cabecera.descuentos, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '', characterSpacing: 0, margin: [10, 0, 0, 0], bold: true, colSpan: 6 },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                {
                  text: 'Total' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0],
                  colSpan: 2, font: 'Tahoma'
                },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: data_pdf.cabecera.total, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{
                  text: [{
                    text: "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS, EL USO ILICITO DE ESTA SERA SANCIONADO PENALMENTE DE ACUERDO A LA LEY \n",
                    bold: true, fontSize: 8, alignment: 'center', font: 'Tahoma'
                  },
                  { text: data_pdf.leyendaSIN + "\n", bold: false, fontSize: 6, alignment: 'center', font: 'Tahoma' },
                  { text: data_pdf.cabecera.leyenda + "\n", bold: false, fontSize: 6, alignment: 'center', font: 'Tahoma' },
                  { text: "Esta factura se encuentra tambien disponible en el siguiente enlace", bold: false, fontSize: 6, font: 'Tahoma' }], characterSpacing: 0, margin: [10, 0, 0, 0], colSpan: 5, alignment: 'center'
                },

                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Importe Base Credito Fiscal' + "(BS): ", bold: true, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: data_pdf.cabecera.total, characterSpacing: 0, fontSize: 8.5, alignment: 'right', margin: [0, 0, 0, 0], font: 'Tahoma' }],

                [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { image: base64QR, colSpan: 3, alignment: 'center', margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }],

                [{ text: '', characterSpacing: 0, margin: [0, 0, 0, 0], },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: 'Código WEB: ' + data_pdf.cabecera.codfactura_web, alignment: 'center', fontSize: 7, margin: [0, 0, 0, 0], colSpan: 3, font: 'Tahoma' },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] },
                { text: '', characterSpacing: 0, margin: [0, 0, 0, 0] }],
              ],
            },
            margin: [12, 0, 10, 0], // Ajusta el espacio alrededor de la tabla
            layout: {
              // 'headerLineOnly',
              headerLineOnly: true,
              hLineWidth: function (i, node) {
                // Dibuja una línea solo debajo del encabezado
                return (i === 1) ? 1 : 0;
              },
              vLineWidth: function (i, node) {
                // Sin líneas verticales
                return 0;
              },
              hLineColor: function (i, node) {
                // Color de la línea horizontal
                return (i === 1) ? 'black' : 'white';
              },

              paddingLeft: function (i, node) { return 1.5; },
              paddingRight: function (i, node) { return 1.5; },
              paddingTop: function (i, node) { return 2.5; },
              paddingBottom: function (i, node) { return 1.5; }
            },
          },
        ],

        footer: function (currentPage, pageCount) {
          return {
            columns: [
              {
                text: 'Pagina ' + currentPage + ' de ' + pageCount + " - " + id + "-" + numeroid,
                alignment: 'center',
                margin: [4, 0, 10, 4],
                fontSize: 7,
                font: 'Arial',
              }
            ]
          };
        },

        styles: {
          header: {
            fontSize: 15,
          },
          content: {
            //font: 'Courier',
            margin: [0, 0, 0, 0],
          }
        },
        defaultStyle: {
          fontSize: 12,
          font: 'Arial',
        },
      };

      const archivo_pdf = pdfMake.createPdf(docDefinition);

      archivo_pdf.getBlob((pdfBlob: Blob) => {
        this.enviarEmail(pdfBlob);  // Llamamos a la función con el Blob
      });

    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
    }
  }

  enviarEmail(pdf) {
    this.spinner.show();
    const url = `/venta/modif/docmodifvefactura_nsf/reenviarFacturaEmail/${this.userConn}/${this.BD_storage}/${this.usuarioLogueado}/${this.documento_nro}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    // Crear FormData y agregar el archivo
    const formData = new FormData();
    formData.append('pdfFile', pdf, `FACTURA-PERTEC.pdf`);

    console.log(formData.get('pdfFile'));
    console.log(formData);

    this.api.create(url, formData).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav)
        this.openConfirmacionDialog(datav.resp);

        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        //this.detalleProformaCarritoTOExcel();
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }
  // FIN SECCION EMAIL

  // SECCION IMPRIMIR
  autorizarImprimir() {
    const url = `/venta/modif/docmodifvefactura_nsf/autorizaReimpresion/${this.userConn}/${this.agencia_logueado}/"28"/${this.codigo}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.getAll(url).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav)
        if (datav.esTienda) {
          this.mandarAImprimir();
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
        } else {
          // abrir el modal donde solo se visualiza
          this.getDataFacturaParaArmar();
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'GENERANDO FACTURA' });
        }
      },

      error: (err) => {
        console.log(err, errorMessage);
        //this.detalleProformaCarritoTOExcel();
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => { }
    });
  }
  // FIN SECCION IMPRIMIR


  mandarAImprimir() {
    const url = `/venta/transac/docvefacturamos_cufd/imprimirFactura/${this.userConn}/${this.documento_nro}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.getAll(url).subscribe({
      next: (datav) => {
        console.warn("🚀 IMPRIMIENDO...", datav);
        this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
      },

      error: (err) => {
        console.log(err, errorMessage);
        //this.detalleProformaCarritoTOExcel();
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => { }
    });
  }

  //SECCION DONDE SE OBTIENE PDF Y SE DIBUJA
  async getDataFacturaParaArmar() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDataFactura/";
    this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataFactura/' + this.userConn + "/" + this.codigo + "/" + this.BD_storage)
      .subscribe({
        next: async (datav) => {
          console.log("🚀 ~ FacturaNotaRemisionComponent ~ getDataFacturaParaArmar ~ datav:", datav)
          //this.valor_string_QR = datav.cadena_QR;
          //armamos el PDF, se crea, descarga el archivo y se lo envia por email
          if (datav) {
            try {
              await this.modalPDFFactura(datav);

            } catch (error) {
              console.error("Ocurrió un error:", error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'PROBLEMA EN EL PROCESO' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO PASO LA DATA O NO LLEGO ' });
          }
        },

        error: (err: any) => {
          this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'NO SE PUDO TRAER INFORMACION DE LA FACTURA 😧' });
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
  }

  async modalPDFFactura(data: any): Promise<any> {
    const dialogRef = this.dialog.open(FacturaTemplateComponent, {
      width: 'auto',
      height: 'auto',
      data: { valor_PDF: data },
    });

    // Espera hasta que el modal se cierre y devuelve el resultado
    return firstValueFrom(dialogRef.afterClosed());
  }
  // FIN SECCION IMPRIMIR

  // SECCION ENVIAR MAIL ANULACION
  enviarAnulacionCorreo() {
    this.spinner.show();
    const url = `/venta/modif/docmodifvefactura_nsf/enviarEmailAnulacion/${this.userConn}/${this.codigo_estado_siat}/${this.usuarioLogueado}/${this.documento_nro}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, []).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav)
        this.openConfirmacionDialog(datav.resp);

        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }
  // SECCION ENVIAR MAIL ANULACION

  // SECCION ENVIAR MAIL REVERSION
  enviarReversionCorreo() {
    const url = `/venta/modif/docmodifvefactura_nsf/enviarEmailReverAnulacion/${this.userConn}/${this.codigo_estado_siat}/${this.usuarioLogueado}/${this.documento_nro}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, []).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.create ~ datav:", datav);

        this.openConfirmacionDialog(datav.resp);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }
  // FIN SECCION ENVIAR MAIL REVERSION

  async habilitarProformaMostradorTiendas() {
    let valor_boolean: boolean = false;
    //pide clave
    const url = `/venta/modif/docmodifvefactura_nsf/HabilitarFactura/${this.userConn}/${this.usuarioLogueado}/${this.codigo}/${this.BD_storage}/${valor_boolean}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, []).subscribe({
      next: async (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav)
        if (!datav.resp) {
          await this.openConfirmacionDialog(datav.mensaje);
          await this.openConfirmacionDialog(datav.eventos[0] === undefined ? "" : datav.eventos[0] +
            datav.eventos[1] === undefined ? "" : datav.eventos[1] +
              datav.eventos[2] === undefined ? "" : datav.eventos[2] +
                datav.eventos[3] === undefined ? "" : datav.eventos[3]);
        } else {

          await this.openConfirmacionDialog(datav.mensaje);
          await this.openConfirmacionDialog(datav.eventos[0] === undefined ? "" : datav.eventos[0] +
            datav.eventos[1] === undefined ? "" : datav.eventos[1] +
              datav.eventos[2] === undefined ? "" : datav.eventos[2] +
                datav.eventos[3] === undefined ? "" : datav.eventos[3]);
        }

        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }

  async anularProformaMostradorTiendas() {
    if (this.anulada) {
      const resultEstaAnulada = await this.openConfirmacionDialog(`ESTA FACTURA YA ESTA ANULADA`);
      if (resultEstaAnulada) { }
    } else {
      const result = await this.openConfirmationDialog(`¿Esta seguro de ANULAR esta factura ?`);
      if (result) {
        const dialogRefParams = await this.dialog.open(PermisosEspecialesParametrosComponent, {
          width: '450px',
          height: 'auto',
          disableClose: true,
          data: {
            dataA: this.codigo_cliente,
            dataB: this.razon_social,
            dataPermiso: "",
            dataCodigoPermiso: "83",
            //abrir: true,
          },
        });

        dialogRefParams.afterClosed().subscribe(async (result: Boolean) => {
          console.log(result);
          if (result) {
            // se abre la ventanita de COMO REALIZAR LA ANULACION
            this.dialog.open(TiposAnulacionFelComponent, {
              width: '716px',
              height: 'auto',
              disableClose: true,
              data: {
                codigo_factura: this.codigo,
                datoA: this.codigo_cliente,
                datoB: this.razon_social,
                es_tienda: this.esTienda_bool
              },
            });
            return;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
          }
        });
      }
    }




  }






















  async imprimirAnticipo() {
    const url = `/venta/transac/docvefacturamos_cufd/imprimirReciboAnticipo/${this.userConn}/${this.documento_nro}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    const result = await this.openConfirmationDialog(`¿ESTA SEGURO DE IMPRIMIR LA BOLETA DE ANTICIPO?`);
    if (result) {
      this.api.getAll(url).subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
    }
  }

  async imprimirSolAnulacion() {
    let array_SolAnulacion: any = {
      nom_solicita_anulacion: this.nombre_solicitud_anulacion,
      ci_solicita_anulacion: this.ci_solicitud_anulacion.toString(),
    };

    const url = `/venta/modif/docmodifvefactura_nsf/imprimirSolAnulacion/${this.userConn}/${this.documento_nro}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    const result = await this.openConfirmationDialog(`¿ESTA SEGURO DE IMPRIMIR LA SOLICITUD DE FACTURA?`);
    if (result) {
      this.api.create(url, array_SolAnulacion).subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
    }
  }

  async Cambiar_en_Linea() {
    // this.spinner.show();
    let valor_boolean: boolean = true;

    const url = `/venta/modif/docmodifvefactura_nsf/Cambiar_en_Linea/${this.userConn}/${this.usuarioLogueado}/${this.codigo}/${this.BD_storage}/${this.en_linea}/${valor_boolean}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    const result = await this.openConfirmationDialog(`¿Esta seguro de cambiar el estado de la factura a: FUERA DE LINEA ?`);

    if (result) {
      const dialogRefParams = await this.dialog.open(PermisosEspecialesParametrosComponent, {
        width: '450px',
        height: 'auto',
        data: {
          dataA: this.id_factura + "-" + this.documento_nro,
          dataB: "CAMBIAR ESTADO EN LINEA",
          dataPermiso: "TRANSFERIR PROFORMA",
          dataCodigoPermiso: "143",
          //abrir: true,
        },
      });

      dialogRefParams.afterClosed().subscribe(async (result: Boolean) => {
        console.log(result);
        if (result) {
          await this.api.create(url, []).subscribe({
            next: async (datav) => {
              console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.create ~ datav:", datav);

              await this.openConfirmacionDialog(datav.msgAlert);

              this.num_idd = this.id_factura;
              this.num_id = this.documento_nro;
              this.transferirFactura()

              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            error: (err) => {
              console.log(err, errorMessage);
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            complete: () => {
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            }
          });
          return;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
        }
      });
    }
  }

  async cambiarEnLineaSIN() {
    // this.spinner.show();
    let valor_boolean: boolean = true;
    let en_linea_SIN;
    if (this.en_linea_SIN === true) {
      en_linea_SIN = true;
      valor_boolean = true;
    } else {
      en_linea_SIN = false;
      valor_boolean = true;
    }

    const url = `/venta/modif/docmodifvefactura_nsf/Cambiar_en_Linea_SIN/${this.userConn}/${this.usuarioLogueado}/${this.codigo}/${this.BD_storage}/${en_linea_SIN}/${valor_boolean}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    const result = await this.openConfirmationDialog(`¿Esta seguro de cambiar el estado de la factura en el SIN a : FUERA DE LINEA ?`);

    if (result) {
      const dialogRefParams = await this.dialog.open(PermisosEspecialesParametrosComponent, {
        width: '450px',
        height: 'auto',
        data: {
          dataA: this.id_factura + "-" + this.documento_nro,
          dataB: "CAMBIAR ESTADO EN LINEA SIN",
          dataPermiso: "",
          dataCodigoPermiso: "143",
          //abrir: true,
        },
      });

      dialogRefParams.afterClosed().subscribe(async (result: Boolean) => {
        console.log(result);
        if (result) {
          await this.api.create(url, []).subscribe({
            next: async (datav) => {
              console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ next: ~ datav:", datav)

              await this.openConfirmacionDialog(datav.msgAlert);
              //this.en_linea_SIN = datav.resp;

              this.num_idd = this.id_factura;
              this.num_id = this.documento_nro;
              this.transferirFactura();

              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            error: (err) => {
              console.log(err, errorMessage);
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            complete: () => {
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            }
          });
          return;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
        }
      });
    }
  }

  async CambiarFechaAnulacion(fecha) {
    // this.spinner.show();
    let valor_boolean: boolean = true;

    const url = `/venta/modif/docmodifvefactura_nsf/Cambiar_Fecha_Anulacion/${this.userConn}/${this.usuarioLogueado}/${this.codigo}/${this.BD_storage}/${fecha}/${valor_boolean}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    const result = await this.openConfirmationDialog(`¿Esta seguro de cambiar la FECHA DE ANULACION ?`);

    if (result) {
      const dialogRefParams = await this.dialog.open(PermisosEspecialesParametrosComponent, {
        width: '450px',
        height: 'auto',
        data: {
          dataA: this.id_factura,
          dataB: this.documento_nro,
          dataPermiso: "",
          dataCodigoPermiso: "75",
          //abrir: true,
        },
      });

      dialogRefParams.afterClosed().subscribe(async (result: Boolean) => {
        console.log(result);
        if (result) {
          await this.api.create(url, []).subscribe({
            next: async (datav) => {
              console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ next: ~ datav:", datav)

              await this.openConfirmacionDialog(datav.msgAlert);
              //this.en_linea_SIN = datav.resp;

              this.num_idd = this.id_factura;
              this.num_id = this.documento_nro;
              this.transferirFactura();

              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            error: (err) => {
              console.log(err, errorMessage);
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            complete: () => {
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            }
          });
          return;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
        }
      });
    }
  }

  generarCUFD() {
    this.spinner.show();
    const url = `/venta/modif/docmodifvefactura_nsf/getGenerarCuf/${this.userConn}/${this.BD_storage}/${this.agencia_logueado}/${this.en_linea}/${this.en_linea_SIN}/${this.numero_factura}/${this.codigo_control_get}/${this.id_factura}/${this.documento_nro}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.getAll(url).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav)

        if (datav.resp === true) {
          this.nuevo_CUFD = datav.cuf
        }

        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }

  anularSIN() {
    const url = `/venta/modif/docmodifvefactura_nsf/Revertir_Anulacion_Factura_SIN/${this.userConn}/${this.usuarioLogueado}/${this.codigo}/${this.BD_storage}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, []).subscribe({
      next: async (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.create ~ datav:", datav);

        await this.openConfirmacionDialog(datav.mensaje);
        // agregar al array de eventos
        const nuevosEventos = datav.eventos.map((log: string) => ({ label: log }));
        this.eventosLogs = [...this.eventosLogs, ...nuevosEventos];

        if (datav.enviar_mail_rever_anulacion) {
          this.enviarReversionCorreo();
        }
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }

  async cambiarCUF() {
    let sin_validar_pedir_clave: boolean = false;
    const result = await this.openConfirmationDialog(`¿Esta seguro de cambiar el CUF DE LA FACTURA ?`);

    if (result) {
      const dialogRefParams = await this.dialog.open(PermisosEspecialesParametrosComponent, {
        width: '450px',
        height: 'auto',
        data: {
          dataA: this.id_factura + "-" + this.documento_nro,
          dataB: "CAMBIAR CUF DE FACTURA",
          dataPermiso: "",
          dataCodigoPermiso: "144",
        },
      });

      dialogRefParams.afterClosed().subscribe(async (result: Boolean) => {
        if (result) {
          sin_validar_pedir_clave = true;

          const url = `/venta/modif/docmodifvefactura_nsf/cambiar_CUF/${this.userConn}/${this.usuarioLogueado}/${this.codigo}/${this.BD_storage}/${this.nuevo_CUFD}/${sin_validar_pedir_clave}`;
          const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

          this.api.create(url, []).subscribe({
            next: async (datav) => {
              console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ next: ~ datav:", datav)
              await this.openConfirmacionDialog(datav.msgAlert);

              // agregar al array de eventos
              const nuevosEventos = datav.eventos.map((log: string) => ({ label: log }));
              this.eventosLogs = [...this.eventosLogs, ...nuevosEventos];

              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            error: (err) => {
              console.log(err, errorMessage);
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            complete: () => {
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            }
          });
        } else {
          sin_validar_pedir_clave = false;

          const url = `/venta/modif/docmodifvefactura_nsf/cambiar_CUF/${this.userConn}/${this.usuarioLogueado}/${this.codigo}/${this.BD_storage}/${this.nuevo_CUFD}/${sin_validar_pedir_clave}`;
          const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

          this.api.create(url, []).subscribe({
            next: async (datav) => {
              console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ next: ~ datav:", datav)
              await this.openConfirmacionDialog(datav.msgAlert);

              // agregar al array de eventos
              const nuevosEventos = datav.eventos.map((log: string) => ({ label: log }));
              this.eventosLogs = [...this.eventosLogs, ...nuevosEventos];

              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            error: (err) => {
              console.log(err, errorMessage);
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            },

            complete: () => {
              setTimeout(() => {
                this.spinner.hide();
              }, 50);
            }
          });
        }
      });
    }
  }

  verificarFacturaEnSIN() {
    this.spinner.show();
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgfacturarNR_cufd/getDataFactura/";
    this.api.getAll('/venta/modif/docmodifvefactura_nsf/Verificar_Estado_Factura_en_el_SIN/' + this.userConn + "/" + this.usuarioLogueado
      + "/" + this.codigo + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ verificarFacturaEnSIN ~ datav:", datav)
          this.openConfirmacionDialog(datav.msgAlert);

          // agregar al array de eventos
          const nuevosEventos = datav.eventos.map((log: string) => ({ label: log }));
          this.eventosLogs = [...this.eventosLogs, ...nuevosEventos];
          console.log(this.eventosLogs);

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }

  verificarConexionSIN() {
    this.spinner.show();
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/modif/docmodifvefactura_nsf/Verificar_Comunicacion_SIN/";
    this.api.getAll('/venta/modif/docmodifvefactura_nsf/Verificar_Comunicacion_SIN/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" + this.agencia_logueado)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ verificarFacturaEnSIN ~ datav:", datav)
          this.openConfirmacionDialog(datav.msgAlert);

          // agregar al array de eventos
          const nuevosEventos = datav.eventos.map((log: string) => ({ label: log }));
          this.eventosLogs = [...this.eventosLogs, ...nuevosEventos];
          console.log(this.eventosLogs);

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }

  verificarNITCliente() {
    this.spinner.show();
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifvefactura_nsf/Verificar_NIT_Factura/";
    this.api.getAll('/venta/modif/docmodifvefactura_nsf/Verificar_NIT_Factura/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.codigo + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ verificarFacturaEnSIN ~ datav:", datav)
          this.openConfirmacionDialog(datav.msgAlert);

          // agregar al array de eventos
          const nuevosEventos = datav.eventos.map((log: string) => ({ label: log }));
          this.eventosLogs = [...this.eventosLogs, ...nuevosEventos];
          console.log(this.eventosLogs);

          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 50);
        }
      });
  }

  getLogPorIDNumeroID() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/modif/docmodifvefactura_nsf/refrescarLogs/";
    return this.api.getAll
      ('/venta/modif/docmodifvefactura_nsf/refrescarLogs/' + this.userConn + "/" + this.id_factura + "/" + this.documento_nro)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ getLogPorIDNumeroID ~ datav:", datav)
          this.array_de_logs = datav;

        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }










































  //SECCION DE TOTALES
  modalSubTotal() {
    this.dialog.open(ModalSubTotalMostradorTiendasComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_cliente: this.codigo_cliente,
        cod_almacen: this.agencia_logueado,
        cod_moneda: this.moneda_get_catalogo,
        items: this.array_items_carrito_y_f4_catalogo,
        fecha: this.fecha_actual
      },
    });
  }

  imprimirAgain() {
    const dialogRefEspeciales = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: '450px',
      height: 'auto',
      data: {
        dataA: this.id_factura,
        dataB: this.codigo,
        dataPermiso: "REIMPRESION DE FACTURA",
        dataCodigoPermiso: 28,
      },
    });

    dialogRefEspeciales.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.autorizarImprimir();
      } else {
        console.log("NO SE IMPRIMIO");
      }
    });
  }

  // modal con los botones SI / NO 
  openConfirmationDialog(message: string): Promise<boolean> {
    //btn si/no
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  openConfirmacionDialog(message: string): Promise<boolean> {
    //btn aceptar
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  modalDetalleObservaciones(obs, obsDetalle) {
    this.dialog.open(ModalDetalleObserValidacionComponent, {
      width: '700px',
      height: 'auto',
      disableClose: true,
      data: {
        obs_titulo: obs,
        obs_contenido: obsDetalle,
      },
    });
  }

  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_almacen: cod_almacen,
        // cod_item: this.item_seleccionados_catalogo_matriz_codigo,
        posicion_fija: posicion_fija,
        id_proforma: this.documento_nro,
        numero_id: this.documento_identidad
      },
    });
  }

  modalBuscadorAvanzado() {
    this.dialog.open(BuscadorAvanzadoFacturasComponent, {
      disableClose: true,
      width: '745px',
      height: '588px',
      // data: {
      //   ventana: "modificar_proforma"
      // },
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  alMenu() {
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
