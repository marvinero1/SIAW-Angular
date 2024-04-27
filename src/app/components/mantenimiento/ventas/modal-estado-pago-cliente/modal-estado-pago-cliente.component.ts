import { DatePipe } from '@angular/common';
import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-modal-estado-pago-cliente',
  templateUrl: './modal-estado-pago-cliente.component.html',
  styleUrls: ['./modal-estado-pago-cliente.component.scss']
})
export class ModalEstadoPagoClienteComponent implements OnInit, AfterContentInit {

  dataSource_pagos = new MatTableDataSource();
  dataSourceWithPageSize_pagos = new MatTableDataSource();

  dataSource_cheques = new MatTableDataSource();
  dataSourceWithPageSize_cheques = new MatTableDataSource();

  dataSource_anticipos = new MatTableDataSource();
  dataSourceWithPageSize_anticipos = new MatTableDataSource();

  fecha_actual = new Date();
  fecha_actual1;

  cod_cliente_get: string;
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  estado_pagos_all: any = [];
  pagos_cliente: any = [];
  anticipos_cliente: any = [];
  cheques_cliente: any = [];

  calculo_sesion: any = [];

  numero_ventas_sem: any;
  total_seleccionado: any;
  total_seleccionado_id: any;
  total_seleccionado_numero_id: any;
  total_adeudado: any;
  credito: any;

  displayedColumns = ['calculo', 'id', 'numero', 'fecha', 'para_venta_contado', 'monto',
    'monto_pagado', 'C', 'vencimiento', 'saldo_deudor', 'acumulado', 'moneda', 'monto', 'dias'];

  displayedColumnsCheques = ['id', 'numero', 'recibo', 'banco', 'fecha', 'fecha_pago',
    'monto', 'restante', 'observacion'];

  displayedColumnsAnticipos = ['id', 'numero', 'recibo', 'fecha', 'monto', 'restante'];

  constructor(public dialogRef: MatDialogRef<ModalEstadoPagoClienteComponent>, private toastr: ToastrService,
    private api: ApiService, public _snackBar: MatSnackBar, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public cod_cliente: any, private spinner: NgxSpinnerService) {
    this.cod_cliente_get = cod_cliente.cod_cliente;

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = localStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(localStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
  }

  ngOnInit() {
    this.fecha_actual1 = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.getEstadoPagosCliente();
  }

  getEstadoPagosCliente() {
    this.spinner.show();

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/prgestadocliente/getEstadoPagosCliente/";
    return this.api.getAll('/venta/transac/prgestadocliente/getEstadoPagosCliente/' + this.userConn + "/" + this.cod_cliente_get + "/" + this.fecha_actual1 + "/" + this.agencia_logueado + "/" + this.BD_storage.bd)
      .subscribe({
        next: (datav) => {
          this.estado_pagos_all = datav;
          console.log(this.estado_pagos_all);

          this.numero_ventas_sem = this.estado_pagos_all.nroVentasUrgSem;
          this.total_seleccionado = 0.00;
          this.total_adeudado = this.estado_pagos_all.montototal;
          this.credito = this.formatNumber(this.estado_pagos_all.totCredito);

          this.pagos_cliente = this.estado_pagos_all.tablaEstadoCliente;
          this.dataSource_pagos = new MatTableDataSource(this.pagos_cliente);

          this.anticipos_cliente = this.estado_pagos_all.tablaAnticipos;
          this.dataSource_anticipos = new MatTableDataSource(this.anticipos_cliente);

          this.cheques_cliente = this.estado_pagos_all.tablaCheques;
          this.dataSource_cheques = new MatTableDataSource(this.cheques_cliente);

          if (this.cheques_cliente.length === 0) {
            this.toastr.warning("NO HAY CHEQUES");
          }

          if (this.pagos_cliente.length === 0) {
            this.toastr.warning("NO HAY PAGOS");
          }

          if (this.anticipos_cliente.length === 0) {
            this.toastr.warning("NO HAY ANTICIPOS");
          }

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
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        }
      })
  }

  formatNumber(number: number): any {
    // Formatear el número con el separador de miles como coma y el separador decimal como punto
    return new Intl.NumberFormat('en-US').format(number);
  }


  calcularSeleccion(element) {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta: -/venta/transac/prgestadocliente/calcularSeleccion/";
    return this.api.create("/venta/transac/prgestadocliente/calcularSeleccion/" + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage.bd, element)
      .subscribe({
        next: (datav) => {
          this.calculo_sesion = datav;
          console.log(this.calculo_sesion);
          this.total_seleccionado = this.calculo_sesion.montoSeleccionado;
          this.total_seleccionado_id = element.id;
          this.total_seleccionado_numero_id = element.numeroid;

          //this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          // this.spinner.show();
          this.toastr.success('CALCULADO' + " " + element.id + " " + element.numeroid);
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE CALCULADO !');
        },
        complete: () => { }
      })
  }

  close() {
    this.dialogRef.close();
  }
}
