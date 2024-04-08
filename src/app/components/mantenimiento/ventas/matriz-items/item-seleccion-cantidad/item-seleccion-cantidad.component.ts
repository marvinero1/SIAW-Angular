import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ModalPrecioVentaComponent } from '../../modal-precio-venta/modal-precio-venta.component';
import { ModalDescuentosComponent } from '../../descuentos-especiales/modal-descuentos/modal-descuentos.component';
import { DescuentoService } from '../../serviciodescuento/descuento.service';
import { ServicioprecioventaService } from '../../servicioprecioventa/servicioprecioventa.service';
import { ItemServiceService } from '../../serviciosItem/item-service.service';
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
  array_items_completo: [];

  cantidad_input: number;

  isCheckedCantidad: boolean = true;
  isCheckedEmpaque: boolean = false;

  userConn: any;
  usuarioLogueado: any;
  BD_storage: any;

  items_post: any = [];

  tarifa_get: any;
  descuento_get: any;
  codcliente_get: any;
  codalmacen_get: any;
  desc_linea_seg_solicitud_get: any;
  fecha_get: any;
  codmoneda_get: any;
  desct_nivel_get: any;
  items_get_carrito: [];
  tamanio_carrito: any;

  constructor(public dialog: MatDialog, private api: ApiService, public dialogRef: MatDialogRef<ItemSeleccionCantidadComponent>,
    public itemservice: ItemServiceService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataItemSeleccionados: any, public servicioPrecioVenta: ServicioprecioventaService,
    @Inject(MAT_DIALOG_DATA) public tarifa: any, @Inject(MAT_DIALOG_DATA) public descuento: any,
    @Inject(MAT_DIALOG_DATA) public codcliente: any, @Inject(MAT_DIALOG_DATA) public codalmacen: any,
    @Inject(MAT_DIALOG_DATA) public desc_linea_seg_solicitud: any, @Inject(MAT_DIALOG_DATA) public fecha: any,
    @Inject(MAT_DIALOG_DATA) public codmoneda: any, public servicioDesctEspecial: DescuentoService,
    @Inject(MAT_DIALOG_DATA) public desct_nivel: any, @Inject(MAT_DIALOG_DATA) public items: any) {

    this.dataItemSeleccionados_get = dataItemSeleccionados.dataItemSeleccionados;
    console.log(this.dataItemSeleccionados_get);

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.tarifa_get = tarifa.tarifa;
    this.descuento_get = descuento.descuento;
    this.codcliente_get = codcliente.codcliente;
    this.codalmacen_get = codalmacen.codalmacen;
    this.desc_linea_seg_solicitud_get = desc_linea_seg_solicitud.desc_linea_seg_solicitud;
    this.fecha_get = fecha.fecha;
    this.codmoneda_get = codmoneda.codmoneda;
    this.desct_nivel_get = desct_nivel.desct_nivel;
    this.items_get_carrito = items.items;
    this.tamanio_carrito = this.items_get_carrito.length;

    console.log("Items de carrito: " + JSON.stringify(this.items_get_carrito), "Tamanio: " + this.tamanio_carrito)
  }

  ngOnInit() {
    this.getTarifa();
    this.getDescuentos();

    // descuentos
    this.servicioDesctEspecial.disparadorDeDescuentos.subscribe(data => {
      console.log("Recibiendo Descuento: ", data);
      this.cod_descuento_modal = data.descuento;
      this.cod_descuento_modal_codigo = this.cod_descuento_modal.codigo;
      this.cod_precio_venta_modal_codigo = data.precio_sugerido;
    });
    // findescuentos

    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;
      this.cod_descuento_modal_codigo = data.precio_sugerido;
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
    let a;

    const nuevosItems: [] = this.dataItemSeleccionados_get.map((elemento) => {
      return {
        coditem: elemento,
        tarifa: this.cod_precio_venta_modal_codigo, //cod_precio_venta_modal_codigo
        descuento: this.cod_descuento_modal_codigo, //cod_descuento_modal_codigo
        cantidad_pedida: this.cantidad_input,
        cantidad: this.cantidad_input,
        codcliente: this.codcliente_get,
        opcion_nivel: this.desct_nivel_get,
        codalmacen: this.codalmacen_get,
        desc_linea_seg_solicitud: this.desc_linea_seg_solicitud_get === "" ? "0" : this.desc_linea_seg_solicitud_get,
        codmoneda: this.codmoneda_get,
        fecha: this.fecha_get,
      };
    });

    console.log("Items para enviar a /venta/transac/veproforma/getItemMatriz_AnadirbyGroup/: " + JSON.stringify(nuevosItems));




    if (!this.isCheckedCantidad) {
      const errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: /venta/transac/veproforma/getCantfromEmpaque/";

      console.log("check de empaque minimo activo");
      this.api.create("/venta/transac/veproforma/getCantfromEmpaque/" + this.userConn, nuevosItems)
        .subscribe({
          next: (datav) => {
            if (this.tamanio_carrito > 0) {
              console.log("HAY ITEMS EN EL CARRITO LA CARGA SE CONCATENA");
              a = this.items_post.concat(datav, this.items_get_carrito);
            } else {
              console.log("NO HAY ITEMS EN EL CARRITO LA CARGA NO SE CONCATENA");
              a = this.items_post = datav;
            }
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
            // Enviar los items al servicio (asumo que esta función está definida en otro lugar)
            this.enviarItemsAlServicio(a);
            this.dialogRef.close();
            // this.num_hoja = 0;
          }
        });
    } else {
      console.log("SOLO CANTIDAD");
      const errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta: /venta/transac/veproforma/getItemMatriz_AnadirbyGroup/";

      this.api.create("/venta/transac/veproforma/getItemMatriz_AnadirbyGroup/" + this.userConn + "/" + this.BD_storage.bd + "/" + this.usuarioLogueado, nuevosItems)
        .subscribe({
          next: (datav) => {
            if (this.tamanio_carrito > 0) {
              console.log("HAY ITEMS EN EL CARRITO LA CARGA SE CONCATENA");
              a = this.items_post.concat(datav, this.items_get_carrito);
            } else {
              console.log("NO HAY ITEMS EN EL CARRITO LA CARGA NO SE CONCATENA");
              a = this.items_post = datav;
            }
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
            // Enviar los items al servicio (asumo que esta función está definida en otro lugar)
            this.enviarItemsAlServicio(a);
            this.dialogRef.close();
            // this.num_hoja = 0;
          }
        });
    }





  }



  enviarItemsAlServicio(items: any[]) {
    this.itemservice.enviarItemsDeSeleccionAMatriz(items);
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