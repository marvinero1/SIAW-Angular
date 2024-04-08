import { Component, Inject, OnInit } from '@angular/core';
import { RecargoDocumentoCreateComponent } from '../recargo-documento/recargo-documento-create/recargo-documento-create.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { RecargoServicioService } from '../recargo-documento/service-recargo/recargo-servicio.service';
import { MatTableDataSource } from '@angular/material/table';
import { RecargoToProformaService } from './recargo-to-proforma-services/recargo-to-proforma.service';
@Component({
  selector: 'app-modal-recargos',
  templateUrl: './modal-recargos.component.html',
  styleUrls: ['./modal-recargos.component.scss']
})
export class ModalRecargosComponent implements OnInit {

  recargos_ya_en_array: any = [];
  recargo_get_service: any = [];
  tablaRecargos: any = [];
  array_de_recargos: any = [];
  BD_storage: any = [];

  porcen: number;
  mont: number;
  moneda: any;
  confirmacion_get_recargo: any;

  recargos_ya_en_array_tamanio: any;

  userConn: any;
  displayedColumns = ['codigo', 'descripcion', 'porcen', 'monto', 'moneda', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalRecargosComponent>, private toastr: ToastrService,
    public servicioRecargo: RecargoServicioService, public servicio_recargo_proforma: RecargoToProformaService,
    @Inject(MAT_DIALOG_DATA) public recargos: any,
    @Inject(MAT_DIALOG_DATA) public tamanio_recargos: any) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.recargos_ya_en_array = recargos.recargos;
    this.recargos_ya_en_array_tamanio = tamanio_recargos.tamanio_recargos;

    console.log("Array de Recargos q vienen de proforma: " + recargos.recargos, "Tamanio Array: " + this.recargos_ya_en_array_tamanio);
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

    if (this.recargos_ya_en_array_tamanio > 0) {
      this.array_de_recargos = this.recargos_ya_en_array;
      this.dataSource = new MatTableDataSource(this.recargos_ya_en_array);
    }
  }

  anadirRecargo() {
    let a = {
      codigo: this.recargo_get_service.codigo,
      descripcion: this.recargo_get_service.descripcion,
      porcentaje: this.porcen,
      monto: this.mont,
      moneda: this.recargo_get_service.moneda,
    };

    this.dataSource = new MatTableDataSource(this.recargo_get_service);
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/venta/transac/veproforma/validaAddRecargo/' + this.userConn + "/" + this.recargo_get_service.codigo + "/" + this.BD_storage.bd)
      .subscribe({
        next: (datav) => {
          console.log('data', datav); //este valor simplemente es un true que valida si se puede agregar
          this.confirmacion_get_recargo = datav;
          const existe_en_array = this.array_de_recargos.some(item => item.codigo === a.codigo);
          console.log(existe_en_array);

          if (this.confirmacion_get_recargo) {
            if (existe_en_array) {
              this.toastr.warning("EL RECARGO YA ESTA AGREGADO")
            } else {
              if (this.recargos_ya_en_array_tamanio > 0) {
                console.log("HAY RECARGOS EN EL ARRAY LA CARGA SE CONCATENA");
                // Usar concat y asignar el resultado a array_de_recargos
                this.array_de_recargos = this.array_de_recargos.concat(a);
              } else {
                console.log("NO HAY RECARGOS EN EL ARRAY LA CARGA NO SE CONCATENA");
                // Usar push para agregar el elemento directamente al array
                this.array_de_recargos.push(a);
              }
            }
          }

          this.dataSource = new MatTableDataSource(this.array_de_recargos);
          console.log(this.array_de_recargos);
        },

        error: (err: any) => {
          this.dataSource = new MatTableDataSource(this.array_de_recargos);
          console.log(err, errorMessage);
        },

        complete: () => {
          this.dataSource = new MatTableDataSource(this.array_de_recargos);
        }
      })
  }

  sendArrayRecargos() {
    let a = this.array_de_recargos.length;

    if (a > 0) {
      this.servicio_recargo_proforma.disparadorDeRecargo_a_Proforma.emit({
        recargo_array: this.array_de_recargos,
      });
      this.toastr.success("¡ RECARGOS AGREGADOS EXITOSAMENTE !");
      this.close();
    } else {
      this.toastr.warning("¡ NO HAY RECARGO SELECCIONADO !");
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
