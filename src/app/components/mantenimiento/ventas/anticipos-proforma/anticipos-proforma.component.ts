import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AnticipoProformaService } from './servicio-anticipo-proforma/anticipo-proforma.service';
import { subMonths } from 'date-fns';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-anticipos-proforma',
  templateUrl: './anticipos-proforma.component.html',
  styleUrls: ['./anticipos-proforma.component.scss']
})

export class AnticiposProformaComponent implements OnInit {

  public fecha_desde = new Date();
  public fecha_hasta = new Date();
  public hora_actual = new Date();

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

  monto_a_asignar: any;
  anticipo: any;
  get_anticipos_desc: any;

  cod_anticipo: any;
  cod_proforma: any;
  monto: any;
  moneda: any;
  cod_vendedor: any;
  monto_restante: any;
  total_anticipos: any;
  nombre_ventana: string = "docininvconsol.vb";

  public fecha_formateada1;
  public fecha_formateada2;
  public fecha_anticipo: any;
  public ventana_nom: string;

  public ventana = "Toma de Inventario Consolidado"
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  displayedColumns = ['doc', 'monto', 'usuario', 'fecha', 'hora', 'vendedor', 'accion'];

  displayedColumnsAnticipado = ['doc', 'cliente', 'vendedor', 'anulado', 'cliente_real', 'nit',
    'fecha', 'pvc', 'moneda', 'monto', 'monto_rest', 'usuario_reg', 'hora_reg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  dataSourceAnticipado = new MatTableDataSource();
  dataSourceWithPageSizeAnticipado = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(public dialogRef: MatDialogRef<AnticiposProformaComponent>, private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    private anticipo_servicio: AnticipoProformaService,
    @Inject(MAT_DIALOG_DATA) public id: any, @Inject(MAT_DIALOG_DATA) public numero_id: any,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any, @Inject(MAT_DIALOG_DATA) public tipoPago: any,
    @Inject(MAT_DIALOG_DATA) public cod_moneda: any, @Inject(MAT_DIALOG_DATA) public totalProf: any,
    @Inject(MAT_DIALOG_DATA) public nombre_cliente: any, @Inject(MAT_DIALOG_DATA) public nit: any,
    @Inject(MAT_DIALOG_DATA) public vendedor: any, @Inject(MAT_DIALOG_DATA) public cod_cliente_real: any,
    @Inject(MAT_DIALOG_DATA) public total: any, @Inject(MAT_DIALOG_DATA) public tdc: any,
    @Inject(MAT_DIALOG_DATA) public array_tabla_anticipos: any,
    @Inject(MAT_DIALOG_DATA) public ventana_para_cod_proforma: any,
    private datePipe: DatePipe) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;

    if (this.agencia_logueado === "Loc") {
      this.agencia_logueado = "311";
    }

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
    this.total_get = this.formatNumberTotalSubTOTALES(total.total);
    this.tdc_get = tdc.tdc;
    this.array_tabla_anticipos_get = array_tabla_anticipos.array_tabla_anticipos;
    this.ventana_nom = ventana_para_cod_proforma.ventana_para_cod_proforma;

    console.log(this.cod_cliente_proforma, this.cod_moneda_proforma, this.totalProf, this.tipo_de_pago_proforma,
      this.nombre_cliente_get, this.nit_get, this.vendedor_get, this.array_tabla_anticipos_get, this.ventana_nom);

    this.dataSource = new MatTableDataSource(this.array_tabla_anticipos_get);
  }

  ngOnInit() {
    console.log("TAMANIO ARRAY DE ANTICIPOS:", this.array_tabla_anticipos_get.length);

    if (this.cod_cliente_proforma == undefined || this.cod_cliente_proforma == "") {
      this.toastr.error('SELECCIONE CLIENTE ⚠️');
      this.validacion = true;
      return this.message = "SELECCIONE CLIENTE"
    }

    if (this.cod_moneda_proforma == undefined || this.cod_moneda_proforma == "") {
      this.toastr.error('SELECCIONE MONEDA ⚠️');
      this.validacion = true;
      return this.message = "SELECCIONE MONEDA"
    }

    if (this.tipo_de_pago_proforma == undefined || this.tipo_de_pago_proforma === 1) {
      this.toastr.error('SELECCIONE TIPO DE PAGO CONTADO EN LA PROFORMA ⚠️');
      this.validacion = true;
      return this.message = "SELECCIONE TIPO DE PAGO CONTADO EN LA PROFORMA"
    }

    // Resta 4 meses a la fecha actual
    this.fecha_desde = subMonths(this.fecha_desde, 4);
    this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);

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
          this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem.monto, 0);
          // this.dataSource = new MatTableDataSource(this.anticipos_asignados_table.concat(this.array_tabla_anticipos_get));
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  validarAsignacionAnticipo() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgveproforma_anticipo/buscar_anticipos_asignados/";
    return this.api.getAll('/venta/transac/prgveproforma_anticipo/validaAsignarAnticipo/' + this.userConn + "/" + this.cod_moneda_proforma + "/" + this.numero_id_get)
      .subscribe({
        next: (datav) => {
          this.anticipos_asignados_table = datav;
          console.log('data', this.anticipos_asignados_table);
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

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
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

  codigo_ultima_proforma: any;

  getUltimaProformaGuardada() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/venta/modif/docmodifveproforma/getUltiProfId/";
    return this.api.getAll('/venta/modif/docmodifveproforma/getUltiProfId/' + this.userConn)
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
    console.log(this.array_tabla_anticipos_get, this.anticipos_asignados_table);
    this.fecha_formateada1 = this.datePipe.transform(this.fecha_desde, "yyyy-MM-dd");
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    if (monto_del_input == 0) {
      this.toastr.error("¡ EL MONTO NO PUEDE SER 0 !");
      return;
    }

    if (monto_del_input > this.monto_restante) {
      this.toastr.error("¡ EL MONTO A ASIGNAR NO PUEDE SER MAYOR AL TOTAL !");
      return;
    }

    if (this.monto_a_asignar === undefined) {
      this.monto_a_asignar = 0;
    }

    let arrayTRUE: any = [];
    let i: any = [];

    console.log("TAMANIO ARRAY DE ANTICIPOS:", this.array_tabla_anticipos_get.length);
    if (this.array_tabla_anticipos_get.length === 0) {
      this.anticipos_asignados_table = [{
        codproforma: this.cod_anticipo,
        codanticipo: 0,
        id_anticipo: "",
        docanticipo: "",
        nroid_anticipo: 0,
        fechareg: this.fecha_formateada1,
        monto: 0,
        usuarioreg: this.usuarioLogueado,
        horareg: hora_actual_complete,
        tdc: this.tdc_get,
        codmoneda: this.cod_moneda_proforma,
        codvendedor: "",
      }];
    }

    if (this.array_tabla_anticipos_get.length != 0) {
      this.anticipos_asignados_table = [{
        codproforma: this.cod_anticipo,
        codanticipo: this.cod_proforma,
        id_anticipo: this.id_anticipo,
        docanticipo: this.id_anticipo + "-" + this.anticipo,
        nroid_anticipo: this.anticipo,
        fechareg: this.fecha_anticipo,
        monto: this.monto_a_asignar === undefined ? 0 : this.monto_a_asignar,
        usuarioreg: this.usuarioLogueado,
        horareg: hora_actual_complete,
        tdc: this.tdc_get,
        codmoneda: this.cod_moneda_proforma,
        codvendedor: this.vendedor_get.toString(),
      }];
    }
    //array vacio
    console.log(this.anticipos_asignados_table);

    this.api.create("/venta/transac/prgveproforma_anticipo/validaAsignarAnticipo/" + this.userConn + "/" + this.cod_moneda_proforma + "/" +
      this.moneda + "/" + this.monto_a_asignar + "/" + this.monto_restante + "/" + this.totalProf + "/" + this.BD_storage, this.array_tabla_anticipos_get)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          if (datav.value === true) {
            const encontrado = this.array_tabla_anticipos_get.some(objeto => objeto.nroid_anticipo === this.anticipo);
            if (!encontrado) {
              // Si el valor no está en el array, dejar el campo vacío
              arrayTRUE = {
                codproforma: this.ventana_nom === "proforma" ? 0 : this.codigo_ultima_proforma,
                codanticipo: this.cod_proforma,
                id_anticipo: this.id_anticipo,
                docanticipo: this.id_anticipo + "-" + this.anticipo,
                nroid_anticipo: this.anticipo,
                fechareg: this.fecha_anticipo,
                monto: this.monto_a_asignar === undefined ? 0 : this.monto_a_asignar,
                usuarioreg: this.usuarioLogueado,
                horareg: hora_actual_complete,
                tdc: this.tdc_get,
                codmoneda: this.cod_moneda_proforma,
                codvendedor: this.vendedor_get.toString(),
              };

              console.log(this.anticipos_asignados_table, arrayTRUE, arrayTRUE.length);
              this.array_tabla_anticipos_get.push(arrayTRUE);

              this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);

              this.dataSource = new MatTableDataSource(this.array_tabla_anticipos_get);
              console.log(this.array_tabla_anticipos_get, arrayTRUE, i);
            } else {
              this.toastr.error('! Anticipo YA ELEGIDO EN EL DETALLE, NO PUEDE VOLVER A ASIGNAR UN ANTICIPO YA ASIGNADO !');
              this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);
            }

          } else {
            this.toastr.error('NO SE AÑADIO ' + (datav.resp || ''));
            this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);
          }
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('! Anticipo NO Agregado !');
          this.total_anticipos = this.array_tabla_anticipos_get.reduce((total, currentItem) => total + currentItem?.monto, 0);

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

  id_anticipo: any;

  elegirAnticipo(element) {
    console.log(element, this.vendedor_get);
    //comparar el codvendedor del anticipo elegido con el vendedor de la proforma que esta en el primer tab
    //comparar el montoRest del anticipo elegido si el anticipo es igual o menor a 0 tonces no dejar seleccionarlo 
    if (element.montorest <= 0) {
      this.toastr.warning("EL ANTICIPO ELEGIDO " + " " + element.docanticipo + " " + " NO TIENE SALDO RESTANTE");
      return;
    }

    if (element.codvendedor != this.vendedor_get) {
      this.toastr.warning("EL ANTICIPO ELEGIDO " + " " + element.docanticipo + " " + "TIENE UN VENDEDOR DISTINTO A LA DE LA PROFORMA");
    } else {
      this.toastr.success("ANTICIPO SELECCIONADO Y AGREGADO" + " " + element.docanticipo);

      this.cod_anticipo = element.codanticipo;
      this.monto = element.monto;
      this.moneda = element.codmoneda;
      this.cod_vendedor = element.codvendedor;
      this.monto_restante = element.montorest;
      this.monto_a_asignar = element.montorest;
      this.anticipo = element.numeroid;
      this.id_anticipo = element.id;
      this.cod_proforma = element.codanticipo;
      this.fecha_anticipo = element.fechareg;

      console.log(this.id_get + "-" + this.numero_id_get);
      this.abrirTabPorLabel(this.id_get + "-" + this.numero_id_get);
    }
  }

  BTNengranaje(monto_del_input) {
    // if (monto_del_input == 0) {
    //   this.toastr.error("¡ EL MONTO NO PUEDE SER 0 !");
    //   return;
    // }

    // if (monto_del_input > this.totalProf) {
    //   this.toastr.error("¡ EL MONTO A ASIGNAR NO PUEDE SER MAYOR AL TOTAL !");
    //   return;
    // }
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
    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formattedNumber);
  }

  mandarProforma() {
    this.anticipo_servicio.disparadorDeTablaDeAnticipos.emit({
      anticipos: this.array_tabla_anticipos_get,
      totalAnticipo: this.formatNumberTotalSubTOTALES(this.total_anticipos),
    });

    this.dialogRef.close();
  }

  close() {
    this.array_tabla_anticipos_get = [];

    this.dialogRef.close();
  }
}
