import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnticipoProformaService } from './servicio-anticipo-proforma/anticipo-proforma.service';
import { subMonths } from 'date-fns';
import { MatTabGroup } from '@angular/material/tabs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-anticipos-proforma',
  templateUrl: './anticipos-proforma.component.html',
  styleUrls: ['./anticipos-proforma.component.scss']
})

export class AnticiposProformaComponent implements OnInit {

  public fecha_desde = new Date();
  public fecha_hasta = new Date();
  public hora_actual = new Date();

  private numberFormatter_2decimales: Intl.NumberFormat;

  anticipos_asignados_table: any = [];
  data_tabla_anticipos: any = [];
  array_anticipos: any = [];
  array_tabla_anticipos_get: any = [];
  public arraya_asignacion_anticipo: any = [];

  agencia_logueado: any;
  cod_cliente_proforma: any;
  cod_moneda_proforma: any;
  totalProf_proforma: any;
  tipo_de_pago_proforma: any;
  nombre_cliente_get: any;
  nit_get: any;
  validacion: boolean = false;
  vendedor_get: any;
  id_get: any;
  numero_id_get: any;
  cod_cliente_real_get: any;
  message: string;
  userConn: any;
  usuarioLogueado: any;
  BD_storage: any;
  total_get: any;
  tdc_get: any;
  codanticipo_elegido: any;

  monto_a_asignar: any;
  anticipo: any;
  get_anticipos_desc: any;

  id_anticipo: any;
  codigo_ultima_proforma: any;

  num_anticipo: any;
  cod_proforma: any;
  monto: any;
  moneda: any;
  cod_vendedor: any;
  monto_restante: any;
  total_anticipos: any;
  nombre_ventana1: string = "docininvconsol.vb";

  public fecha_formateada1;
  public fecha_formateada2;
  public fecha_anticipo: any;
  public ventana_nom: string;

  public ventana = "Toma de Inventario Consolidado"
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  displayedColumns = ['doc', 'monto', 'usuario', 'fecha', 'hora', 'vendedor', 'cod_moneda', 'accion'];

  displayedColumnsAnticipado = ['doc', 'cliente', 'vendedor', 'anulado', 'cliente_real', 'nit',
    'fecha', 'doc_aplicados', 'pvc', 'moneda', 'monto', 'monto_rest', 'usuario_reg', 'hora_reg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  dataSourceAnticipado = new MatTableDataSource();
  dataSourceWithPageSizeAnticipado = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(public dialogRef: MatDialogRef<AnticiposProformaComponent>, private datePipe: DatePipe,
    private api: ApiService, public _snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    private anticipo_servicio: AnticipoProformaService, private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public id: any, @Inject(MAT_DIALOG_DATA) public numero_id: any,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any, @Inject(MAT_DIALOG_DATA) public tipoPago: any,
    @Inject(MAT_DIALOG_DATA) public cod_moneda: any, @Inject(MAT_DIALOG_DATA) public totalProf: any,
    @Inject(MAT_DIALOG_DATA) public nombre_cliente: any, @Inject(MAT_DIALOG_DATA) public nit: any,
    @Inject(MAT_DIALOG_DATA) public vendedor: any, @Inject(MAT_DIALOG_DATA) public cod_cliente_real: any,
    @Inject(MAT_DIALOG_DATA) public total: any, @Inject(MAT_DIALOG_DATA) public tdc: any,
    @Inject(MAT_DIALOG_DATA) public array_tabla_anticipos: any,
    @Inject(MAT_DIALOG_DATA) public nombre_ventana: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;

    this.id_get = id.id;
    this.numero_id_get = numero_id.numero_id;
    this.cod_cliente_proforma = cod_cliente.cod_cliente;
    this.cod_moneda_proforma = cod_moneda.cod_moneda;
    this.totalProf = totalProf.totalProf;
    this.tipo_de_pago_proforma = tipoPago.tipoPago;
    this.nombre_cliente_get = nombre_cliente.nombre_cliente;
    this.nit_get = nit.nit;
    this.vendedor_get = vendedor.vendedor;
    this.cod_cliente_real_get = cod_cliente_real.cod_cliente_real;
    this.total_get = total?.total;
    this.tdc_get = tdc.tdc;
    this.array_tabla_anticipos_get = array_tabla_anticipos.array_tabla_anticipos;
    this.ventana_nom = nombre_ventana.nombre_ventana;

    console.log(this.cod_cliente_proforma, this.cod_moneda_proforma, this.totalProf, this.tipo_de_pago_proforma,
      this.nombre_cliente_get, this.nit_get, this.vendedor_get, this.array_tabla_anticipos_get, this.ventana_nom);

    this.dataSource = new MatTableDataSource(this.array_tabla_anticipos_get);

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  ngOnInit() {
    console.log("TAMANIO ARRAY DE ANTICIPOS:", this.array_tabla_anticipos_get?.length);

    if (this.cod_cliente_proforma == undefined || this.cod_cliente_proforma == "") {
      this.validacion = true;
      return this.message = "SELECCIONE CLIENTE"
    }

    if (this.cod_moneda_proforma == undefined || this.cod_moneda_proforma == "") {
      this.validacion = true;
      return this.message = "SELECCIONE MONEDA"
    }

    if (this.tipo_de_pago_proforma == undefined || this.tipo_de_pago_proforma === 1) {
      this.validacion = true;
      return this.message = "SELECCIONE TIPO DE PAGO CONTADO EN LA PROFORMA"
    }

    // Resta 4 meses a la fecha actual
    this.fecha_desde = subMonths(this.fecha_desde, 4);
    // suma todos los totales de la tabla
    this.total_anticipos = this.array_tabla_anticipos_get?.reduce((total, currentItem) => total + currentItem?.monto, 0);

    this.getAnticipo();
    this.getUltimaProformaGuardada();
  }

  getAnticipo() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/ctsxcob/mant/cotipoanticipo/";
    return this.api.getAll('/ctsxcob/mant/cotipoanticipo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.anticipo = datav[0].id; //sacar de la primera posicion
          this.get_anticipos_desc = datav[0].descripcion; //sacar de la primera posicion
          console.log('data', datav, this.anticipo, this.get_anticipos_desc);
          // this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem.monto, 0);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  anticiposAsignadosInicioCargaTabla() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgveproforma_anticipo/buscar_anticipos_asignados/";
    return this.api.getAll('/venta/transac/prgveproforma_anticipo/buscar_anticipos_asignados/' + this.userConn + "/" + this.id_get + "/" + this.numero_id_get)
      .subscribe({
        next: (datav) => {
          this.anticipos_asignados_table = datav;
          console.log(this.anticipos_asignados_table);
          this.total_anticipos = this.array_tabla_anticipos_get?.reduce((total, currentItem) => total + currentItem.monto, 0);
          // this.dataSource = new MatTableDataSource(this.anticipos_asignados_table.concat(this.array_tabla_anticipos_get));
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  btnrefrescar_Anticipos() {
    this.fecha_formateada1 = this.datePipe.transform(this.fecha_desde, "yyyy-MM-dd");
    this.fecha_formateada2 = this.datePipe.transform(this.fecha_hasta, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgveproforma_anticipo/buscar_anticipos_asignados/";
    return this.api.update('/venta/transac/prgveproforma_anticipo/btnrefrescar_Anticipos/' + this.userConn + "/" + this.cod_cliente_proforma + "/" + this.fecha_formateada1 + "/" + this.fecha_formateada2 + "/" +
      this.nit_get + "/" + this.cod_cliente_proforma + "/" + this.BD_storage, [])
      .subscribe({
        next: (datav) => {
          this.data_tabla_anticipos = datav;
          console.log('data', this.data_tabla_anticipos);
          this.dataSourceAnticipado = new MatTableDataSource(this.data_tabla_anticipos);

          this.dataSourceAnticipado.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        }
      })
  }

  getUltimaProformaGuardada() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/getUltiProfId/";
    return this.api.getAll('/venta/modif/docmodifveproforma/getUltiProfId/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.codigo_ultima_proforma = datav.codigo
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  asignarMontoAlArray(monto_del_input: number) {
    let longitud_array_anticipos = this.array_tabla_anticipos_get.length

    if (!this.array_tabla_anticipos_get) {
      this.array_tabla_anticipos_get = [];
    }

    console.warn("Inicio:", this.array_tabla_anticipos_get,
      this.anticipos_asignados_table,
      "Nombre Ventana:", this.ventana_nom,
      "tamanio array anticipos:", longitud_array_anticipos);

    this.fecha_formateada1 = this.datePipe.transform(this.fecha_desde, "yyyy-MM-dd");
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    if (monto_del_input == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ EL MONTO NO PUEDE SER 0 !' });
      return;
    }

    if (monto_del_input > this.monto_restante) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: '¡ EL MONTO A ASIGNAR NO PUEDE SER MAYOR AL TOTAL !' });
      return;
    }

    if (this.monto_a_asignar === undefined) {
      this.monto_a_asignar = 0;
    }

    if (this.ventana_nom === "docmodifveproforma.vb") {
      if (longitud_array_anticipos > 0) {
        this.anticipos_asignados_table;
      } else {
        this.anticipos_asignados_table = [];
      }
    }

    if (this.ventana_nom === "docveproforma.vb") {
      if (longitud_array_anticipos > 0) {
        this.anticipos_asignados_table = [{
          codproforma: 0,
          codanticipo: this.anticipo,
          nroid_anticipo: this.anticipo,
          docanticipo: this.id_anticipo + "-" + this.anticipo,

          id_anticipo: this.id_anticipo,
          fechareg: this.fecha_anticipo,
          monto: this.monto_a_asignar === undefined ? 0 : this.monto_a_asignar,
          usuarioreg: this.usuarioLogueado,
          horareg: hora_actual_complete,
          tdc: this.tdc_get,
          codmoneda: this.cod_moneda_proforma,
          codvendedor: this.vendedor_get.toString(),
        }];
      } else {
        this.anticipos_asignados_table = [];
      }
    }
    console.log(this.anticipos_asignados_table);

    this.api.create("/venta/transac/prgveproforma_anticipo/validaAsignarAnticipo/" + this.userConn + "/" + this.cod_moneda_proforma + "/" +
      this.moneda + "/" + this.monto_a_asignar + "/" + this.monto_restante + "/" + this.totalProf + "/" + this.BD_storage +
      "/" + this.id_anticipo + "/" + this.num_anticipo, this.array_tabla_anticipos_get)
      .subscribe({
        next: (datav) => {
          console.log(datav);

          if (datav.value === true) {
            console.warn(this.anticipos_asignados_table, this.codanticipo_elegido);

            const encontrado = this.array_tabla_anticipos_get.some(objeto => objeto.nroid_anticipo === this.codanticipo_elegido);
            //const encontrado = this.array_tabla_anticipos_get.some(objeto => objeto.nroid_anticipo === this.anticipo);

            if (!encontrado) {
              // Si el valor no está en el array, dejar el campo vacío
              this.preparaParaAgregar();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: '! ANTICIPO YA ELEGIDO EN EL DETALLE, NO PUEDE VOLVER A ASIGNAR UN ANTICIPO YA ASIGNADO !' });
              this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'NO SE AÑADIO ' + (datav.resp || '') });
            this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);
          }

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err) => {
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: '! Anticipo NO Agregado !' });
          this.total_anticipos = this.anticipos_asignados_table?.reduce((total, currentItem) => total + currentItem?.monto, 0);

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

  preparaParaAgregar() {
    // aca se arma el array con los datos de la proforma
    let arrayTRUE: any = [];
    let b;

    this.fecha_formateada1 = this.datePipe.transform(this.fecha_desde, "yyyy-MM-dd");
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    if (this.ventana_nom === "docveproforma.vb") {
      b = {
        codproforma: this.cod_proforma,
        codanticipo: this.anticipo,
        nroid_anticipo: this.anticipo,
        docanticipo: this.id_anticipo + "-" + this.anticipo,

        id_anticipo: this.id_anticipo,
        fechareg: this.fecha_anticipo,
        monto: this.monto_a_asignar === undefined ? 0 : this.monto_a_asignar,
        usuarioreg: this.usuarioLogueado,
        horareg: hora_actual_complete,
        tdc: this.tdc_get,
        codmoneda: this.cod_moneda_proforma,
        codvendedor: this.vendedor_get.toString(),
      };
    }

    if (this.ventana_nom === "docmodifveproforma.vb") {
      b = {
        codproforma: this.cod_proforma,
        codanticipo: this.anticipo,
        nroid_anticipo: this.anticipo,
        docanticipo: this.id_anticipo + "-" + this.anticipo,

        id_anticipo: this.id_anticipo,
        fechareg: this.fecha_anticipo,
        monto: this.monto_a_asignar === undefined ? 0 : this.monto_a_asignar,
        usuarioreg: this.usuarioLogueado,
        horareg: hora_actual_complete,
        tdc: this.tdc_get,
        codmoneda: this.cod_moneda_proforma,
        codvendedor: this.vendedor_get.toString(),
      };
    }
    // console.warn(b);
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/prgveproforma_anticipo/preparaParaAdd_monto/";
    return this.api.create('/venta/transac/prgveproforma_anticipo/preparaParaAdd_monto/' + this.userConn + "/" + this.id_get + "/" + this.numero_id_get + "/" + this.cod_moneda_proforma + "/" + this.moneda, b)
      .subscribe({
        next: (datav) => {
          console.warn("PreparaParaAdd: ", datav);
          //this.array_tabla_anticipos_get = datav
          arrayTRUE = {
            codproforma: this.ventana_nom === "docveproforma.vb" ? 0 : datav.codproforma,
            codanticipo: datav.codanticipo,
            id_anticipo: datav.id_anticipo,
            docanticipo: datav.id_anticipo + "-" + datav.nroid_anticipo,
            nroid_anticipo: datav.nroid_anticipo,
            fechareg: datav.fechareg,
            monto: datav.monto === undefined ? 0 : datav.monto,
            usuarioreg: datav.usuarioreg,
            horareg: datav.horareg,
            tdc: datav.tdc,
            codmoneda: datav.codmoneda,
            codvendedor: datav.codvendedor,
          };

          console.log(this.anticipos_asignados_table, arrayTRUE.codanticipo);
          if (!this.array_tabla_anticipos_get) {
            this.array_tabla_anticipos_get = [];
          }

          const encontrado = this.array_tabla_anticipos_get.some(objeto => objeto.codanticipo === arrayTRUE.codanticipo);
          console.log("🚀 ~ AnticiposProformaComponent ~ preparaParaAgregar ~ encontrado:", encontrado)

          if (!encontrado) {
            this.array_tabla_anticipos_get.push(arrayTRUE);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: '! ANTICIPO YA ELEGIDO EN EL DETALLE, NO PUEDE VOLVER A ASIGNAR UN ANTICIPO YA ASIGNADO !' });
            this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);
            //this.preparaParaAgregar();
          }

          this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);

          this.dataSource = new MatTableDataSource(this.array_tabla_anticipos_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          console.warn("array_final preparaParaAgregar:", this.array_tabla_anticipos_get);
          this.getTotabilizarAsignacion(this.array_tabla_anticipos_get)
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTotabilizarAsignacion(array_anticipos_asignados) {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion POST -/venta/transac/prgveproforma_anticipo/getTotabilizarAsignacion/";
    return this.api.create('/venta/transac/prgveproforma_anticipo/getTotabilizarAsignacion/' + this.userConn + "/" + this.cod_moneda_proforma, array_anticipos_asignados)
      .subscribe({
        next: (datav) => {
          console.warn("getTotabilizarAsignacion: ", datav);
          this.total_anticipos = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  elegirAnticipo(element) {
    console.log(element, this.vendedor_get);
    //comparar el codvendedor del anticipo elegido con el vendedor de la proforma que esta en el primer tab
    //comparar el montoRest del anticipo elegido si el anticipo es igual o menor a 0 tonces no dejar seleccionarlo 
    if (element.montorest <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "EL ANTICIPO ELEGIDO " + " " + element.docanticipo + " " + " NO TIENE SALDO RESTANTE" });
      return;
    }

    if (element.codvendedor != this.vendedor_get) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: "EL ANTICIPO ELEGIDO " + " " + element.docanticipo + " " + "TIENE UN VENDEDOR DISTINTO A LA DE LA PROFORMA" });
    } else {
      this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: "ANTICIPO SELECCIONADO Y AGREGADO" + " " + element.docanticipo })
      this.monto = element.monto;
      this.moneda = element.codmoneda;
      this.cod_vendedor = element.codvendedor;
      this.monto_restante = element.montorest;
      this.monto_a_asignar = element.montorest;
      this.anticipo = element.numeroid;

      this.id_anticipo = element.id;
      this.num_anticipo = element.numeroid;

      this.cod_proforma = element.codanticipo;
      this.codanticipo_elegido = element.codanticipo;
      this.fecha_anticipo = element.fechareg;

      console.log(this.id_get + "-" + this.numero_id_get);
      this.abrirTabPorLabel(this.id_get + "-" + this.numero_id_get);
    }
  }

  BTNengranaje() {
    this.spinner.show();
    let resultado: number = 0;

    console.log(resultado, this.totalProf, this.total_anticipos, this.monto_restante);

    resultado = this.totalProf - this.total_anticipos;
    console.warn(resultado)
    if (resultado > this.monto_restante) {
      console.warn("resultado mayot", resultado)

      resultado = this.formatNumberTotalSub(this.monto_a_asignar);
    }
    this.monto_a_asignar = this.formatNumberTotalSub(resultado);
    console.warn(this.monto_a_asignar);

    setTimeout(() => {
      this.spinner.hide()
    }, 500);
  }

  formatNumberTotalSub(number: number) {
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    return Number(number?.toFixed(2));
  }

  abrirTabPorLabel(label: string) {
    //abre tab por el id de su etiqueta, muy buena funcion xD
    const tabs = this.tabGroup._tabs.toArray(); // Obtener todas las pestañas del mat-tab-group
    console.log(tabs[0].textLabel.replace(/\s*-\s*/, '-'), label);
    const index = tabs.findIndex(tab => tab.textLabel.replace(/\s*-\s*/, '-') === label); // Encontrar el índice del mat-tab con el label dado
    if (index !== -1) {
      this.tabGroup.selectedIndex = index; // Establecer el índice seleccionado del mat-tab-group
    }
  }

  eliminarMonto(element) {
    console.log("Elemento a Eliminar:", element);
    this.array_tabla_anticipos_get = this.array_tabla_anticipos_get.filter(i => i.monto !== element.monto);
    this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem.monto, 0);

    this.dataSource = new MatTableDataSource(this.array_tabla_anticipos_get);
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  mandarProforma() {
    this.anticipo_servicio.disparadorDeTablaDeAnticipos.emit({
      anticipos: this.array_tabla_anticipos_get,
      totalAnticipo: this.total_anticipos,
    });

    this.dialogRef.close();
  }

  close() {
    this.array_tabla_anticipos_get = [];
    this.dialogRef.close();
  }

  // formatNumber2DecimalesBCK(numero: number) {
  //   let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/transac/veproforma/getRedondeo2decimales/";
  //   return this.api.getAll('/venta/transac/veproforma/getRedondeo2decimales/' + this.userConn + "/" + numero)
  //     .subscribe({
  //       next: (datav) => {
  //         return this.monto_a_asignar = datav;
  //       },

  //       error: (err: any) => {
  //         console.log(err, errorMessage);
  //       },
  //       complete: () => { }
  //     })
  // }
}
