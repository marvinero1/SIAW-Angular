import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DecimalPipe } from '@angular/common';
import { DescuentoService } from '@components/mantenimiento/ventas/serviciodescuento/descuento.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-descuentos-tienda',
  templateUrl: './modal-descuentos-tienda.component.html',
  styleUrls: ['./modal-descuentos-tienda.component.scss']
})
export class ModalDescuentosTiendaComponent implements OnInit {

  tarifaPrincipal: any = [];
  descuento_segun_tarifa: any = [];

  agenciaLogueado: any;
  userConn: any;
  BD_storage: any = [];

  validacion_bool_descuento: any = [];
  items_de_proforma: any = [];
  veproforma_get: any = [];
  cabecera_proforma: any = [];
  info_descuento: any = [];
  array_de_descuentos: any = [];
  tablaanticiposProforma: any = [];
  resultado_validacion: any = [];
  array_valida_detalle: any = [];
  detalleItemsProf_get: any = [];
  recargos_array_get: any = [];
  map_table: any = [];
  array_de_descuentos_con_descuentos: any = [];

  cmtipo_complementopf_get: any;
  cod_cliente: any;
  nit_cliente:any;
  contra_entrega_get: any;
  validarBtnAnadir: any = false;
  cod_moneda_get: any;
  recargos_del_total_get: any;

  // data desct elegido
  porcentaje:any;
  codigo_descuento:any;
  descrip_corta_desct:any;


  displayedColumns = ['codigo', 'descripcion', 'porcen', 'monto_doc', 'moneda', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();
  decimalPipe: any;

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalDescuentosTiendaComponent>, private messageService: MessageService,
    private spinner: NgxSpinnerService, public descuento_services:DescuentoService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    @Inject(MAT_DIALOG_DATA) public cabecera: any, 
    @Inject(MAT_DIALOG_DATA) public desct: any, @Inject(MAT_DIALOG_DATA) public recargos_del_total: any,
    @Inject(MAT_DIALOG_DATA) public contra_entrega: any, @Inject(MAT_DIALOG_DATA) public cod_moneda: any,
    @Inject(MAT_DIALOG_DATA) public recargos_array: any, @Inject(MAT_DIALOG_DATA) public array_de_descuentos_ya_agregados_a_modal: any,
    @Inject(MAT_DIALOG_DATA) public cmtipo_complementopf: any, @Inject(MAT_DIALOG_DATA) public codigo_cliente: any,
    @Inject(MAT_DIALOG_DATA) public detalleAnticipos: any, @Inject(MAT_DIALOG_DATA) public nit: any) {     
    
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.agenciaLogueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      
    this.cabecera_proforma = cabecera.cabecera;
    this.items_de_proforma = items.items;
    this.recargos_del_total_get = recargos_del_total.recargos_del_total;
    this.cod_moneda_get = cod_moneda.cod_moneda;
    this.recargos_array_get = recargos_array.recargos_array;
    this.cmtipo_complementopf_get = cmtipo_complementopf.cmtipo_complementopf;
    this.array_de_descuentos = array_de_descuentos_ya_agregados_a_modal.array_de_descuentos_ya_agregados_a_modal
    this.tablaanticiposProforma = detalleAnticipos.detalleAnticipos;
    this.contra_entrega_get = contra_entrega.contra_entrega;
    this.cod_cliente = codigo_cliente.codigo_cliente;
    this.nit_cliente = nit.nit;

    //aca llega los descuentos q ya pusiste, esto se pinta en la su tabla
    console.log("recargos array: " + this.recargos_array_get,
                "checkContraEntrega: " + this.contra_entrega_get,
                "ARRAY DE DESCT: " + JSON.stringify(this.array_de_descuentos));

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
  }

  ngOnInit() {
    this.decimalPipe = new DecimalPipe('en-US');
    this.getPrecioInicial();
  }

  getPrecioInicial(){
    let array_post = {

      tabladetalle: this.items_de_proforma,
      dvta: this.cabecera_proforma,
    };

    console.log("🚀 ~ ModalDescuentosTiendaComponent ~ getPrecioInicial ~ array_post:", array_post)
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.create('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn, array_post)
      .subscribe({
        next: (datav) => {
          // console.log("🚀 ~ ModalDesctExtrasComponent ~ getPrecioInicial ~ datav:", datav)
          this.tarifaPrincipal = datav;
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
          this.porcentaje = this.info_descuento.porcentaje;
          this.codigo_descuento = this.info_descuento.codigo;
          this.descrip_corta_desct = this.info_descuento.descorta;


          // let array_mapeado = [this.info_descuento].map((element) => ({
          //   ...element,
          //   codigo: element.codigo,
          //   descripcion: element.descripcion,
          //   porcentaje: this.info_descuento_porcentaje,
          // }));

          // this.info_descuento_peso_minimo = this.info_descuento.peso_minimo;
          // this.info_descuento_porcentaje = this.info_descuento_porcentaje;

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
        complete: () => { }
      });
  }

  anadirArray() {
    let tamanio = this.array_de_descuentos_con_descuentos.length;
    const existe_en_array = this.array_de_descuentos?.some(item => item.codigo === this.info_descuento.codigo);
    console.log(existe_en_array);

    if (this.info_descuento) {
      if (existe_en_array) {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'EL DESCUENTO YA ESTA AGREGADO' });
      } else {
        this.validarDescuento();
        if (tamanio > 0) {
          console.log("HAY DESCUENTO EN EL ARRAY LA CARGA SE CONCATENA");
          // Usar concat para agregar el nuevo descuento al array existente
          if (this.validacion_bool_descuento.status === true) {
            // Concatenar el nuevo descuento con los descuentos existentes
            this.array_de_descuentos = this.array_de_descuentos.concat([this.info_descuento]);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO VALIDO PARA SER AGREGADO' });
          }
        } else {
          console.log("NO HAY DESCUENTO EN EL ARRAY LA CARGA NO SE CONCATENA");
          // Inicializa el array si es undefined
          this.array_de_descuentos = this.array_de_descuentos || [];
          this.info_descuento = [this.info_descuento].map((element)=>({
            ...element,
          }));

          // Usar push para agregar el elemento directamente al array
          this.array_de_descuentos.push(this.info_descuento[0]);
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.array_de_descuentos);
    console.log(this.array_de_descuentos, tamanio);
  }

  validarDescuento() {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.agenciaLogueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      
    this.array_de_descuentos?.map(element => ({
      codigo: element.codigo,
      descripcion: element.descripcion,
      porcentaje: this.porcentaje,
    }));

    console.log(this.array_valida_detalle);

    let a = [{
      codproforma: 0,
      coddesextra: this.info_descuento.codigo,
      porcen: this.info_descuento.porcentaje,
      montodoc: this.porcentaje === undefined ? 0 : this.porcentaje,
      codcobranza: 0,
      codcobranza_contado: 0,
      codanticipo: 0,
      id: 0,
    }];
    console.log(a);

    let ucr;

    if (this.cabecera_proforma.tipopago === 0) {
      ucr = "CONTADO";
    } else {
      // this.cabecera_proforma.tipopago = "CONTADO";
      ucr = "CREDITO";
    }

    //si es true anadir a tabla temporal
    //ESTO EN EL BOTON DE ANADIR
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/validaAddDescExtraProf/"
    return this.api.create('/venta/transac/veproforma/validaAddDescExtraProf/' + this.userConn + "/" + this.info_descuento.codigo + 
      "/" + this.info_descuento.descorta + "/" + this.cabecera_proforma.codcliente + "/" + this.cabecera_proforma.codcliente +
       "/" + this.BD_storage + "/" + ucr + "/" + this.contra_entrega_get, this.array_valida_detalle)
      .subscribe({
        next: (datav) => {
          this.validacion_bool_descuento = datav;
          console.log(this.validacion_bool_descuento);

          if (this.validacion_bool_descuento.status === false) {
            console.log("entro aca!");
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.validacion_bool_descuento.resp });

            let tamanio = this.array_de_descuentos_con_descuentos.length;
            if (tamanio === 0) {
              // Si el array está vacío, simplemente agregamos los nuevos elementos
              this.array_valida_detalle.push(...a);
            } else {
              // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
              this.array_valida_detalle = this.array_valida_detalle.push(...a);
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
            return;
          }
        },
        error: (err: any) => {
          console.log(err, errorMessage);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO SE PUEDE AGREGAR EL DESCUENTO' });
        },
        complete: () => { }
      })
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
      detalleItems: this.items_de_proforma, //este es el carrito con las items
      recargosTabla: [],
      descuentosTabla: this.array_de_descuentos, //array de descuentos
    }
    console.log("🚀 ~ ModalDesctExtrasComponent ~ sendArrayDescuentos ~ total_proforma_concat:", total_proforma_concat)

    //al darle al boton OK tiene consultar al backend validando los recargos y re calculando los total, subtotal.
    let errorMessage = "La Ruta presenta fallos al hacer peticion POST -/venta/transac/docvefacturamos_cufd/recarcularDescuentosFact/"
    this.api.create('/venta/transac/docvefacturamos_cufd/recarcularDescuentosFact/' + this.userConn + "/" + this.BD_storage + "/" +
      this.recargos_del_total_get + "/" +  this.cod_moneda_get + "/" + this.cod_cliente + "/" + this.nit_cliente, total_proforma_concat)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.resultado_validacion = datav;

          this.servicioEnviarAProforma(this.resultado_validacion);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      });

    this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: '¡ DESCUENTO AGREGADOS EXITOSAMENTE Y VALIDADO !' });
    this.close();
  }

  getNombreDeDescuentos(array_descuentos) {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion POST -/venta/transac/veproforma/getDescripDescExtra/";
    return this.api.create('/venta/transac/veproforma/getDescripDescExtra/' + this.userConn, array_descuentos)
      .subscribe({
        next: (datav) => {
          // console.log(datav)
          this.array_de_descuentos = datav.tabladescuentos;
          this.array_de_descuentos?.map((element) => ({
            ...element,
            descripcion: element?.descrip,
            descrip: element?.descrip
          }));
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  servicioEnviarAProforma(resultado_validacion) {
    this.descuento_services.disparadorDeDescuentosMostradorTiendas.emit({
      desct_proforma: this.array_de_descuentos,
      resultado_validacion: resultado_validacion,
      tabla_descuento: resultado_validacion.tablaDescuentos,
    });
  }

  eliminarDesct(codigo) {
    console.log(codigo);

    this.array_valida_detalle = this.array_valida_detalle.filter(item => item.codigo !== this.array_valida_detalle.coddesextra);
    this.array_de_descuentos = this.array_de_descuentos.filter(item => item.codigo !== codigo);
    console.log(this.array_de_descuentos, this.array_valida_detalle);

    this.dataSource = new MatTableDataSource(this.array_de_descuentos);
  }

  cambiarPorcentaje(newValue: number) {
    if (newValue){
      this.porcentaje = 0;
    }
  }

  calcularMonto(porcentaje, peso_minimo) {
    console.log(porcentaje, peso_minimo);
  }

  close() {
    this.dialogRef.close();
  }
}
