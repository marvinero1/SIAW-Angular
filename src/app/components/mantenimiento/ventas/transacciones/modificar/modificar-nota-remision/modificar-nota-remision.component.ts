import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SaldoItemMatrizService } from '@components/mantenimiento/ventas/matriz-items/services-saldo-matriz/saldo-item-matriz.service';
import { ServicioclienteService } from '@components/mantenimiento/ventas/serviciocliente/serviciocliente.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { TipoidService } from '@components/mantenimiento/ventas/serviciotipoid/tipoid.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServicioTransfeAProformaService } from '../../proforma/modal-transfe-proforma/servicio-transfe-a-proforma/servicio-transfe-a-proforma.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { MatrizItemsComponent } from '@components/mantenimiento/ventas/matriz-items/matriz-items.component';
import { ModalIvaComponent } from '@components/mantenimiento/ventas/modal-iva/modal-iva.component';
import { ModalSubTotalComponent } from '@components/mantenimiento/ventas/modal-sub-total/modal-sub-total.component';
import { ModalSaldosComponent } from '@components/mantenimiento/ventas/matriz-items/modal-saldos/modal-saldos.component';
import { ModalClienteInfoComponent } from '@components/mantenimiento/ventas/modal-cliente-info/modal-cliente-info.component';
import { BuscadorAvanzadoComponent } from '@components/uso-general/buscador-avanzado/buscador-avanzado.component';
import { ItemDetalle } from '@services/modelos/objetos';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { BuscadorAvanzadoService } from '@components/uso-general/servicio-buscador-general/buscador-avanzado.service';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modificar-nota-remision',
  templateUrl: './modificar-nota-remision.component.html',
  styleUrls: ['./modificar-nota-remision.component.scss']
})
export class ModificarNotaRemisionComponent implements OnInit, AfterViewInit {

  public nombre_ventana: string = "docmodifveremision.vb";
  public ventana: string = "Modificar Notas De Remision";
  public detalle = "Modificar Notas De Remision";
  public tipo = "modificar-nota-remision-POST";

  fecha_actual = new Date();

  public razon_social: string;
  public cod_id_tipo_modal: string;
  public input_complemento_view: any;
  public estado_contra_entrega_input: any;
  public cod_vendedor_cliente: string;
  public codigo_item_catalogo: string;
  public codigo_cliente_catalogo: string;
  public empaque_item_codigo: string;
  public empaque_item_descripcion: string;
  public cantidad: string;
  public empaque_descripcion_concat: string;
  public codigo_cliente: string;
  public complementopf: any;
  public codigo_cliente_catalogo_real: string;

  public transporte: any;
  public medio_transporte: any;
  public fletepor: any;
  public tipoentrega: any;
  public desct_nivel_actual: any = "ACTUAL";
  public longitud_cliente: string;
  public es_contra_entrega: string;
  public latitud_cliente: string;
  public codigo_vendedor_catalogo: string;
  public direccion_cen: string;
  public direccion: string;
  public obs: string;
  public URL_maps: string;
  public preparacion: any;
  public venta_cliente_oficina: boolean = false;
  public contra_entrega = false;
  public nombre_cliente: string;
  public tipo_doc_cliente: any;
  public nit_cliente: string;
  public complemento_ci: string
  public email_cliente: string;
  public total_X_PU: boolean = false;



  estado: any
  almacn_parame_usuario_almacen: any;
  fecha_actual_format: string;
  es_venta: boolean = true;
  tipopago: string;
  moneda_get_catalogo: string;
  tdc: any;
  peso: any;
  porcen_item: string;
  fecha_actual_server: any;
  hora_fecha_server: any;
  num_idd: any;
  num_id: any;
  odc: any;
  nivel_descuento: any;
  desclinea_segun_solicitud: any;
  cod_precio_venta_modal_codigo: number;
  cod_descuento_modal_codigo: number = 0;
  codigo_cliente_real: any;
  codigo_proforma: any;
  cod_id_tipo_modal_id: any;
  ubicacion: any;
  codproforma: any;
  estadodoc: any;


  //fechas
  fecha: any;
  pago_contado_anticipado_view: any;
  fecha_confirmada: any;
  fechaaut: any;
  fecha_reg: any;
  fecha_inicial: any;

  horareg: any;
  hora: any;
  usuarioreg: any;
  horaaut: any;
  hora_confirmada: any;
  hora_inicial: any;
  //horas


  id_proforma_numero_id: any = [];
  array_items_carrito_y_f4_catalogo: any = [];
  empaquesItem: any = [];
  id_tipo: any = [];
  almacenes_saldos: any = [];
  habilitar_desct_sgn_solicitud: any = [];
  array_de_descuentos_ya_agregados: any = [];
  totabilizar_post: any = [];
  ids_complementar_proforma: any = [];
  almacen_get: any = [];
  precio_venta_get_unico: any = [];
  precio_venta_unico_copied: any = [];
  cod_precio_venta_modal: any = [];
  cod_precio_venta_modal_first: any = [];
  documento_identidad: any = [];
  item_seleccionados_catalogo_matriz: any = [];
  recargo_de_recargos: any = [];
  public item_obtenido: any = [];


  dataform: any = '';
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  FormularioData: FormGroup;

  // totales
  public subtotal: number;
  public recargos: number;
  public des_extra: number;
  public iva: number;
  public total: number;
  tablaIva: any = [];
  item_seleccionados_catalogo_matriz_codigo: any;

  public saldoItem: number;
  saldo_modal_total_1: any;
  saldo_modal_total_2: any;
  saldo_modal_total_3: any;
  saldo_modal_total_4: any;
  saldo_modal_total_5: any;

  selectedProducts: ItemDetalle[] = [];

  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private servicioCliente: ServicioclienteService, private _formBuilder: FormBuilder,
    private serviciotipoid: TipoidService, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private log_module: LogService, private datePipe: DatePipe, private saldoItemServices: SaldoItemMatrizService,
    public servicioTransfeProformaCotizacion: ServicioTransfeAProformaService, public nombre_ventana_service: NombreVentanaService,
    public servicioBuscadorAvanzado: BuscadorAvanzadoService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.cod_precio_venta_modal_codigo = 1;
    this.fecha_actual_format = this.datePipe.transform(this.fecha_actual, 'dd-MM-yyyy')
    this.mandarNombre();
    this.es_venta = true;

    this.serviciotipoid.disparadorDeIDTipo.subscribe(data => {
      console.log("Recibiendo ID Tipo: ", data);
      this.cod_id_tipo_modal = data.id_tipo.id;
    });

    this.itemservice.disparadorDeItems.subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.codigo_item_catalogo = data.item;
      this.getEmpaqueItem(this.codigo_item_catalogo);
    });

    //SALDOS ITEM PIE DE PAGINA
    this.saldoItemServices.disparadorDeSaldoAlm1.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_1 = data.saldo1;
    });

    this.saldoItemServices.disparadorDeSaldoAlm2.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_2 = data.saldo2;
    });

    this.saldoItemServices.disparadorDeSaldoAlm3.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_3 = data.saldo3;
    });

    this.saldoItemServices.disparadorDeSaldoAlm4.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_4 = data.saldo4;
    });

    this.saldoItemServices.disparadorDeSaldoAlm5.subscribe(data => {
      console.log("Recibiendo Saldo Total: ", data);
      this.saldo_modal_total_5 = data.saldo5;
    });
    //FIN SALDOS ITEM PIE DE PAGINA

    // //ventana modal BuscadorGeneral
    // this.servicioBuscadorAvanzado.disparadorDeID_NumeroIDNotaRemision.subscribe(data => {
    //   console.log("Recibiendo ID y numeroID Buscador Avanzado: ", data);
    //   // this.num_idd = data.buscador_id;
    //   // this.num_id = data.buscador_num_id;
    //   this.transferirNotaRemisionUltima(data.codigo_documento);
    // });
    // //fin ventana modal BuscadorGeneral



    this.servicioTransfeProformaCotizacion.disparadorDeProformaTransferir.subscribe(data => {
      console.log("Recibiendo ID y numeroID Buscador Avanzado: ", data);
      // this.num_idd = data.buscador_id;
      // this.num_id = data.buscador_num_id;
      this.transferirNotaRemisionUltima(data.codigo_documento);
    });
    //fin ventana modal BuscadorGeneral
  }

  ngAfterViewInit() {
    this.getHoraFechaServidorBckEnd();
    this.getTipoDocumentoIdentidadProforma();
    this.getIDScomplementarProforma();

    this.getUltimaNotaRemision();
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          this.fecha_actual_server = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
          this.fecha = datav.fechaServidor;
          this.hora_fecha_server = datav.horaServidor;

          console.log(this.fecha, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getUltimaNotaRemision() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/modif/docmodifveremision/getUltimoCodNR/";
    return this.api.getAll('/venta/modif/docmodifveremision/getUltimoCodNR/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.transferirNotaRemisionUltima(datav.codUltimoNR);

        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  transferirNotaRemisionUltima(cod_ultimo) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveremision/mostrarDatosNR/";

    return this.api.getAll('/venta/modif/docmodifveremision/mostrarDatosNR/' + this.userConn + "/" + cod_ultimo + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          console.log("DATA ULTIMA NOTA DE REMISION: ", datav);
          this.imprimir_proforma_tranferida(datav);
          if (datav.resp) {
            this.openConfirmacionDialog(datav.resp);
          }

          this.toastr.success('! TRANSFERENCIA EN PROGESO ! ✅');
          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          // this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
        },
        complete: () => {
        }
      })
  }

  getEmpaqueItem(item) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/getempaques/";
    return this.api.getAll('/venta/transac/veproforma/getempaques/' + this.userConn + "/" + item)
      .subscribe({
        next: (datav) => {
          this.empaquesItem = datav;

          this.empaque_item_codigo = this.empaquesItem.codigo;
          this.empaque_item_descripcion = this.empaquesItem.descripcion;
          this.cantidad = this.empaquesItem.cantidad;

          this.empaque_descripcion_concat = "(" + this.empaque_item_codigo + ")" + this.empaque_item_descripcion + "-" + this.cantidad + " | ";

          console.log(this.empaquesItem);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIDScomplementarProforma() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/venumeracion/catalogo/' + this.userConn + "/" + 4)
      .subscribe({
        next: (datav) => {
          this.ids_complementar_proforma = datav;
          // console.log('data', this.ids_complementar_proforma);
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

  fecha_anulacion: any;
  fecha_anulacion_input: any;

  imprimir_proforma_tranferida(proforma) {
    console.log("Imprimir Proforma Transferida: ", proforma, proforma.habilitado);

    this.estadodoc = proforma.estadodoc;
    this.email_cliente = proforma.cabecera.email;
    this.codigo_proforma = proforma.cabecera.codigo;
    this.cod_id_tipo_modal_id = proforma.cabecera.id;
    this.id_proforma_numero_id = proforma.cabecera.numeroid.toString();

    //fechas
    this.fecha = this.datePipe.transform(proforma.cabecera.fecha, 'YYYY-MM-dd');
    this.fecha_inicial = proforma.cabecera.fecha_inicial;
    this.fecha_confirmada = proforma.cabecera.fecha_confirmada;
    this.fechaaut = proforma.cabecera.fechaaut;
    this.fecha_reg = proforma.cabecera.fechareg;
    this.fecha_anulacion_input = proforma.cabecera.fecha_anulacion

    this.hora_inicial = proforma.cabecera.hora_inicial;
    this.horareg = proforma.cabecera.horareg;
    this.hora = proforma.cabecera.hora;
    this.usuarioreg = proforma.cabecera.usuarioreg;
    this.horaaut = proforma.cabecera.horaaut;
    this.hora_confirmada = proforma.cabecera.hora_confirmada;
    //fin-fecha

    //cliente real
    this.codigo_cliente_real = proforma._codcliente_real;
    this.codigo_cliente_catalogo_real = proforma._codcliente_real;
    //this.cliente_casual = proforma.cabecera.casual;
    //de aca sacamos si es casual
    // this.mandarCodCliente(proforma.cabecera.codcliente);
    //fin cliente real

    // this.id_anticipo = proforma.cabecera.idanticipo;
    // this.usuarioaut = proforma.cabecera.usuarioaut;
    this.contra_entrega = proforma.cabecera.contra_entrega;
    this.almacn_parame_usuario_almacen = proforma.cabecera.codalmacen;
    this.codigo_cliente = proforma.cabecera.codcliente;
    this.nombre_cliente = proforma.cabecera.nomcliente;
    this.razon_social = proforma.cabecera.nomcliente;
    this.complemento_ci = proforma.cabecera.complemento_ci;
    this.tipo_doc_cliente = proforma.cabecera.tipo_docid;
    this.nit_cliente = proforma.cabecera.nit;
    this.email_cliente = proforma.cabecera.email;
    this.codproforma = proforma.cabecera.codproforma
    this.moneda_get_catalogo = proforma.cabecera.codmoneda;
    this.tipopago = proforma.cabecera.tipopago;
    // this.tipo_cliente = proforma.tipo_cliente;

    this.transporte = proforma.cabecera.transporte;
    this.medio_transporte = proforma.cabecera.nombre_transporte;
    this.fletepor = proforma.cabecera.fletepor;
    this.tipoentrega = proforma.cabecera.tipoentrega;
    this.peso = proforma.cabecera.peso;

    this.cod_vendedor_cliente = proforma.cabecera.codvendedor;
    this.direccion = proforma.cabecera.direccion;
    this.obs = proforma.cabecera.obs;
    this.odc = proforma.cabecera.odc;
    this.tdc = proforma.cabecera.tdc;

    this.preparacion = proforma.cabecera.preparacion;
    this.subtotal = proforma.cabecera.subtotal;
    this.recargos = proforma.cabecera.recargos;
    this.des_extra = proforma.cabecera.descuentos;
    this.iva = proforma.cabecera.iva;
    this.total = proforma.cabecera.total;

    //this.item_seleccionados_catalogo_matriz = proforma.detalle;
    //this.veproforma1 = proforma.detalle;
    this.array_de_descuentos_ya_agregados = proforma.descuentos;
    //this.cod_descuento_total = proforma.descuentos;
    //la cabecera asignada a this.veproforma para totalizar y grabar
    //this.veproforma = proforma.cabecera;

    //el cuerpo del detalle asignado al carrito
    this.array_items_carrito_y_f4_catalogo = proforma.detalle;

    //la etiqueta se almacena el valor de proforma.etiquetaProf siempre y cuando profEtiqueta este vacio
    //en caso de profEtiqueta tenga data esa data se guarda aca
    this.recargo_de_recargos = proforma.recargos;
    //this.valor_formulario_copied_map_all = proforma.cabecera;

    this.estado_contra_entrega_input = proforma.cabecera.estado_contra_entrega;

    //colocar orden al detalle de la proforma
    this.array_items_carrito_y_f4_catalogo?.forEach((element, index) => {
      element.orden = index + 1;
    });
  }

  createForm(): FormGroup {
    return this._formBuilder.group({

      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [this.dataform.numeroid, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codcliente: [this.dataform.codcliente, Validators.compose([Validators.required])],
      nomcliente: [this.razon_social, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      //precio venta columna segunda primera fila verificar conq nombre se guarda

      preciovta: [this.dataform.preciovta, Validators.compose([Validators.required])],
      cod_descuento: [this.dataform.descuentos],
      tipopago: [this.dataform.tipopago === 0 ? 0 : 1, Validators.required],
      transporte: [this.dataform.transporte === "FLOTA", Validators.required],
      nombre_transporte: [this.dataform.nombre_transporte, Validators.compose([Validators.required])],
      tipo_docid: [{ value: this.dataform.tipo_docid, disabled: true }, Validators.compose([Validators.required])],
      preparacion: [this.dataform.preparacion, Validators.compose([Validators.required])],
      tipoentrega: [this.dataform.tipoentrega === "ENTREGAR"],
      fletepor: [this.dataform.fletepor === "CLIENTE", Validators.compose([Validators.required])],
      estado_proforma: [{ value: this.dataform.estado_proforma, disabled: true }],
      tdc: [this.dataform.tdc],
      anulada: [false],
      aprobada: [false],
      paraaprobar: [false],
      transferida: [false],
      usuarioaut: [""],
      confirmada: [false],
      impresa: [false],
      etiqueta_impresa: [false],
      es_sol_urgente: [false],
      // codproforma: [this.dataform.cod_proforma_form],
      //complemento_proforma: [this.dataform.complemento_proforma],
      obs: this.dataform.obs ? this.dataform.obs.trim() : '',
      obs2: [""],
      direccion: [this.dataform.direccion],
      codcliente_real: [this.dataform.codcliente_real],
      // peso: Number(this.peso),
      peso: Number(this.dataform.peso),

      latitud_entrega: "-0.22222222",
      longitud_entrega: "-0.22222222",
      ubicacion: 'LOCAL',
      email: [this.dataform.email],

      venta_cliente_oficina: [{ value: this.dataform.venta_cliente_oficina === undefined ? false : true, disabled: true }],
      desclinea_segun_solicitud: "false", //Descuentos de Linea de Solicitud

      contra_entrega: this.dataform.contra_entrega,
      estado_contra_entrega: [this.dataform.estado_contra_entrega],

      tipo_venta: ['0'],
      odc: "",

      idanticipo: [""], //anticipo VentasL
      numeroidanticipo: [0], //anticipo Ventas
      pago_contado_anticipado: [false], //anticipo Ventas
      complemento_ci: [this.dataform.complemento_ci === undefined ? "" : this.dataform.complemento_ci],
      codcomplementaria: [this.dataform.codcomplementaria === null ? 0 : 0], //aca es para complemento de proforma //ACA REVIS

      nroidpf_complemento: this.dataform.nroidpf_complemento === undefined ? 0 : this.dataform.nroidpf_complemento,
      idsoldesctos: "", // Descuentos de Linea de Solicitud, esto ya no se utiliza enviar valor 0
      nroidsoldesctos: [0], // Descuentos de Linea de Solicitud, ya no se usa a fecha mayo/2024

      idpf_complemento: this.dataform.idpf_complemento === undefined ? "" : this.dataform.idpf_complemento, //aca es para complemento de proforma
      monto_anticipo: 0, //anticipo Ventas

      // fechaaut_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // subtotal_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario
      // moneda_total_pfcomplemento //este dato va en complementar Proforma, pero no entra en el formulario

      niveles_descuento: [this.dataform.niveles_descuento === undefined ? 'ACTUAL' : this.dataform.niveles_descuento], //niveles de descuento

      // no hay mas en esta seccion xD
      subtotal: [this.dataform.subtotal === null ? 0.00 : this.dataform.subtotal], //TOTALES
      recargos: [this.dataform.recargos === null ? 0.00 : this.dataform.recargos], //TOTALES
      //des_extra: [this.dataform.des_extra], //TOTALES
      iva: [this.dataform.iva === null ? 0.00 : this.dataform.iva], //TOTALES
      total: [this.dataform.total === null ? 0.00 : this.dataform.total], //TOTALES
      porceniva: [0],

      fecha: this.dataform.fecha,
      fechareg: this.dataform.fecha,
      fecha_confirmada: this.dataform.fecha,
      fechaaut: this.dataform.fecha,
      fecha_inicial: this.dataform.fecha,

      horareg: this.dataform.horareg,
      hora: this.dataform.horareg,
      usuarioreg: this.dataform.usuarioLogueado,
      horaaut: this.dataform.horareg,
      hora_inicial: this.dataform.horareg,
      hora_confirmada: this.dataform.horareg,

      es_venta: { value: this.dataform.es_venta, disabled: true }
    });
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  formatNumberTotalSub(numberString: number): string {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 5, maximumFractionDigits: 5 }).format(formattedNumber);
  }

  itemDataAll(codigo) {
    // this.getSaldoEmpaquePesoAlmacenLocal(codigo);
    this.getEmpaqueItem(codigo);
    this.getSaldoItemSeleccionadoDetalle(codigo);
    this.getAlmacenesSaldos();
    this.getPorcentajeVentaItem(codigo);

    this.saldo_modal_total_1 = "";
    this.saldo_modal_total_2 = "";
    this.saldo_modal_total_3 = "";
    this.saldo_modal_total_4 = "";
    this.saldo_modal_total_5 = "";
  }

  getSaldoItemSeleccionadoDetalle(item) {
    if (this.agencia_logueado === "Loc") {
      this.agencia_logueado = "311";
    }

    this.item_seleccionados_catalogo_matriz_codigo = item;

    let agencia_concat = "AG" + this.agencia_logueado;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll
      ('/venta/transac/veproforma/getsaldosCompleto/' + this.userConn + "/" + agencia_concat + "/" + this.agencia_logueado + "/" + item + "/" + this.BD_storage + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.id_tipo = datav;
          console.log('data', this.id_tipo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacenesSaldos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/transac/veproforma/getCodAlmSlds/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacenes_saldos = datav;
          console.log(this.almacenes_saldos);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  totabilizar() {
    let total_proforma_concat: any = [];

    //valor del check en el mat-tab complementar proforma
    if (this.complementopf === false || this.complementopf === undefined) { //valor del check en el mat-tab complementar proforma this.disableSelectComplemetarProforma.value 
      this.complementopf = 0;
    } else {
      this.complementopf = 1;
    }

    if (this.array_items_carrito_y_f4_catalogo.length === 0) {
      this.toastr.error("NO HAY ITEM'S EN EL DETALLE DE PROFORMA");
    };

    if (this.habilitar_desct_sgn_solicitud === undefined) {
      this.habilitar_desct_sgn_solicitud = false;
    };

    let data = this.FormularioData.value;
    data = {
      ...data,
      desclinea_segun_solicitud: true,
      fecha_confirmada: '1900-01-01',
      fecha_inicial: '1900-01-01',
      fechaaut: '1900-01-01',

      hora: '00:00',
      hora_confirmada: '00:00',
      hora_inicial: '00:00',
      horaaut: '00:00',
      ubicacion: 'LOCAL',
    };

    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map(item => ({
      ...item,
      codproforma: this.codproforma,
      cantaut: item.cantidad,
      totalaut: item.total,
      obs: "",

      id: 0,
      peso: 0,
      cantidad_pedida: item.cantidad,
      empaque: 0,
      nroitem: item.orden,
      total: item.total,
      cumple: true,
      cumpleMin: true,
      cumpleEmp: true,
    }));

    total_proforma_concat = {
      veproforma: data, //este es el valor de todo el formulario de proforma
      veproforma1_2: this.array_items_carrito_y_f4_catalogo, //este es el carrito con las items
      veproforma_valida: [],
      veproforma_anticipo: [],
      vedesextraprof: this.array_de_descuentos_ya_agregados, //array de descuentos
      verecargoprof: [], //array de recargos
      veproforma_iva: [], //array de iva
    };

    const dialogRefaplicar = this.dialog.open(DialogConfirmActualizarComponent, {
      width: 'auto',
      height: 'auto',
      data: { mensaje_dialog: "Al recalcular la nota de remision es posible que el monto total de documento original no sea el mismo, si hubo cambios de precios despues de la emision de la nota de remision. ¿Desea Continuar?" },
      disableClose: true,
    });


    dialogRefaplicar.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        const dialogRefParams = this.dialog.open(PermisosEspecialesParametrosComponent, {
          width: '450px',
          height: 'auto',
          data: {
            dataA: this.cod_id_tipo_modal_id + "-" + this.id_proforma_numero_id,
            dataB: this.fecha.replace(/-/g, ''),
            dataPermiso: " MODIFICACION NOTA DE REMISION",
            dataCodigoPermiso: "58",
            //abrir: true,
          },
        });

        dialogRefParams.afterClosed().subscribe((result: Boolean) => {
          console.log(result);
          if (result) {
            console.log("Array de Carrito a Totaliza:", total_proforma_concat, "URL: " + ("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" + this.habilitar_desct_sgn_solicitud + "/" + this.complementopf + "/" + this.desct_nivel_actual));
            if (this.habilitar_desct_sgn_solicitud != undefined && this.complementopf != undefined) {
              console.log("DATOS VALIDADOS");
              this.spinner.show();
              let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/totabilizarProf/";
              return this.api.create("/venta/transac/veproforma/totabilizarProf/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/" +
                "false" + "/" + "0" + "/" + this.desct_nivel_actual + "/" + this.codigo_cliente_catalogo_real, total_proforma_concat)
                .subscribe({
                  next: (datav) => {
                    this.totabilizar_post = datav;
                    console.log(this.totabilizar_post);
                    this.toastr.success('! TOTALIZADO EXITOSAMENTE !');

                    console.log(this.array_items_carrito_y_f4_catalogo);

                    setTimeout(() => {
                      this.spinner.hide();
                    }, 1500);
                  },

                  error: (err) => {
                    console.log(err, errorMessage);
                    this.toastr.error('! NO SE TOTALIZO !');

                    setTimeout(() => {
                      this.spinner.hide();
                    }, 1500);
                  },
                  complete: () => {
                    this.total = this.totabilizar_post.totales?.total;
                    this.subtotal = this.totabilizar_post.totales?.subtotal;
                    this.recargos = this.totabilizar_post.totales?.recargo;
                    this.des_extra = this.totabilizar_post.totales?.descuento;
                    this.iva = this.totabilizar_post.totales?.iva;
                    this.peso = Number(this.totabilizar_post.totales?.peso);
                    // this.tablaIva = this.totabilizar_post.totales?.tablaIva;
                    const item_procesados_en_total = this.totabilizar_post?.detalleProf;

                    // Agregar el número de orden a los objetos de datos
                    this.totabilizar_post?.detalleProf.forEach((element, index) => {
                      element.orden = index + 1;
                    });

                    this.array_items_carrito_y_f4_catalogo = this.totabilizar_post?.detalleProf;
                  }
                })
            } else {
              this.toastr.info("VALIDACION ACTIVA 🚨");
              console.log("HAY QUE VALIDAR DATOS");
            }
          }
        });
      } else {
        console.log("Le dio a NO a ventana confirmar")
      }
    });
  }

  deshabiliatHabilitarEsVenta() {
    if (this.es_venta === true) {
      this.es_venta = false;
    } else {
      this.es_venta = true;
    }
  }

  transferirNotaRemision() {
    console.log(this.num_idd, this.num_id);

    this.spinner.show()
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/modif/docmodifveremision/getCodigoNR/";

    return this.api.getAll('/venta/modif/docmodifveremision/getCodigoNR/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.num_idd + "/" + this.num_id)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          this.transferirNotaRemisionUltima(datav.codigoNR.codigo);
          this.toastr.success('! TRANSFERENCIA EXITOSA !');

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! TRANSFERENCIA FALLO ! ❌');
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      })
  }

  onRowSelect(event: any) {
    console.log(event);
    this.itemDataAll(event.data.coditem)
  }

  onRowSelectForDelete() {
    console.log('Array de Items para eliminar: ', this.selectedProducts);

    // Filtrar el array para eliminar los elementos que están en el array de elementos seleccionados
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return !this.selectedProducts.some(selectedItem =>
        selectedItem.orden === item.orden && selectedItem.coditem === item.coditem);
    });

    // Actualizar el número de orden de los objetos de datos restantes
    this.array_items_carrito_y_f4_catalogo.forEach((element, index) => {
      element.orden = index + 1;
    });

    // Limpiar el array de productos seleccionados
    this.selectedProducts = [];
  }

  onRowUnselect(event: any) {
    console.log('Row Unselected:', event.data);
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    console.log('Selected Products:', this.selectedProducts);
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

  getPorcentajeVentaItem(item) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inmatriz/infoItemRes/";
    return this.api.getAll('/inventario/mant/inmatriz/infoItemRes/' + this.userConn + "/" + this.agencia_logueado + "/" + item + "/" +
      this.cod_precio_venta_modal_codigo + "/" + this.cod_descuento_modal_codigo + "/" + this.codigo_cliente_catalogo_real)
      .subscribe({
        next: (datav) => {
          this.item_obtenido = datav;
          console.log('item seleccionado: ', this.item_obtenido);
          this.porcen_item = this.item_obtenido.porcen_maximo;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  autUltInventario: boolean = false;
  autNResReversion: boolean = false;
  codigo_control: any;
  anularNotaRemision(codigo_control) {
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:-/venta/modif/docmodifveremision/anularNR/ `;

    this.api.create('/venta/modif/docmodifveremision/anularNR/' + this.userConn + "/" + this.codigo_proforma + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/"
      + this.autUltInventario + "/" + this.autNResReversion, []).subscribe({
        next: (datav) => {
          this.toastr.info("GUARDADO CON EXITO ✅");
          this.log_module.guardarLog(this.ventana, "Anulacion" + this.totabilizar_post.codProf, "POST", this.cod_id_tipo_modal_id, this.id_proforma_numero_id);
          this.codigo_control = datav.tipoPermiso;
          console.log(datav);

          this.openConfirmacionDialog(datav.resp);

          if (datav.validacion === true) {
            switch (datav.tipoPermiso) {
              case 78:
                const dialogRefValidacion78 = this.dialog.open(PermisosEspecialesParametrosComponent, {
                  width: 'auto',
                  height: 'auto',
                  data: {
                    dataA: datav.datos_a,
                    dataB: datav.datos_b,
                    dataPermiso: "ANULAR REVERSION",
                    dataCodigoPermiso: datav.tipoPermison,
                  },
                });

                dialogRefValidacion78.afterClosed().subscribe((result: Boolean) => {
                  return this.api.create('/venta/modif/docmodifveremision/anularNR/' + this.userConn + "/" + this.codigo_proforma + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/"
                    + this.autUltInventario + "/" + this.autNResReversion, [])
                    .subscribe({
                      next: async (datav) => {
                        // this.tipoentrega = datav.mensaje;
                        console.log("Info data guardada NOTA REMISION CODIGO 78: ", datav, "ruta:", errorMessage);

                        //PRIMERO SE CAMBIAN LOS VALORES Y LUEGO SE LLAMA A LA RECURSIVA
                        this.autNResReversion = true;
                        this.autUltInventario = false;

                        // aca se vuelve RECURSIVA, volviendo a llamar a la funcion pasandole el nuevo codigo_control recibido
                        this.anularNotaRemision(codigo_control);

                        console.log("Valor Bool al finlizar funcion:", this.autNResReversion);
                        setTimeout(() => {
                          this.spinner.hide();
                        }, 1000);
                        return;
                      },

                      error: (err: any) => {
                        console.log(err, errorMessage);
                        // this.toastr.error("Formulario T. Entrega Error");
                      },
                      complete: () => {
                        this.toastr.success("GUARDADO EXITOSAMENTE");
                      }
                    })
                });
                break;
              case 48:
                const dialogRefValidacion48 = this.dialog.open(PermisosEspecialesParametrosComponent, {
                  width: 'auto',
                  height: 'auto',
                  data: {
                    dataA: datav.datos_a,
                    dataB: datav.datos_b,
                    dataPermiso: "MODIFICACION ANTERIOR A INVENTARIO",
                    dataCodigoPermiso: 48,
                  },
                });

                dialogRefValidacion48.afterClosed().subscribe((result: Boolean) => {
                  return this.api.create('/venta/modif/docmodifveremision/anularNR/' + this.userConn + "/" + this.codigo_proforma + "/" + this.usuarioLogueado + "/" + this.BD_storage + "/"
                    + this.autUltInventario + "/" + this.autNResReversion, [])
                    .subscribe({
                      next: async (datav) => {
                        // this.tipoentrega = datav.mensaje;
                        console.log("Info data guardada NOTA REMISION CODIGO 78: ", datav, "ruta:", errorMessage);

                        //PRIMERO SE CAMBIAN LOS VALORES Y LUEGO SE LLAMA A LA RECURSIVA
                        this.autUltInventario = true;
                        this.autNResReversion = false;

                        // aca se vuelve RECURSIVA, volviendo a llamar a la funcion pasandole el nuevo codigo_control recibido
                        this.anularNotaRemision(codigo_control);

                        console.log("Valor Bool al finlizar funcion:", this.autUltInventario);
                        setTimeout(() => {
                          this.spinner.hide();
                        }, 1000);
                        return;
                      },

                      error: (err: any) => {
                        console.log(err, errorMessage);
                        // this.toastr.error("Formulario T. Entrega Error");
                      },
                      complete: () => {
                        this.toastr.success("GUARDADO EXITOSAMENTE");
                      }
                    })
                });
                break;
              default:
                break;
            }
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GRABO, OCURRIO UN PROBLEMA AL ANULAR !');

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

  cambiarFechaAnulacion() {
    const dialogRefConfirFechaAnulacion = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: "¿Esta Seguro de Cambiar la Fecha de Anulacion?" },
      disableClose: true,
    });

    dialogRefConfirFechaAnulacion.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:-/venta/modif/docmodifveremision/cambiarFechaAnulNR/`;
        this.api.update('/venta/modif/docmodifveremision/cambiarFechaAnulNR/' + this.userConn + "/" + this.codigo_proforma + "/" + this.datePipe.transform(this.fecha_anulacion_input, 'yyyy-MM-dd') + "/false", []).subscribe({
          next: (datav) => {
            this.toastr.info("FECHA ANULACION ACTUALIZADA ✅");
            this.log_module.guardarLog(this.ventana, "Modificar" + this.totabilizar_post.codProf, "PUT", this.cod_id_tipo_modal_id, this.id_proforma_numero_id);

            console.log(datav);
            this.openConfirmacionDialog(datav.resp);

            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },

          error: (err) => {
            console.log(err, errorMessage);
            this.toastr.error('! FECHA ANULACION NO ACTUALIZADA !');

            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },

          complete: () => { }
        });
      }
    });
  }

  generarPlanPagosFaltante() {
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:-/venta/modif/docmodifveremision/getPlanPagosFalt/`;
    this.api.create('/venta/modif/docmodifveremision/genPlanPagosFalt/' + this.userConn + "/" + this.codigo_proforma + "/" + this.BD_storage, []).subscribe({
      next: (datav) => {
        this.toastr.info("PLAN DE PAGOS CREADO ✅");
        this.log_module.guardarLog(this.ventana, "Crear" + this.totabilizar_post.codProf, "POST", this.cod_id_tipo_modal_id, this.id_proforma_numero_id);

        console.log(datav);
        this.openConfirmacionDialog(datav.resp);

        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },

      error: (err) => {
        console.log(err, errorMessage);

        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },

      complete: () => { }
    });
  }



























  modalClientesInfo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ModalClienteInfoComponent, {
      width: 'auto',
      height: '600px',
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  modalSaldos(cod_almacen, posicion_fija): void {
    this.dialog.open(ModalSaldosComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        cod_almacen: cod_almacen,
        cod_item: this.item_seleccionados_catalogo_matriz_codigo,
        posicion_fija: posicion_fija
      },
    });
  }

  modalBuscadorAvanzado() {
    this.dialog.open(BuscadorAvanzadoComponent, {
      disableClose: true,
      width: '820px',
      height: 'auto',
      data: {
        ventana: "modificar_notas_remision"
      },
    });
  }

  modalSubTotal() {
    this.dialog.open(ModalSubTotalComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        descuento_nivel: this.desct_nivel_actual,
        cod_cliente: this.codigo_cliente,
        cod_almacen: this.agencia_logueado,
        cod_moneda: this.moneda_get_catalogo,
        desc_linea: this.habilitar_desct_sgn_solicitud,
        items: this.array_items_carrito_y_f4_catalogo,
        fecha: this.fecha_actual
      },
    });
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

  modalIva() {
    console.log(this.tablaIva);
    this.dialog.open(ModalIvaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { tablaIva: this.tablaIva },
    });
  }

  modalMatrizProductos(): void {
    this.dialog.open(MatrizItemsComponent, {
      width: 'auto',
      height: '900px',
      disableClose: true,
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
