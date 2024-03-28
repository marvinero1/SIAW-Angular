import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-desct-extras',
  templateUrl: './modal-desct-extras.component.html',
  styleUrls: ['./modal-desct-extras.component.scss']
})
export class ModalDesctExtrasComponent implements OnInit {

  tarifaPrincipal: any = [];
  descuento_segun_tarifa: any = [];

  BD_storage: any = [];
  userConn: any;


  displayedColumns = ['codigo', 'descripcion', 'porcen', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();


  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalDesctExtrasComponent>, private toastr: ToastrService) {


    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
  }

  ngOnInit() {
    this.descuentoExtraSegunTarifa();
  }

  getTarifaPrincipal() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.getAll('/venta/transac/veproforma/getTarifaPrincipal/' + this.userConn,)
      .subscribe({
        next: (datav) => {
          this.tarifaPrincipal = datav;
          console.log(this.tarifaPrincipal);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => {
          // if (this.confirmacion_get_recargo === true) {
          //   const existe = this.array_de_recargos.find(item => item.codigo === a.codigo);
          //   if (!existe) {
          //     this.array_de_recargos.push(a);
          //     this.dataSource = new MatTableDataSource(this.array_de_recargos);
          //     console.log(this.array_de_recargos);
          //   } else {
          //     this.toastr.error('El Recargo ya esta agregado');
          //   }
          // } else {
          //   window.confirm(this.confirmacion_get_recargo.resp)
          // }
        }
      })
  }

  descuentoExtraSegunTarifa() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/getTarifaPrincipal/"
    return this.api.getAll('/venta/mant/vedesextra/getvedesextrafromTarifa/' + this.userConn + "/" + 1)
      .subscribe({
        next: (datav) => {
          this.descuento_segun_tarifa = datav;
          console.log(this.descuento_segun_tarifa);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },

        complete: () => { }
      })
  }

  // anadirDescuento() {
  //   let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
  //   return this.api.getAll('/venta/transac/veproforma/validaAddRecargo/' + this.userConn + "/" + this.recargo_get_service.codigo + "/" + this.BD_storage.bd)
  //     .subscribe({
  //       next: (datav) => {
  //         this.confirmacion_get_recargo = datav;
  //         console.log(this.confirmacion_get_recargo);
  //       },

  //       error: (err: any) => {
  //         console.log(err, errorMessage);
  //       },

  //       complete: () => {
  //         // if (this.confirmacion_get_recargo === true) {
  //         //   const existe = this.array_de_recargos.find(item => item.codigo === a.codigo);
  //         //   if (!existe) {
  //         //     this.array_de_recargos.push(a);
  //         //     this.dataSource = new MatTableDataSource(this.array_de_recargos);
  //         //     console.log(this.array_de_recargos);
  //         //   } else {
  //         //     this.toastr.error('El Recargo ya esta agregado');
  //         //   }
  //         // } else {
  //         //   window.confirm(this.confirmacion_get_recargo.resp)
  //         // }
  //       }
  //     })
  // }

  close() {
    this.dialogRef.close();
  }
}
