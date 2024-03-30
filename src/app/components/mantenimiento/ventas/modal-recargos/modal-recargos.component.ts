import { Component, Inject, OnInit } from '@angular/core';
import { RecargoDocumentoCreateComponent } from '../recargo-documento/recargo-documento-create/recargo-documento-create.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { RecargoServicioService } from '../recargo-documento/service-recargo/recargo-servicio.service';
import { MatTableDataSource } from '@angular/material/table';
import { RecargoToProformaService } from './recargo-to-proforma-services/recargo-to-proforma.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-modal-recargos',
  templateUrl: './modal-recargos.component.html',
  styleUrls: ['./modal-recargos.component.scss']
})
export class ModalRecargosComponent implements OnInit {

  recargo_get_service: any = [];
  tablaRecargos: any = [];
  array_de_recargos: any = [];
  BD_storage: any = [];

  porcen: number;
  mont: number;
  moneda: any;
  confirmacion_get_recargo: any;
  recargos_ya_en_array: any = [];
  recargos_ya_en_array_tamanio: number;


  userConn: any;
  displayedColumns = ['codigo', 'descripcion', 'porcen', 'monto', 'moneda', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalRecargosComponent>, private toastr: ToastrService,
    public servicioRecargo: RecargoServicioService, public servicio_recargo_proforma: RecargoToProformaService,
    private _decimalPipe: DecimalPipe,
    @Inject(MAT_DIALOG_DATA) public recargos: any,) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.recargos_ya_en_array = recargos.recargos;
    this.recargos_ya_en_array_tamanio = this.recargos_ya_en_array.length;

    console.log(this.recargos_ya_en_array);

  }

  ngOnInit() {
    this.servicioRecargo.disparadorDeRecargoDocumento.subscribe(data => {
      console.log("Recibiendo Recargo: ", data);
      this.recargo_get_service = data.recargo;

      if (this.recargo_get_service.montopor != true) {
        this.porcen = 0.00;
        this.mont = 0;
        this.moneda = this.recargo_get_service.moneda;
      } else {
        this.porcen = this.recargo_get_service.porcentaje;
        this.mont = this.recargo_get_service.monto;
        //.transform(this.mont, '1.2-2');
        this.moneda = this.recargo_get_service.moneda;
      }
    });
    this.dataSource = new MatTableDataSource(this.recargos_ya_en_array.recargo_array);
  }

  anadirRecargo() {
    let a = {
      codigo: this.recargo_get_service.codigo,
      descripcion: this.recargo_get_service.descripcion,
      porcentaje: this.porcen,
      monto: this.mont,
      moneda: this.recargo_get_service.moneda,
    }

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/venta/transac/veproforma/validaAddRecargo/' + this.userConn + "/" + this.recargo_get_service.codigo + "/" + this.BD_storage.bd)
      .subscribe({
        next: (datav) => {
          this.confirmacion_get_recargo = datav;
          console.log(this.confirmacion_get_recargo);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => {
          if (this.confirmacion_get_recargo) {
            const existe = this.array_de_recargos.some(item => item.codigo === a.codigo);
            //const existe_en_array = this.recargos_ya_en_array.some(item => item.codigo === a.codigo);

            if (!existe) {

              this.array_de_recargos.push(a);

              this.array_de_recargos.concat(a, this.recargos_ya_en_array.recargo_array);

              this.dataSource = new MatTableDataSource(this.array_de_recargos);
              console.log(this.array_de_recargos);
            } else {
              this.toastr.error('El Recargo ya está agregado');
            }
          } else {
            window.confirm(this.confirmacion_get_recargo.resp);
          }
        }
      })
  }

  sendArrayRecargos() {
    let a = this.array_de_recargos.length;
    if (a > 0) {
      this.servicio_recargo_proforma.disparadorDeRecargo_a_Proforma.emit({
        recargo_array: this.array_de_recargos,
      });
      this.close();
    } else {
      this.toastr.warning("No hay Recargos seleccionados");
    }
  }

  eliminarRecargo(codigo) {
    console.log(codigo);
    this.array_de_recargos = this.array_de_recargos.filter(item => item.codigo !== codigo);
    console.log(this.array_de_recargos);

    this.dataSource = new MatTableDataSource(this.array_de_recargos);
  }

  modalCatalogoRecargos(): void {
    this.dialog.open(RecargoDocumentoCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
  }
}
