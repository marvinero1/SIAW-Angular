import { Component, OnInit } from '@angular/core';
import { RecargoDocumentoCreateComponent } from '../recargo-documento/recargo-documento-create/recargo-documento-create.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RecargoServicioService } from '../recargo-documento/service-recargo/recargo-servicio.service';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RecargoToProformaService } from './recargo-to-proforma-services/recargo-to-proforma.service';

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

  userConn: any;
  displayedColumns = ['codigo', 'descripcion', 'porcen', 'monto', 'moneda', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalRecargosComponent>, private toastr: ToastrService,
    public servicioRecargo: RecargoServicioService, public servicio_recargo_proforma: RecargoToProformaService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

  }

  ngOnInit() {
    this.servicioRecargo.disparadorDeRecargoDocumento.subscribe(data => {
      console.log("Recibiendo Recargo: ", data);
      this.recargo_get_service = data.punto_venta;

      if (this.recargo_get_service.montopor != true) {
        this.porcen = 0.00;
        this.mont = 0;
        this.moneda
      } else {
        this.porcen = 0;
        this.mont = this.recargo_get_service.monto;
        this.moneda = this.recargo_get_service.moneda;
      }
    });
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
          if (this.confirmacion_get_recargo === true) {
            const existe = this.array_de_recargos.find(item => item.codigo === a.codigo);
            if (!existe) {
              this.array_de_recargos.push(a);
              this.dataSource = new MatTableDataSource(this.array_de_recargos);
              console.log(this.array_de_recargos);
            } else {
              this.toastr.error('El Recargo ya esta agregado');
            }
          } else {
            window.confirm(this.confirmacion_get_recargo.resp)
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
