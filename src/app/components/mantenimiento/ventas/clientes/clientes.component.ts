import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalClienteComponent } from '../modal-cliente/modal-cliente.component';
import { ServicioclienteService } from '../serviciocliente/serviciocliente.service';
import { DatePipe } from '@angular/common';
import { ModalRubroComponent } from '@components/mantenimiento/rubro/modal-rubro/modal-rubro.component';
import { ServiciorubroService } from '@components/mantenimiento/rubro/servicio/serviciorubro.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ModalZonaComponent } from '../modal-zona/modal-zona.component';
import { ServiciozonaService } from '../serviciozona/serviciozona.service';
import { CatalogoPuntoVentaComponent } from '../punto-venta/catalogo-punto-venta/catalogo-punto-venta.component';
import { ProvinciasService } from '@components/mantenimiento/administracion/provinciadptopais/services-provincias/provincias.service';
import { PuntoventaService } from '../punto-venta/servicio-punto-venta/puntoventa.service';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  FormularioData: FormGroup;
  public codigo_cliente_catalogo: string;
  public codigo_cliente_catalogo_catalogo: number;

  fecha_actual = new Date();
  hora_actual = new Date();

  cliente: any = [];
  cliente_select = [];
  cliente_id: any = [];
  cliente_matriz: any = [];
  cliente_vivienda: any = [];
  planpago: any = [];
  moneda: any = [];
  vendedor: any = [];
  ruta: any = [];
  rubro_view: any = [];
  data: [];
  cliente_create: any = [];
  provincia_get: any = [];
  cod_pto_venta: any = [];
  rubro_recibido: any = [];

  public codrubro_get: any;
  public codplanpago_get: number = 0;
  public fapertura: any;
  public max_nits: any;
  public zona_recibido: any;
  public zona_recibido_codigo: any;

  dataform: any = '';
  userConn: any;

  isChecked = false;

  nombre_ventana: string = "abmvecliente.vb";
  public ventana = "Clientes";

  constructor(private _formBuilder: FormBuilder, private api: ApiService, public dialog: MatDialog,
    private spinner: NgxSpinnerService, public log_module: LogService, private datePipe: DatePipe, private messageService: MessageService,
    public servicioCliente: ServicioclienteService, public servicesPuntoVenta: PuntoventaService,
    public nombre_ventana_service: NombreVentanaService, public servicioRubro: ServiciorubroService,
    public servicioZona: ServiciozonaService, public provinciaService: ProvinciasService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.FormularioData = this.createForm();

    this.mandarNombre();
    this.getveplanPago();
    this.getVendedor();
    this.getAllmoneda();

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.rubro_view.rubro;

    this.provinciaService.disparadorDeProvincias.subscribe(data => {
      console.log("Recibiendo Provincia: ", data);
      this.provincia_get = data.pto_venta_view;
    });

    this.servicioZona.disparadorDeZonas.subscribe(data => {
      console.log("Recibiendo Zona: ", data);
      this.zona_recibido = data.zona;
      this.zona_recibido_codigo = data.zona.codigo;

      console.log(this.zona_recibido_codigo);
    });

    this.servicioRubro.disparadorDeRubro.subscribe(data => {
      console.log("Recibiendo Rubro: ", data);
      this.rubro_recibido = data.rubro;
      console.log(this.rubro_recibido);

    });

    this.servicesPuntoVenta.disparadorDePuntosVenta.subscribe(data => {
      console.log("Recibiendo Pto Venta: ", data);
      this.cod_pto_venta = data.punto_venta;
    });

    this.servicioCliente.disparadorDeClientes.subscribe(data => {
      console.log("Recibiendo Cliente: ", data);
      this.codigo_cliente_catalogo = data.cliente.cliente;
      this.codigo_cliente_catalogo_catalogo = data.cliente.codigo;

      console.log(this.codigo_cliente_catalogo_catalogo);

      this.getClienteByID(this.codigo_cliente_catalogo_catalogo);
      // this.getClienteByIDCasaMatriz(this.codigo_cliente_catalogo)
      // this.getRutaCliente(data.cliente);
    });
  }

  getVendedor() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/vevendedor/";
    return this.api.getAll('/seg_adm/mant/vevendedor/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.vendedor = datav;
          console.log(this.vendedor);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllmoneda() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getClienteByID(id) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET ";
    return this.api.getAll('/venta/mant/vecliente/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.cliente = datav;
          console.log("Cliente Data: ", this.cliente);
          this.cliente_id = this.cliente.cliente;
          this.fapertura = this.cliente.cliente.fapertura;

          this.codplanpago_get = this.cliente.cliente.codplanpago;
          this.codrubro_get = this.cliente.cliente.codrubro;
          this.cliente_vivienda = this.cliente.vivienda;

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

  getClienteByIDCasaMatriz(id) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET  /venta/mant/vecliente/getTipoSegunClientesIguales/";
    return this.api.getAll('/venta/mant/vecliente/getTipoSegunClientesIguales/' + this.userConn + "/" + id)
      .subscribe({
        next: (datav) => {
          this.cliente_matriz = datav;
          console.log("Cliente Matriz: ", this.cliente_matriz);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getveplanPago() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET en la ruta --parametros /venta/mant/veplanpago/";
    return this.api.getAll('/venta/mant/veplanpago/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.planpago = datav;
          // console.log('adempresa', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getRutaCliente(cliente) {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET en la ruta --parametros /venta/mant/veplanpago/";
    return this.api.getAll('/venta/mant/vecliente/mostrar_rutas/' + this.userConn + "/" + cliente)
      .subscribe({
        next: (datav) => {
          this.ruta = datav;
          console.log('rutas', datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  limpiar() {
    this.cliente_id.codigo = "";
    this.cliente_id.nombre_comercial = "";
    this.cliente_id.razonsocial = "";
    this.cliente_id.tipo_docid = "";
    this.cliente_id.nit = "";
    this.cliente_id.complemento_ci = "";
    this.cliente_id.codplanpago = "";
    this.rubro_recibido = "";
    this.cliente_id.codrubro = "";
    this.cliente_id.casilla = "";
    this.cliente_id.email = "";
    this.cliente_id.obs = "";
    this.cliente_id.fapertura = "";
    this.zona_recibido_codigo = "";
    this.cliente_id.codzona = "";
    this.cliente_id.es_empresa = "";
    this.isChecked;
    this.cliente_id.casual = "";
    this.cliente_id.credito = "";
    this.cliente_id.creditodisp = "";
    this.cliente_id.codvendedor = "";
    this.cliente_id.garantia = "";
    this.cliente_id.habilitado = "";
    this.cliente_id.tipoventa = "";
    this.cliente_id.codplanpago = "";
    this.cliente_id.tipo = "";
    this.cliente_id.clasificacion = "";
    this.cliente_id.cartera = "";
    this.cliente_id.cliente_pertec = "";
    this.cliente_id.max_nits = "";
    this.cliente_id.controla_empaque_cerrado = "";
    this.cliente_id.controla_precios = "";
    this.cliente_id.controla_maximo = "";
    this.cliente_id.situacion = "";
    this.cliente_id.solo_pp = "";
    this.cliente_id.contra_entrega = "";
    this.cliente_id.visitas_x_mes = "";
    this.cliente_id.maximo_vta = "";
    this.cliente_vivienda.codptoventa = "";
    this.cod_pto_venta.descripcion = "";
    this.cod_pto_venta.codprovincia = "";
    this.cliente_vivienda.direccion = "";
    this.cliente_vivienda.aclaracion_direccion = "";
    this.cliente_vivienda.nomb_telf1 = "";
    this.cliente_vivienda.nomb_telf2 = "";
    this.cliente_vivienda.celular = "";
    this.cliente_vivienda.celular_2 = "";
    this.cliente_vivienda.celular_3 = "";
    this.cliente_vivienda.nomb_whatsapp = "";
    this.cliente_vivienda.email = "";
    this.cliente_vivienda.latitud = "";
    this.cliente_vivienda.longitud = "";
    this.cliente_vivienda.obs = "";
    this.cliente_id.nropoder = "";
    this.cliente_id.nombre_contrato = "";
    this.cliente_id.nit = "";
    this.cliente_id.ciudad_titular = "";
    this.cliente_id.zona_titular = "";
    this.cliente_id.direccion_titular = "";
    this.cliente_id.refdireccion_titular = "";
    this.cliente_id.telefono_titular = "";
    this.cliente_id.celular_titular = "";
    this.cliente_id.latitud_titular = "";
    this.cliente_id.longitud_titular = "";
    this.cliente_id.obs_titular = "";
  }

  createForm(): FormGroup {
    let usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;
    let year = this.hora_actual.getFullYear;

    return this._formBuilder.group({
      //codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      nombre_comercial: [this.dataform.nombre_comercial, Validators.compose([Validators.required])],
      razonsocial: [this.dataform.razonsocial, Validators.compose([Validators.required])],
      tipo_docid: [this.dataform.tipo_docid, Validators.compose([Validators.required])],
      nit: [this.dataform.nit, Validators.compose([Validators.required])],
      // complemento_ci: [this.dataform.complemento_ci === undefined ? "0" : this.dataform.complemento_ci],
      complemento_ci: 0,

      codrubro: [this.dataform.codrubro],
      casilla: [this.dataform.casilla],
      email: [this.dataform.email],
      codzona: [this.dataform.codzona === undefined ? "" : this.dataform.codzona],
      obs: [this.dataform.obs],
      fapertura: [this.dataform.fapertura, Validators.compose([Validators.required])],
      zona_titular: [this.dataform.zona_titular],
      es_empresa: [this.dataform.es_empresa],
      codplanpago: [this.dataform.codplanpago],

      codvendedor: [Number(this.dataform.codvendedor), Validators.compose([Validators.required])],
      garantia: [this.dataform.garantia],
      habilitado: [true],
      tipoventa: [0],
      moneda: [this.dataform.moneda, Validators.compose([Validators.required])],
      tipo: [this.dataform.tipo],
      clasificacion: [this.dataform.clasificacion],
      cartera: [this.dataform.cartera],
      cliente_pertec: [this.dataform.cliente_pertec],

      controla_empaque_cerrado: [this.dataform.controla_empaque_cerrado],
      controla_precios: [this.dataform.controla_precios],
      controla_maximo: [this.dataform.controla_maximo],
      situacion: [this.dataform.situacion === undefined ? "0" : this.dataform.situacion],
      solo_pp: [this.dataform.solo_pp],
      contra_entrega: [this.dataform.contra_entrega],
      nropoder: [this.dataform.nropoder],
      nombre_contrato: [this.dataform.nombre_contrato],
      nit_titular: [this.dataform.nit_titular],
      ciudad_titular: [this.dataform.ciudad_titular],
      direccion_titular: [this.dataform.direccion_titular],
      refdireccion_titular: [this.dataform.refdireccion_titular],
      telefono_titular: [this.dataform.telefono_titular],
      celular_titular: [this.dataform.celular_titular],
      latitud_titular: [this.dataform.latitud_titular],
      longitud_titular: [this.dataform.longitud_titular],
      obs_titular: [this.dataform.obs_titular],
      credito: [0],
      creditodisp: [0],
      max_nits: [this.dataform.max_nits === undefined ? 0 : this.dataform.max_nits],
      visitas_x_mes: [this.dataform.visitas_x_mes === undefined ? 1 : 1],
      maximo_vta: [this.dataform.maximo_vta === undefined ? 0 : 0],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [usuario_logueado],

      //elemenetos que no estan ya no el forulario pero en el SIA si, se les coloca data por defecto para
      //poder crear al cliente
      tiponotacredito: [""],
      condicion: [""],
      codtipo_identidad: [""],
      codlocalidad: [""],
      nroingresosbrutos: [""],
      tipofactura: [""],
      codmoneda_maximo_vta: [""],
      ci_contrato: [""],
      ci: [""],
      nombre_fact: [""],
      nit_fact: [""],
      ruta: [""],
      ruta1: [""],
      motivo_excepcion_clien_final: [""],

      iva: [0],
      codvendedor_asignado: [0],
      dias_reversion_items_especiales: [0],
      porcentaje_limite_descto_deposito: [0],
      tipo_personeria_cliente_final: [0],
      coddsctos_credito: [0],
      fvenccred: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],

      discrimina_iva: [true],
      permite_items_repetidos: [true],
      es_cliente_final: [true],
      controla_empaque_minimo: [true],
      controla_monto_minimo: [true],
      permitir_vta_rango_mediomay: [true],
      permitir_vta_rango_minorista: [true],
      imprimir_tdc: [true],
      casual: [true],
      permite_desc_caja_cerrada: [true],

      // "fvenccred": "2023-12-12T21:55:06.594Z",
    });
  }

  submitData() {
    let ventana = "cliente-create"
    let detalle = "cliente-detalle";
    let tipo = "transaccion-cliente-POST";


    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/vecliente/";
    console.log(data);

    return this.api.create("/venta/mant/vecliente/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.cliente_create = datav;
          this.log_module.guardarLog(ventana, detalle, tipo, "", "");
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'GUARDADO CON EXITO !' })
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO SE GUARDO !' });
        },
        complete: () => { }
      })
  }

  actualizarDatosTienda() {

  }

  editarCliente() {
    let ventana = "cliente-update"
    let detalle = "cliente-detalle";
    let tipo = "transaccion-cliente-UPDATE";

    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/vecliente/";
    console.log(data);

    return this.api.update("/venta/mant/vecliente/" + this.userConn + "/" + this.cliente_id.codigo, data)
      .subscribe({
        next: (datav) => {
          this.cliente_create = datav;
          this.log_module.guardarLog(ventana, detalle, tipo, "", "");

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 0);
          this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'ACTUALIZADO CON EXITO' })
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar(element): void {
    let ventana = "cliente"
    let detalle = "cliente-delete";
    let tipo = "cliente-DELETE";

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/vecliente/' + this.userConn + "/" + element)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");
              this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! ELIMINADO EXITOSAMENTE !' })
              location.reload();
            },
            error: (err: any) => {
              console.log(err, errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO !' });
      }
    });
  }

  modalClientes(): void {
    this.dialog.open(ModalClienteComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        ventana: "ventana_catalogo"
      }
    });
  }

  modalCatalogoZonas(): void {
    this.dialog.open(ModalZonaComponent, {
      width: 'auto',
      height: 'auto',
      // maxWidth: '90vw',
      // id:'modal-matriz',
      // position:{right:'5px', top: '5px', left:'80px', bottom: '2.5px'},
    });
  }

  openDialogCatalogo(): void {
    this.dialog.open(ModalRubroComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  modalCatalogoPuntoVenta() {
    this.dialog.open(CatalogoPuntoVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modificarClienteFinalCasual() {
    let data;
    let ventana = "ClienteFinalCasual-UPDATE";
    let detalle = "ClienteFinalCasual";
    let tipo = "ModificacionClienteFinalCasual-UPDATE";

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-  /venta/mant/vecliente/clienteCasual/ Update";

    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: this.cliente_id.codigo,
        dataB: this.cliente_id.nombre_comercial,
        dataPermiso: "79 - CREACION Y MODIFICACION DE DATOS DE CLIENTES",
        dataCodigoPermiso: "79",
        abrir: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (!result) {
        return this.api.update('/venta/mant/vecliente/clienteCasual/' + this.userConn + "/" + this.cliente_id.codigo + "/" + "false", data)
          .subscribe({
            next: (datav) => {
              console.log(datav);
              if (datav == 206) {
                this.log_module.guardarLog(ventana, detalle, tipo, "", "");
                this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! ACTUALIZADO EXITOSAMENTE !' })
                location.reload();
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO ACTUALIZADO RUTA !' });
              }
            },

            error: (err: any) => {
              console.log(err, errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO CLIENTE !' });
      }
    });
  }

  modificarClienteFinalCasualFalse() {
    let data;
    let ventana = "ClienteFinalCasual-UPDATE";
    let detalle = "ClienteFinalCasual";
    let tipo = "ModificacionClienteFinalCasual-UPDATE";

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-  /venta/mant/vecliente/clienteCasual/ Update";

    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: this.cliente_id.codigo,
        dataB: this.cliente_id.nombre_comercial,
        dataPermiso: "79 - CREACION Y MODIFICACION DE DATOS DE CLIENTES",
        dataCodigoPermiso: "79",
        abrir: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (!result) {
        return this.api.update('/venta/mant/vecliente/clienteCasual/' + this.userConn + "/" + this.cliente_id.codigo + "/" + "true", data)
          .subscribe({
            next: (datav) => {
              console.log(datav);
              if (datav == 206) {
                this.log_module.guardarLog(ventana, detalle, tipo, "", "");
                this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '! ACTUALIZADO EXITOSAMENTE !' })
                location.reload();
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: '! NO ACTUALIZADO !' });
              }
            },

            error: (err: any) => {
              console.log(err, errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: '! CANCELADO CLIENTE !' });
      }
    });
  }
}

