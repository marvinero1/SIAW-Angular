import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DescuentoService } from '../serviciodescuento/descuento.service';
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
  array_de_descuentos: any = [];
  array_cabe_cuerpo_get: any = [];
  resultado_validacion: any = [];
  array_valida_detalle: any = [];
  detalleItemsProf_get: any = [];
  recargos_array_get: any = [];
  map_table: any = [];
  cmtipo_complementopf_get: any;
  array_de_descuentos_con_descuentos: any = [];

  contra_entrega_get: any;
  displayedColumns = ['codigo', 'descripcion', 'porcen', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalDesctExtrasComponent>, private toastr: ToastrService,
    public descuento_services: DescuentoService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public cabecera: any, @Inject(MAT_DIALOG_DATA) public array_cabe_cuerpo: any,
    @Inject(MAT_DIALOG_DATA) public desct: any, @Inject(MAT_DIALOG_DATA) public recargos_del_total: any,
    @Inject(MAT_DIALOG_DATA) public contra_entrega: any, @Inject(MAT_DIALOG_DATA) public cod_moneda: any,
    @Inject(MAT_DIALOG_DATA) public recargos_array: any, @Inject(MAT_DIALOG_DATA) public array_de_descuentos_ya_agregados_a_modal: any,
    @Inject(MAT_DIALOG_DATA) public cmtipo_complementopf: any) {

    this.items_de_proforma = items.items;
    this.cabecera_proforma = cabecera.cabecera;
    this.recargos_del_total_get = recargos_del_total.recargos_del_total;
    this.array_cabe_cuerpo_get = array_cabe_cuerpo.array_cabe_cuerpo
    this.contra_entrega_get = contra_entrega.contra_entrega === undefined ? false : true;
    this.cod_moneda_get = cod_moneda.cod_moneda;
    this.recargos_array_get = recargos_array.recargos_array
    this.cmtipo_complementopf_get = cmtipo_complementopf.cmtipo_complementopf;
    this.array_de_descuentos;

    //aca llega los descuentos q ya pusiste, esto se pinta en la su tabla
    console.log(this.recargos_array_get,
      this.array_de_descuentos,
      array_de_descuentos_ya_agregados_a_modal.array_de_descuentos_ya_agregados_a_modal);

    this.array_de_descuentos = this.map_table = array_de_descuentos_ya_agregados_a_modal.array_de_descuentos_ya_agregados_a_modal.map(element => ({
      codigo: element.coddesextra,
      descripcion: element.descripcion === undefined ? element.descrip : element.descripcion,
      porcentaje: element.porcen,
    }))

    this.dataSource = new MatTableDataSource(this.map_table);
    console.log(this.contra_entrega_get);
    console.log("Array de descuentos que ya estaban: ", JSON.stringify(this.array_de_descuentos));

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.agenciaLogueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
  }

  ngOnInit() {
    this.getPrecioInicial();
  }

  getPrecioInicial() {
    let array_post = {
      tabladetalle: this.items_de_proforma,
      dvta: this.cabecera_proforma,
    };

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          this.tarifaPrincipal = datav;
          console.log(this.tarifaPrincipal);

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

          let array_mapeado = [this.info_descuento].map(element => ({
            codigo: element.codigo,
            descripcion: element.descripcion,
            porcentaje: this.info_descuento_porcentaje,
          }));

          this.info_descuento_peso_minimo = this.info_descuento.peso_minimo;
          this.info_descuento_porcentaje = this.info_descuento.porcentaje;

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        error: (err: any) => {
          console.log(err, errorMessage);

          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },
        complete: () => { }
      });
  }

  anadirArray() {
    let tamanio = this.array_de_descuentos_con_descuentos.length;
    const existe_en_array = this.array_de_descuentos.some(item => item.codigo === this.info_descuento.codigo);
    console.log(existe_en_array);

    if (this.info_descuento) {
      if (existe_en_array) {
        this.toastr.warning("EL DESCUENTO YA ESTA AGREGADO")
      } else {
        this.validarDescuento();
        if (tamanio > 0) {
          console.log("HAY DESCUENTO EN EL ARRAY LA CARGA SE CONCATENA");
          // Usar concat para agregar el nuevo descuento al array existente
          if (this.validacion_bool_descuento.status === true) {
            // Concatenar el nuevo descuento con los descuentos existentes
            this.array_de_descuentos = this.array_de_descuentos.concat([this.info_descuento]);
          } else {
            this.toastr.error("NO VALIDO PARA SER AGREGADO");
          }
        } else {
          console.log("NO HAY DESCUENTO EN EL ARRAY LA CARGA NO SE CONCATENA");
          // Usar push para agregar el elemento directamente al array
          this.array_de_descuentos.push(this.info_descuento);
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.array_de_descuentos);
    console.log(this.array_de_descuentos, tamanio);
  }

  validarDescuento() {
    let array_mapeado = this.array_de_descuentos.map(element => ({
      codigo: element.codigo,
      descripcion: element.descripcion,
      porcentaje: this.info_descuento_porcentaje,
    }));


    //codproforma: this.cabecera_proforma.numeroid,
    //codanticipo: this.cabecera_proforma.idanticipo == "" ? 0 : this.cabecera_proforma.idanticipo,
    console.log(this.array_valida_detalle);

    let a = [{
      codproforma: 0,
      coddesextra: this.info_descuento.codigo,
      porcen: this.info_descuento.porcentaje,
      montodoc: this.info_descuento_peso_minimo === undefined ? 0 : this.info_descuento_peso_minimo,
      codcobranza: 0,
      codcobranza_contado: 0,
      codanticipo: 0,
      id: 0,
    }];
    console.log(a);

    let ucr;

    if (this.cabecera_proforma.tipopago === 0) {
      ucr = "CREDITO";
    } else {
      // this.cabecera_proforma.tipopago = "CONTADO";
      ucr = "CONTADO";
    }

    //si es true anadir a tabla temporal
    //ESTO EN EL BOTON DE ANADIR
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/validaAddDescExtraProf/"
    return this.api.create('/venta/transac/veproforma/validaAddDescExtraProf/' + this.userConn + "/" + this.info_descuento.codigo + "/" + this.info_descuento.descorta + "/" + this.cabecera_proforma.codcliente + "/" + this.cabecera_proforma.codcliente_real + "/" + this.BD_storage.bd + "/" + ucr + "/" + this.contra_entrega_get, this.array_valida_detalle)
      .subscribe({
        next: (datav) => {
          this.validacion_bool_descuento = datav;
          console.log(this.validacion_bool_descuento);

          if (this.validacion_bool_descuento.status === false) {
            console.log("entro aca!");
            this.toastr.error(this.validacion_bool_descuento.resp);

            let tamanio = this.array_de_descuentos_con_descuentos.length;
            if (tamanio === 0) {
              // Si el array está vacío, simplemente agregamos los nuevos elementos
              this.array_valida_detalle.push(...a);
            } else {
              // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
              this.array_valida_detalle = this.array_valida_detalle.concat(a);
            }

            this.array_valida_detalle.pop();
            this.array_de_descuentos.pop();
            this.dataSource = new MatTableDataSource(this.array_de_descuentos);
            console.log(this.array_valida_detalle, tamanio);
            return;
          }

          if (this.validacion_bool_descuento.status === true) {
            console.log("entro acaaaaa!");
            let tamanio = this.array_de_descuentos_con_descuentos.length;

            if (tamanio === 0) {
              // Si el array está vacío, simplemente agregamos los nuevos elementos
              this.array_valida_detalle.push(...a);
            } else {
              // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
              this.array_valida_detalle = this.array_valida_detalle.concat(a);
            }
            console.log(this.array_valida_detalle, tamanio);
            //this.toastr.error(this.validacion_bool_descuento.resp);
            return;
          }
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error("NO SE PUEDE AGREGAR EL DESCUENTO");
        },
        complete: () => {
        }
      })
  }

  eliminarDesct(codigo) {
    console.log(codigo);

    this.array_valida_detalle = this.array_valida_detalle.filter(item => item.codigo !== this.array_valida_detalle.coddesextra);
    this.array_de_descuentos = this.array_de_descuentos.filter(item => item.codigo !== codigo);
    console.log(this.array_de_descuentos, this.array_valida_detalle);

    this.dataSource = new MatTableDataSource(this.array_de_descuentos);
  }

  sendArrayDescuentos() {
    console.log(this.array_de_descuentos);

    //mapeo para tabladescuentos
    let array_de_descuentos_map_for_backend: any = [];
    array_de_descuentos_map_for_backend = this.array_de_descuentos.map(element => ({
      codproforma: 0,
      coddesextra: element.codigo,
      porcen: element.porcentaje,
      montodoc: 0,
      codcobranza: 0,
      codcobranza_contado: 0,
      codanticipo: 0,
      id: 0,
      aplicacion: element.aplicacion,
      codmoneda: this.cod_moneda_get,
      descrip: element.descripcion,
      total_dist: 0,
      total_desc: 0,
      montorest: 0
    }))

    let total_proforma_concat = {
      veproforma: this.cabecera_proforma, //este es el valor de todo el formulario de proforma
      detalleItemsProf: this.items_de_proforma, //este es el carrito con las items
      tablarecargos: [{
        "codproforma": 0,
        "codrecargo": 0,
        "porcen": 0,
        "monto": 0,
        "moneda": "string",
        "montodoc": 0,
        "codcobranza": 0,
        "descrip": "string"
      }], //array de recargos
      tabladescuentos: array_de_descuentos_map_for_backend, //array de iva
    }
    console.log(total_proforma_concat);

    // if (this.disableSelect.value === false) {
    //   this.complementopf = 0;
    // } else {
    //   this.complementopf = 1;
    // }

    this.array_cabe_cuerpo_get
    console.log(this.array_cabe_cuerpo_get);

    //al darle al boton OK tiene consultar al backend validando los recargos y re calculando los total, subtotal.
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/recarcularDescuentos/"
    this.api.create('/venta/transac/veproforma/recarcularDescuentos/' + this.userConn + "/" + this.BD_storage.bd + "/" +
      this.recargos_del_total_get + "/" + this.cmtipo_complementopf_get, total_proforma_concat)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.resultado_validacion = datav;
          this.servicioEnviarAProforma(datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });

    this.toastr.success("¡ DESCUENTO AGREGADOS EXITOSAMENTE Y VALIDADO !");

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
