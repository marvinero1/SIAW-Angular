import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
import { MatrizItemsComponent } from '../matriz-items.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-item-seleccion-cantidad',
  templateUrl: './item-seleccion-cantidad.component.html',
  styleUrls: ['./item-seleccion-cantidad.component.scss']
})
export class ItemSeleccionCantidadComponent implements OnInit {

  cod_precio_venta_modal_codigo: number;
  cod_descuento_modal_codigo: number;
  num_hoja: number;

  tarifa_get_unico: any = [];
  descuentos_get: any = [];
  descuentos_get_copied: any = [];
  first_descuentos_get: any = [];

  tarifa_get_unico_copied: any = [];
  cod_precio_venta_modal_first: any = [];
  dataItemSeleccionados_get: any = [];
  cod_descuento_modal: any = [];
  cod_precio_venta_modal: any = [];

  cantidad_input: number;

  isCheckedCantidad: boolean = true;
  isCheckedEmpaque: boolean = false;

  userConn: any;
  usuarioLogueado: any;

  items_post: any = [];

  tarifa_get: any;
  descuento_get: any;
  codcliente_get: any;
  codalmacen_get: any;
  desc_linea_seg_solicitud_get: any;
  fecha_get: any;
  codmoneda_get: any;

  constructor(public dialog: MatDialog, private api: ApiService, public dialogRef: MatDialogRef<ItemSeleccionCantidadComponent>,
    public itemservice: ItemServiceService, public dialogRefMatriz: MatDialogRef<MatrizItemsComponent>, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataItemSeleccionados: any, public servicioPrecioVenta: ServicioprecioventaService,
    @Inject(MAT_DIALOG_DATA) public tarifa: any, @Inject(MAT_DIALOG_DATA) public descuento: any,
    @Inject(MAT_DIALOG_DATA) public codcliente: any, @Inject(MAT_DIALOG_DATA) public codalmacen: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea_seg_solicitud: any, @Inject(MAT_DIALOG_DATA) public fecha: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any, public servicioDesctEspecial: DescuentoService) {

    this.dataItemSeleccionados_get = dataItemSeleccionados.dataItemSeleccionados;
    console.log(this.dataItemSeleccionados_get);

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.tarifa_get = tarifa.tarifa;
    this.descuento_get = descuento.descuento;
    this.codcliente_get = codcliente.codcliente;
    this.codalmacen_get = codalmacen.codalmacen;
    this.desc_linea_seg_solicitud_get = desc_linea_seg_solicitud.desc_linea_seg_solicitud;
    this.fecha_get = fecha.fecha;
    this.codmoneda_get = codmoneda.codmoneda;
  }

  ngOnInit() {
    this.getTarifa();
    this.getDescuentos();

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.subscribe(data => {
      console.log("Recibiendo Descuento: ", data);
      this.cod_descuento_modal = data.descuento;
      this.cod_descuento_modal_codigo = this.cod_descuento_modal.codigo
    });
    // findescuentos

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo
    });
    // fin_precio_venta
  }

  getTarifa() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/intarifa/catalogo/";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get_unico = datav;
          //console.log(this.tarifa_get_unico);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getDescuentos() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/venta/mant/vedescuento";

    return this.api.getAll('/venta/mant/vedescuento/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.descuentos_get = datav;
          //console.log(this.descuentos_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  empaqueHabilitar() {
    console.log(this.isCheckedEmpaque);

    if (!this.isCheckedEmpaque) {
      this.isCheckedCantidad = true;
    } else {
      this.isCheckedCantidad = false;
    }
  }

  cantidadHabilitar() {
    console.log(this.isCheckedCantidad);

    if (this.isCheckedEmpaque) {
      this.isCheckedEmpaque = false;

    } else {
      this.isCheckedEmpaque = true;
    }
  }

  onLeavePrecioVenta(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get_unico.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  onLeaveDesctEspecial(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.descuentos_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  agregarItems() {
    if (this.isCheckedCantidad) {
      let a = this.dataItemSeleccionados_get.map((elemento) => {
        return {
          cantidad: this.cantidad_input,
          cantidad_pedida: this.cantidad_input,
          codalmacen: this.codalmacen_get,
          codcliente: this.codcliente_get,
          coditem: elemento,
          codmoneda: this.codmoneda_get,
          desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
          descuento: this.descuento_get,
          fecha: this.fecha_get,
          opcion_nivel: "",
          tarifa: this.tarifa_get,
        }
      })
      this.mandarItemFalse(a);
    } else {
      console.log("hola lola en false para cantidad")
      let b = this.dataItemSeleccionados_get.map((elemento) => {
        return {
          cantidad: 0,
          cantidad_pedida: 0,
          codalmacen: this.codalmacen_get,
          codcliente: this.codcliente_get,
          coditem: elemento,
          codmoneda: this.codmoneda_get,
          desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get,
          descuento: this.cod_descuento_modal_codigo,
          fecha: this.fecha_get,
          opcion_nivel: "",
          tarifa: this.cod_precio_venta_modal_codigo,
        }
      })
      this.mandarItem(b);
    }
  }

  mandarItem(array) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";
    return this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/true", array)
      .subscribe({
        next: (datav) => {
          this.items_post = datav;
          console.log('data', datav);

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          this.enviarItemsAlServicio(this.items_post, array);
          this.dialogRef.close();
          this.dialogRefMatriz.close();
          this.num_hoja = 0;
        }
      })
  }

  mandarItemFalse(array) {
    console.log(array);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";
    return this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/false", array)
      .subscribe({
        next: (datav) => {
          this.items_post = datav;
          console.log('data', datav);

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          this.enviarItemsAlServicio(this.items_post, array);
          this.dialogRef.close();
          this.dialogRefMatriz.close();
          this.num_hoja = 0;
        }
      })
  }

  enviarItemsAlServicio(items: any[], items_sin_proceso: any[]) {
    this.itemservice.enviarItems(items);

    this.itemservice.enviarItemsSinProcesar(items_sin_proceso);
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalDescuentoEspecial(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
  }
}
