import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DescuentoService } from '../serviciodescuento/descuento.service';
import { DecimalPipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-desct-extras',
  templateUrl: './modal-desct-extras.component.html',
  styleUrls: ['./modal-desct-extras.component.scss']
})
export class ModalDesctExtrasComponent implements OnInit {

  tarifaPrincipal: any = [];
  descuento_segun_tarifa: any = [];
  BD_storage: any = [];

  validacion_bool_descuento: any = [];
  info_descuento_peso_minimo: any;
  info_descuento_porcentaje: any;
  validarBtnAnadir: any = false;
  agenciaLogueado: any;
  cod_moneda_get: any;
  recargos_del_total_get: any;
  userConn: any;

  items_de_proforma: any = [];
  veproforma_get: any = [];
  cabecera_proforma: any = [];
  info_descuento: any = [];
  array_de_descuentos: any[] = [];
  tablaanticiposProforma: any = [];
  array_cabe_cuerpo_get: any = [];
  resultado_validacion: any = [];
  array_valida_detalle: any = [];
  detalleItemsProf_get: any = [];
  recargos_array_get: any = [];
  map_table: any = [];
  cmtipo_complementopf_get: any;
  cliente_real_get: any;
  array_de_descuentos_con_descuentos: any = [];

  contra_entrega_get: any;
  displayedColumns = ['codigo', 'descripcion', 'porcen', 'monto_doc', 'moneda', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();
  decimalPipe: any;

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalDesctExtrasComponent>, private messageService: MessageService,
    public descuento_services: DescuentoService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public cabecera: any, @Inject(MAT_DIALOG_DATA) public array_cabe_cuerpo: any,
    @Inject(MAT_DIALOG_DATA) public desct: any, @Inject(MAT_DIALOG_DATA) public recargos_del_total: any,
    @Inject(MAT_DIALOG_DATA) public contra_entrega: any, @Inject(MAT_DIALOG_DATA) public cod_moneda: any,
    @Inject(MAT_DIALOG_DATA) public recargos_array: any, @Inject(MAT_DIALOG_DATA) public array_de_descuentos_ya_agregados_a_modal: any,
    @Inject(MAT_DIALOG_DATA) public cmtipo_complementopf: any, @Inject(MAT_DIALOG_DATA) public cliente_real: any,
    @Inject(MAT_DIALOG_DATA) public detalleAnticipos: any) {

    this.items_de_proforma = items.items;
    this.cabecera_proforma = cabecera.cabecera;
    this.recargos_del_total_get = recargos_del_total.recargos_del_total;
    this.array_cabe_cuerpo_get = array_cabe_cuerpo.array_cabe_cuerpo;
    this.contra_entrega_get = contra_entrega.contra_entrega;
    this.cod_moneda_get = cod_moneda.cod_moneda;
    this.recargos_array_get = recargos_array.recargos_array;
    this.cmtipo_complementopf_get = cmtipo_complementopf.cmtipo_complementopf;
    this.cliente_real_get = cliente_real.cliente_real;
    this.array_de_descuentos = array_de_descuentos_ya_agregados_a_modal.array_de_descuentos_ya_agregados_a_modal
    this.tablaanticiposProforma = detalleAnticipos.detalleAnticipos

    //aca llega los descuentos q ya pusiste, esto se pinta en la su tabla
    console.log(this.recargos_array_get, this.array_de_descuentos);
    console.log(this.contra_entrega_get);

    // this.array_de_descuentos = this.array_de_descuentos.map(element => ({
    //   codigo: element.coddesextra,
    //   descripcion: element.descripcion === undefined ? element.descrip : element.descripcion,
    //   porcentaje: element.porcen,
    // }))
    this.array_de_descuentos === undefined ? [] : this.array_de_descuentos;
    this.array_de_descuentos = this.array_de_descuentos?.map((element) => ({
      aplicacion: element.aplicacion,
      codanticipo: element.codanticipo,
      codcobranza: element.codcobranza,
      codcobranza_contado: element.codcobranza_contado,
      coddesextra: element.coddesextra,
      codmoneda: element.codmoneda,
      codproforma: element.codproforma,
      id: element.id,
      montodoc: element.montodoc,
      montorest: element.montorest,
      codigo: element.coddesextra,
      descripcion: element.descrip,
      porcentaje: element.porcen,
    }));

    this.dataSource = new MatTableDataSource(this.array_de_descuentos);

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.agenciaLogueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
  }

  ngOnInit() {
    this.decimalPipe = new DecimalPipe('en-US');
    this.getPrecioInicial();
  }

  precio_input: any;

  getPrecioInicial() {
    // this.items_de_proforma = this.items_de_proforma.map((element) => ({
    //   ...element,
    //   cumple: element.cumple === 1 ? true : false,
    // }));

    let array_post = {
      tabladetalle: this.items_de_proforma,
      dvta: this.cabecera_proforma,
    };

    console.log("🚀 ~ ModalDesctExtrasComponent ~ getPrecioInicial ~ array_post:", array_post)
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          console.log("🚀 ~ ModalDesctExtrasComponent ~ getPrecioInicial ~ datav:", datav)
          this.tarifaPrincipal = datav;
          this.precio_input = datav.codTarifa;

          this.descuentoExtraSegunTarifa(this.tarifaPrincipal.codTarifa);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      })
  }

  descuentoExtraSegunTarifa(cod_tarifa) {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedesextra/getvedesextrafromTarifa/"
    return this.api.getAll('/venta/mant/vedesextra/getvedesextrafromTarifa/' + this.userConn + "/" + cod_tarifa)
      .subscribe({
        next: (datav) => {
          this.descuento_segun_tarifa = datav;
          //console.log(this.descuento_segun_tarifa);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      })
  }

  infoDescuento(descuento) {
    console.log(descuento);
    this.spinner.show();

    if (!descuento) {
      // Evitar hacer la petición si no se seleccionó ninguna opción
      return;
    }

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/mant/vedesextra/"
    this.api.getAll('/venta/mant/vedesextra/' + this.userConn + "/" + descuento)
      .subscribe({
        next: (datav) => {
          this.info_descuento = datav;
          console.log(this.info_descuento);
          // this.validarDescuento();

          [this.info_descuento].map((element) => ({
            ...element,
            codigo: element.codigo,
            descripcion: element.descripcion,
            porcentaje: this.info_descuento_porcentaje,
          }));

          this.info_descuento_peso_minimo = this.info_descuento.peso_minimo;
          this.info_descuento_porcentaje = this.info_descuento_porcentaje;

          setTimeout(() => {
            this.spinner.hide();
          }, 250);
        },
        error: (err: any) => {
          console.log(err, errorMessage);

          setTimeout(() => {
            this.spinner.hide();
          }, 250);
        },
        complete: () => { }
      });
  }


  // 1ro VALIDAR DESCUENTOS
  validarDescuento() {
    // this.array_de_descuentos?.map(element => ({
    //   codigo: element.codigo,
    //   descripcion: element.descripcion,
    //   porcentaje: this.info_descuento_porcentaje,
    // }));

    // console.log(this.array_valida_detalle);

    let a = [{
      codigo: this.info_descuento.codigo,
      codproforma: 0,
      coddesextra: this.info_descuento.codigo,
      porcen: this.info_descuento.porcentaje,
      porcentaje: this.info_descuento.porcentaje,
      montodoc: this.info_descuento_peso_minimo === undefined ? 0 : this.info_descuento_peso_minimo,
      codcobranza: 0,
      codcobranza_contado: 0,
      codanticipo: 0,
      id: 0,
      descripcion: this.info_descuento.descripcion,
      descrip: this.info_descuento.descripcion,
      codmoneda: this.cabecera_proforma.codmoneda,
    }];
    console.log("🚀 ~ ModalDesctExtrasComponent ~ validarDescuento ~ arrayQueSeAgrega:", a)


    let ucr;
    if (this.cabecera_proforma.tipopago === 0) {
      ucr = "CONTADO";
    } else {
      // this.cabecera_proforma.tipopago = "CONTADO";
      ucr = "CREDITO";
    }

    if (this.array_de_descuentos === undefined) {
      this.array_de_descuentos = [];
    }

    // si es true anadir a tabla temporal
    // ESTO EN EL BOTON DE ANADIR
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/validaAddDescExtraProf/"
    return this.api.create('/venta/transac/veproforma/validaAddDescExtraProf/' + this.userConn + "/" + this.info_descuento.codigo +
      "/" + this.info_descuento.descorta + "/" + this.cabecera_proforma.codcliente + "/" + this.cabecera_proforma.codcliente_real +
      "/" + this.BD_storage + "/" + ucr + "/" + this.contra_entrega_get + "/" + this.precio_input, this.array_de_descuentos)
      .subscribe({
        next: (datav) => {
          this.validacion_bool_descuento = datav;
          console.log(this.validacion_bool_descuento);
          console.log("🚀 ~ ModalDesctExtrasComponent ~ validarDescuento ~ this.array_de_descuentos:", this.array_de_descuentos);

          // si sale false no se puede agregar tonces solo sale el mensaje de error
          if (datav.status === false) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: datav.resp });
          }

          // si sale true SI se puede agregar porq la validacion asi lo permite
          if (datav.status === true) {
            let tamanio = this.array_de_descuentos_con_descuentos.length;

            const existe_en_array = this.array_de_descuentos?.some(item => item.codigo === this.info_descuento.codigo);

            console.log("entro acaaaaa don cangrejo! 🦐");
            console.log("🚀 ~ ModalDesctExtrasComponent ~ validarDescuento ~ existe_en_array:", existe_en_array)
            console.log("arrayValida:", this.array_valida_detalle, "arrayDEESCT: ", this.array_de_descuentos, tamanio);

            if (existe_en_array) {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL DESCUENTO YA ESTA AGREGADO' });
            } else {
              if (tamanio === 0) {
                // Si el array está vacío, simplemente agregamos los nuevos elementos
                this.array_de_descuentos.push(...a);
              } else {
                // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
                this.array_de_descuentos = this.array_de_descuentos.concat(a);
              }

              this.messageService.add({ severity: 'info', summary: 'Informacion', detail: "Descuento Agregado" + this.validacion_bool_descuento.resp });
              return this.dataSource = new MatTableDataSource(this.array_de_descuentos);
            }
          }
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ERROR AGREGAR EL DESCUENTO' });
        },
        complete: () => { }
      })
  }

  // 2do UNA VEZ VALIDADO RECIEN AGREGAR
  // anadirArray() {
  //   this.array_de_descuentos === undefined ? []:this.array_de_descuentos;
  //   let tamanio = this.array_de_descuentos_con_descuentos.length;
  //   const existe_en_array = this.array_de_descuentos?.some(item => item.codigo === this.info_descuento.codigo);
  //   console.log("🚀 ~ ModalDesctExtrasComponent ~ anadirArray ~ array_de_descuentos:", this.array_de_descuentos, this.info_descuento.codigo)
  //   console.log(existe_en_array);

  //   this.array_de_descuentos = this.array_de_descuentos_con_descuentos?.map((element) => ({
  //     aplicacion: element.aplicacion,
  //     codanticipo: element.codanticipo,
  //     codcobranza: element.codcobranza,
  //     codcobranza_contado: element.codcobranza_contado,
  //     coddesextra: element.coddesextra,
  //     codmoneda: element.codmoneda,
  //     codproforma: element.codproforma,
  //     id: element.id,
  //     montodoc: element.montodoc,
  //     montorest: element.montorest,
  //     codigo: element.coddesextra,
  //     descripcion: element.descripcion,
  //     porcentaje: element.porcen,
  //   }))

  //   if (this.info_descuento.codigo === 74 && this.cabecera_proforma.tipopago === 1) {
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La Proforma es de tipo pago CREDITO lo cual no esta permitido para este descuento' });
  //     setTimeout(() => {
  //       this.spinner.hide();
  //     }, 50);
  //     return;
  //   }

  //   if (this.info_descuento) {
  //     if (existe_en_array) {
  //       this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL DESCUENTO YA ESTA AGREGADO' });
  //     } else {

  //       this.validarDescuento();
  //       // if (tamanio > 0) {
  //       //   console.log("HAY DESCUENTO EN EL ARRAY LA CARGA SE CONCATENA");
  //       //   // Usar concat para agregar el nuevo descuento al array existente
  //       //   if (this.validacion_bool_descuento.status === true) {
  //       //     // Concatenar el nuevo descuento con los descuentos existentes
  //       //     this.array_de_descuentos = this.array_de_descuentos.concat([this.info_descuento]);

  //       //   } else {
  //       //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO VALIDO PARA SER AGREGADO' });
  //       //   }
  //       // } else {
  //       //   console.log("NO HAY DESCUENTO EN EL ARRAY LA CARGA NO SE CONCATENA");

  //       //   // Inicializa el array si es undefined
  //       //   this.array_de_descuentos = this.array_de_descuentos || [];
  //       //   this.info_descuento = [this.info_descuento].map((element)=>({
  //       //     ...element,
  //       //   }));

  //       //   // Usar push para agregar el elemento directamente al array
  //       //   this.array_de_descuentos.push(this.info_descuento[0]);
  //       // }
  //     }
  //   }
  //   // this.dataSource = new MatTableDataSource(this.array_de_descuentos);
  //   console.log(this.array_de_descuentos, tamanio);
  // }

  eliminarDesct(codigo) {
    this.array_valida_detalle = this.array_valida_detalle.filter(item => item.codigo !== this.array_valida_detalle.coddesextra);
    this.array_de_descuentos = this.array_de_descuentos.filter(item => item.codigo !== codigo);
    console.log(this.array_de_descuentos, this.array_valida_detalle);

    this.dataSource = new MatTableDataSource(this.array_de_descuentos);
  }

  sendArrayDescuentos() {
    console.warn(this.array_de_descuentos);

    //mapeo para tabladescuentos
    this.array_de_descuentos = this.array_de_descuentos?.map((element) => ({
      ...element,
      coddesextra: element.codigo,
      aplicacion: element.aplicacion,
      montodoc: element.montodoc,
      codigo: element.codigo,
      descrip: element.descripcion,
      descripcion: element.descripcion,
      porcen: element.porcentaje,
    }));

    let total_proforma_concat = {
      veproforma: this.cabecera_proforma, //este es el valor de todo el formulario de proforma
      detalleItemsProf: this.items_de_proforma, //este es el carrito con las items
      tablarecargos: [{
        "codproforma": 0,
        "codrecargo": 0,
        "porcen": 0,
        "monto": 0,
        "moneda": "",
        "montodoc": 0,
        "codcobranza": 0,
        "descrip": ""
      }],
      tabladescuentos: this.array_de_descuentos, //array de descuentos
      tablaanticiposProforma: this.tablaanticiposProforma,
    }
    console.log("🚀 ~ ModalDesctExtrasComponent ~ sendArrayDescuentos ~ total_proforma_concat:", total_proforma_concat)


    // if (this.disableSelect.value === false) {
    //   this.complementopf = 0;
    // } else {
    //   this.complementopf = 1;
    // }

    this.array_cabe_cuerpo_get
    console.log(this.array_cabe_cuerpo_get);

    //al darle al boton OK tiene consultar al backend validando los recargos y re calculando los total, subtotal.
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/recarcularDescuentos/"
    this.api.create('/venta/transac/veproforma/recarcularDescuentos/' + this.userConn + "/" + this.BD_storage + "/" +
      this.recargos_del_total_get + "/" + this.cmtipo_complementopf_get + "/" + this.cliente_real_get, total_proforma_concat)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.resultado_validacion = datav
          console.log("array original como llega: ", datav);

          // this.resultado_validacion = datav.map((element) => ({
          //   ...element,
          //   tablaanticiposProforma: this.tablaanticiposProforma,
          // }));



          console.warn("arraya de descuentos mapeados despies de volver del backend:", this.resultado_validacion)
          this.servicioEnviarAProforma(this.resultado_validacion);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });
    this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '¡ DESCUENTO AGREGADOS EXITOSAMENTE Y VALIDADO !' })
    this.close();
  }

  servicioEnviarAProforma(resultado_validacion) {
    this.descuento_services.disparadorDeDescuentosDelModalTotalDescuentos.emit({
      desct_proforma: this.array_de_descuentos,
      resultado_validacion: resultado_validacion,
      tabla_descuento: resultado_validacion.tablaDescuentos,
    });
  }

  cambiarPorcentaje(newValue: number) {
    if (newValue) {
      this.info_descuento_porcentaje = 0;
    }
  }

  calcularMonto(porcentaje, peso_minimo) {
    console.log(porcentaje, peso_minimo);
  }

  close() {
    this.dialogRef.close();
  }
}
