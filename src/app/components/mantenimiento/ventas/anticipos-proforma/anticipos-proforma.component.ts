import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-anticipos-proforma',
  templateUrl: './anticipos-proforma.component.html',
  styleUrls: ['./anticipos-proforma.component.scss']
})
export class AnticiposProformaComponent implements OnInit {

  public fecha_desde = new Date();
  public fecha_hasta = new Date();

  anticipos_asignados_table: any = [];
  data_tabla_anticipos: any = [];

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
  nombre_ventana: string = "docininvconsol.vb";

  public fecha_formateada1;
  public fecha_formateada2;

  public ventana = "Toma de Inventario Consolidado"
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  displayedColumns = ['doc', 'fecha', 'monto', 'usuario', 'hora', 'vendedor'];

  displayedColumnsAnticipado = ['doc', 'cliente', 'vendedor', 'anulado', 'cliente_real', 'nit',
    'fecha', 'pvc', 'moneda', 'monto', 'monto_rest', 'usuario_reg', 'hora_reg'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  dataSourceAnticipado = new MatTableDataSource();
  dataSourceWithPageSizeAnticipado = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(public dialogRef: MatDialogRef<AnticiposProformaComponent>, private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public id: any, @Inject(MAT_DIALOG_DATA) public numero_id: any,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any, @Inject(MAT_DIALOG_DATA) public tipoPago: any,
    @Inject(MAT_DIALOG_DATA) public cod_moneda: any, @Inject(MAT_DIALOG_DATA) public totalProf: any,
    @Inject(MAT_DIALOG_DATA) public nombre_cliente: any, @Inject(MAT_DIALOG_DATA) public nit: any,
    @Inject(MAT_DIALOG_DATA) public vendedor: any, @Inject(MAT_DIALOG_DATA) public cod_cliente_real: any,
    @Inject(MAT_DIALOG_DATA) public total: any,
    private datePipe: DatePipe) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

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
    this.total_get = this.formatNumber(total.total);

    console.log(this.cod_cliente_proforma, this.cod_moneda_proforma, this.totalProf, this.tipo_de_pago_proforma,
      this.nombre_cliente_get, this.nit_get, this.vendedor_get);
  }

  ngOnInit() {
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

    // if (this.totalProf == undefined || this.totalProf == 0) {
    //   this.toastr.error('EL TOTAL ES 0 O NO HAY TOTAL ⚠️');
    //   this.validacion = true;
    //   return this.message = "EL TOTAL ES 0 O NO HAY TOTAL"
    // }

    if (this.tipo_de_pago_proforma == undefined || this.tipo_de_pago_proforma == "CREDITO") {
      this.toastr.error('SELECCIONE TIPO DE PAGO CONTADO EN LA PROFORMA ⚠️');
      this.validacion = true;
      return this.message = "SELECCIONE TIPO DE PAGO CONTADO EN LA PROFORMA"
    }

    this.anticiposAsignadosInicioCargaTabla();
  }

  anticiposAsignadosInicioCargaTabla() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgveproforma_anticipo/buscar_anticipos_asignados/";
    return this.api.getAll('/venta/transac/prgveproforma_anticipo/buscar_anticipos_asignados/' + this.userConn + "/" + this.id_get + "/" + this.numero_id_get)
      .subscribe({
        next: (datav) => {
          this.anticipos_asignados_table = datav;
          console.log('data', this.anticipos_asignados_table);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {

        }
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
        complete: () => {

        }
      })
  }

  btnrefrescar_Anticipos() {
    this.fecha_formateada1 = this.datePipe.transform(this.fecha_desde, "yyyy-MM-dd");
    this.fecha_formateada2 = this.datePipe.transform(this.fecha_hasta, "yyyy-MM-dd");

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/transac/prgveproforma_anticipo/buscar_anticipos_asignados/";
    return this.api.update('/venta/transac/prgveproforma_anticipo/btnrefrescar_Anticipos/' + this.userConn + "/" + this.cod_cliente_proforma + "/" + this.fecha_formateada1 + "/" + this.fecha_formateada2 + "/" + this.nit_get + "/" + this.cod_cliente_proforma + "/" + this.BD_storage.bd, [])
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

  formatNumber(number: number): any {
    // Formatear el número con el separador de miles como coma y el separador decimal como punto
    return new Intl.NumberFormat('en-US').format(number);
  }

  close() {
    this.dialogRef.close();
  }
}
