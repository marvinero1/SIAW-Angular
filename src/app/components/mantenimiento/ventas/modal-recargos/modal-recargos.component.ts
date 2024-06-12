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
  resultado_validacion: any = [];
  des_extra_del_total_get: any = [];
  array_cabe_cuerpo_get: any = [];
  BD_storage: any = [];
  recargos_array: any = []

  porcen: number;
  mont: number;
  moneda: any;
  confirmacion_get_recargo: any;
  cliente_real_get: any;

  cabecera_proforma: any = [];
  items_de_proforma: any = [];
  map_table: any = [];
  recargo_get_service_map: any = [];
  cod_moneda_get: any
  recargos_ya_en_array_tamanio: any;

  userConn: any;
  displayedColumns = ['codigo', 'descripcion', 'porcen', 'monto', 'moneda', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  constructor(private api: ApiService, public dialog: MatDialog, public log_module: LogService,
    public dialogRef: MatDialogRef<ModalRecargosComponent>, private toastr: ToastrService,
    public servicioRecargo: RecargoServicioService, public servicio_recargo_proforma: RecargoToProformaService,
    @Inject(MAT_DIALOG_DATA) public recargos: any, @Inject(MAT_DIALOG_DATA) public des_extra_del_total: any,
    @Inject(MAT_DIALOG_DATA) public array_cabe_cuerpo: any, @Inject(MAT_DIALOG_DATA) public cabecera: any,
    @Inject(MAT_DIALOG_DATA) public items: any, @Inject(MAT_DIALOG_DATA) public cod_moneda: any,
    @Inject(MAT_DIALOG_DATA) public tamanio_recargos: any, @Inject(MAT_DIALOG_DATA) public cliente_real: any) {

    this.recargos_ya_en_array = recargos.recargos;

    this.map_table = [this.recargos_ya_en_array].map(element => ({
      codigo: element.codrecargo,
      descripcion: element.descrip,
      porcentaje: element.porcen,
      monto: element.monto,
      moneda: element.moneda
    }))

    this.cabecera_proforma = cabecera.cabecera;
    this.items_de_proforma = items.items;
    this.cod_moneda_get = cod_moneda.cod_moneda
    this.cliente_real_get = cliente_real.cliente_real

    this.des_extra_del_total_get = des_extra_del_total.des_extra_del_total;
    this.array_cabe_cuerpo_get = array_cabe_cuerpo.array_cabe_cuerpo
    console.log(this.array_cabe_cuerpo_get);

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.recargos_ya_en_array_tamanio = tamanio_recargos.tamanio_recargos;
    console.log("Array de Recargos q vienen de proforma: ", this.recargos_ya_en_array, "Tamanio Array: " + this.recargos_ya_en_array_tamanio);

    this.recargos_ya_en_array = this.recargos_ya_en_array.map(element => ({
      codigo: element.codrecargo,
      descripcion: element.descripcion,
      porcentaje: element.porcen,
      monto: element.monto,
      moneda: element.moneda
    }))
  }

  ngOnInit() {
    this.servicioRecargo.disparadorDeRecargoDocumento.subscribe(data => {
      console.log("Recibiendo Recargo: ", data);
      this.recargo_get_service = data.recargo;

      if (this.recargo_get_service.montopor != true) {
        this.porcen = this.recargo_get_service.porcentaje;
        this.mont = this.recargo_get_service.monto;
        //.transform(this.mont, '1.2-2');
        this.moneda = this.recargo_get_service.moneda;
      } else {
        this.porcen = 0.00;
        this.mont = data.recargo.monto;
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
    }

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/validaAddRecargo/"
    return this.api.getAll('/venta/transac/veproforma/validaAddRecargo/' + this.userConn + "/" + this.recargo_get_service.codigo + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log('valor boolean del backend boolean', datav); //este valor simplemente es un true que valida si se puede agregar
          this.confirmacion_get_recargo = datav;

          const existe_en_array = this.array_de_recargos.some(item => item.codigo === a.codigo);
          let tamanio = this.array_de_recargos.length;
          console.log("Existe en array?", existe_en_array);

          if (this.confirmacion_get_recargo) {
            if (existe_en_array) {
              this.toastr.warning("EL RECARGO YA ESTA AGREGADO")
            } else {
              if (tamanio > 0) {
                // Concatenar el nuevo descuento con los descuentos existentes
                this.recargos_array = this.array_de_recargos = this.array_de_recargos.concat(a);
                console.log("HAY RECARGO EN EL ARRAY LA CARGA SE CONCATENA", this.recargo_get_service_map);
              } else {
                // Usar push para agregar el elemento directamente al array
                this.recargos_array = this.array_de_recargos.push(a);
                console.log("NO HAY RECARGO EN EL ARRAY LA CARGA NO SE CONCATENA", this.recargo_get_service_map);
              }
            }
          }

          this.dataSource = new MatTableDataSource(this.array_de_recargos);
          // console.log(this.array_de_recargos);
          // console.log(this.recargos_ya_en_array);
          // console.log(this.recargo_get_service_map);
          // console.log(this.recargos_array)
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
    console.log(this.recargos_array)
    this.recargo_get_service_map = this.array_de_recargos.map(element => ({
      codproforma: 0,
      codrecargo: element.codigo,
      porcen: element.porcentaje,
      monto: element.monto,
      moneda: element.moneda,
      montodoc: 0,
      codcobranza: 0,
      descripcion: element.descripcion
    }));

    console.log(this.recargo_get_service_map);

    let total_proforma_concat = {
      veproforma: this.cabecera_proforma, //este es el valor de todo el formulario de proforma
      detalleItemsProf: this.items_de_proforma, //este es el carrito con las items
      tablarecargos: this.recargo_get_service_map, //array de recargos ya mapeado
      tabladescuentos: [{
        "codproforma": 0,
        "coddesextra": 0,
        "porcen": 0,
        "montodoc": 0,
        "codcobranza": 0,
        "codcobranza_contado": 0,
        "codanticipo": 0,
        "id": 0,
        "aplicacion": "string",
        "codmoneda": "string",
        "descrip": "string",
        "total_dist": 0,
        "total_desc": 0,
        "montorest": 0
      }],
    }

    console.log(total_proforma_concat);
    //al darle al boton OK tiene consultar al backend validando los recargos y re calculando los total, subtotal.
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/venta/transac/veproforma/recarcularRecargos/"
    this.api.create('/venta/transac/veproforma/recarcularRecargos/' + this.userConn + "/" + this.BD_storage + "/" + this.des_extra_del_total_get + "/" + this.cliente_real_get, total_proforma_concat)
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

    this.toastr.success("¡ RECARGOS AGREGADOS EXITOSAMENTE Y VALIDADO !");
    this.close();
  }

  servicioEnviarAProforma(datav) {
    this.servicio_recargo_proforma.disparadorDeRecargo_a_Proforma.emit({
      recargo_array: this.array_de_recargos,
      resultado_validacion: datav,
      resultado_validacion_tabla_recargos: datav.tablaRecargos,
    });
    this.toastr.success("¡ RECARGOS AGREGADOS EXITOSAMENTE !");
    this.close();
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
