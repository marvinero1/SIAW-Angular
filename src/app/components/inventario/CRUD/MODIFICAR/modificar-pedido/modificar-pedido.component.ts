import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogoProvedoresComponent } from '@components/mantenimiento/compras/proveedores/catalogo-provedores/catalogo-provedores.component';
import { ProvedoresService } from '@components/mantenimiento/compras/proveedores/servicio-proveedores/provedores.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { MatrizItemsClasicaComponent } from '@components/mantenimiento/ventas/matriz-items-clasica/matriz-items-clasica.component';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { BuscadorAvanzadoPedidosComponent } from '@components/uso-general/buscador-avanzado-pedidos/buscador-avanzado-pedidos.component';
import { BuscadorAvanzadoService } from '@components/uso-general/servicio-buscador-general/buscador-avanzado.service';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { ItemDetalle } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modificar-pedido',
  templateUrl: './modificar-pedido.component.html',
  styleUrls: ['./modificar-pedido.component.scss']
})
export class ModificarPedidoComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler4(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      // console.log(`Elemento enfocado: ${elementTagName}`);

      switch (elementTagName) {
        case "input_search":
          this.transferirPedidoIdNumID();
          break;
      }
    }
  };


  public nombre_ventana: string = "docmodifinpedido.vb";
  public ventana: string = "Modificar Pedido";
  public detalle = "Modif Pedido";
  public tipo = "transaccion-docinpedido-POST";

  id: any;
  numeroid: any;
  codigo_pedido: any;
  codalmorigenText: any;
  codalmorigenTextDescipcion: any;
  codalmdestidoText: any;
  observaciones: any;

  public array_items_carrito_y_f4_catalogo: any = [];
  public item_seleccionados_catalogo_matriz: any = [];
  private numberFormatter_2decimales: Intl.NumberFormat;

  fecha_actual: any;
  fecha_servidor: any;
  fecha_ULPedido: any;
  hora_actual: any;
  almacen_seleccionado: any;
  anulado: any;
  proveedor_id: any;
  razonsocial_proveedor: any;

  grabarReadOnly: any;

  public array_almacenes: any = [];
  private unsubscribe$ = new Subject<void>();

  item: any;
  item_obj_seleccionado: any;
  selectedProducts: ItemDetalle[] = [];

  //buscadorAvanzado
  array_pedido_ids: any = [];
  id_ntpedido_buscador: any;
  num_ntpedido_buscador: any;
  //Saldos
  almacenes_saldos: any = [];
  almacn_parame_usuario: any;
  almacn_parame_usuario_almacen: any;
  cod_precio_venta_modal_codigo: any;
  cod_descuento_modal: any;

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;


  constructor(private dialog: MatDialog, private api: ApiService, private itemservice: ItemServiceService,
    private almacenservice: ServicioalmacenService, private cdr: ChangeDetectorRef, private datePipe: DatePipe,
    public nombre_ventana_service: NombreVentanaService, private spinner: NgxSpinnerService, private messageService: MessageService,
    private servicioProvedores: ProvedoresService, public servicioBuscadorAvanzado: BuscadorAvanzadoService,) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.almacenes_saldos = [{
      saldo1: "311 : 0.00",
      saldo2: "100 : 0.00",
      saldo3: "411 : 0.00",
      saldo4: "811 : 0.00",
      smax: "00.00",
      smin: "00.00",
    }]

    // Crear instancia única de Intl.NumberFormat
    this.numberFormatter_2decimales = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }


  ngOnInit() {
    this.getAlmacen();
    this.getHoraFechaServidorBckEnd();
    this.getIdPedido();
    this.getUltimoPedido();

    //ACA LLEGA EL EL ARRAY DEL CARRITO DE COMPRAS 
    this.itemservice.disparadorDeItemsYaMapeadosAProforma.pipe(takeUntil(this.unsubscribe$)).subscribe(data_carrito => {
      console.log("Recibiendo Item de Carrito Compra: ", data_carrito);
      // console.log("ARRAY COMPLETO DE MATRIZ Y F4: ", this.array_items_carrito_y_f4_catalogo);

      if (this.array_items_carrito_y_f4_catalogo.length === 0) {
        // Si el array está vacío, simplemente agregamos los nuevos elementos
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito.map((element) => ({
          ...element,
          nuevo: "si",
          codaduana: "0",
          diferencia: 0,
          cantidad_revisada: element.cantidad
        })));
      } else {
        // this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat(this.item_seleccionados_catalogo_matriz);
        // Si el array ya tiene elementos, concatenamos los nuevos elementos con los existentes
        this.array_items_carrito_y_f4_catalogo.push(...data_carrito.map((element) => ({
          ...element,
          nuevo: "si",
          codaduana: "0",
          diferencia: 0,
          cantidad_revisada: element.cantidad
        })));
      }
    });
    //

    // CATALOGO F4 ITEMS
    // ItemElejidoCatalogoF4Procesados
    this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Item Procesados De Catalogo F4: ", [data]);
      this.item_seleccionados_catalogo_matriz = [data];
      console.log("🚀 ~ ProformaComponent ~ this.itemservice.disparadorDeItemsYaMapeadosAProformaF4.pipe ~ data:", [data]);

      if (this.item_seleccionados_catalogo_matriz.length === 0) {
        this.array_items_carrito_y_f4_catalogo.push(...[data]);
      } else {
        this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.concat([data].map((element) => ({
          ...element,
          nuevo: "si",
          codaduana: "0",
          diferencia: 0,
        })));
      }

      this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
        ...element,
        codaduana: "0",
        cantidad_revisada: element.cantidad
      }));
    });
    //

    //Proveedror Catalogo
    this.servicioProvedores.disparadorDeProvedor.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Proveedor: ", data);
      this.proveedor_id = data.proveedor.codigo
      this.razonsocial_proveedor = data.proveedor.razonsocial
    });
    //

    //Buscador Avanzado Servicio
    this.servicioBuscadorAvanzado.disparadorDePedidoSeleccionado.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Pedido De Buscador Avanzado: ", data);
      this.id_ntpedido_buscador = data.buscador_id;
      this.num_ntpedido_buscador = data.buscador_num_id;
      this.transferirPedidoIdNumID();
    });
    //
  }

  getIdPedido() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/intipopedido/catalogo/";
    return this.api.getAll('/inventario/mant/intipopedido/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.array_pedido_ids = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getUltimoPedido() {
    this.spinner.show();
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/modif/docmodifinpedido/getUltiPedidoId/"
    return this.api.getAll(`/inventario/modif/docmodifinpedido/getUltiPedidoId/${this.userConn}`).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarPedidoComponent ~ returnthis.api.getAll ~ datav:", datav);
        this.id = datav.id;
        this.numeroid = datav.numeroid;
        this.codigo_pedido = datav.codigo
        this.getDataCodigoPedido(datav.id, datav.numeroid, datav.codigo);
      },

      error: (err: any) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      },
      complete: () => { }
    })
  }

  getDataCodigoPedido(id, numeroid, codigo) {
    this.spinner.show();
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/modif/docmodifinpedido/obtPedidoxModif/"
    return this.api.getAll(`/inventario/modif/docmodifinpedido/obtPedidoxModif/${this.userConn}/${id}/${numeroid}`).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarPedidoComponent ~ returnthis.api.getAll ~ datav:", datav)

        this.anulado = datav.cabecera.anulado;
        this.codalmorigenText = datav.cabecera.codalmacen;
        this.codalmdestidoText = datav.cabecera.codalmdestino;
        this.fecha_ULPedido = this.datePipe.transform(datav.cabecera.fechareg, "yyyy-MM-dd");
        this.observaciones = datav.cabecera.obs

        this.grabarReadOnly = datav.grabarReadOnly;
        this.array_items_carrito_y_f4_catalogo = datav.detalle;
      },

      error: (err: any) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      },
      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      }
    })
  }

  //ALMACEN
  getAlmacen() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll(`/inventario/mant/inalmacen/catalogo/${this.userConn}`).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (datav) => {
        this.array_almacenes = datav;
      },

      error: (err: any) => {
        console.log(err, errorMessage);
      },
      complete: () => { }
    })
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          // console.log(datav);
          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
          this.hora_actual = datav.horaServidor;
          this.fecha_servidor = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
          //this.getMonedaTipoCambio(this.moneda_get_catalogo);
        }
      })
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.array_almacenes.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }
  //FIN ALMACEN

  onRowSelect(event: any) {
    console.log('Row Selected:', event);
    this.item = event.data.coditem;
    this.item_obj_seleccionado = event.data.coditem;

    this.updateSelectedProducts();
    this.getAlmacenesSaldos(event.data.coditem);
  }

  onRowSelectForDelete() {
    // Filtrar el array para eliminar los elementos que están en el array de elementos seleccionados
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {
      return !this.selectedProducts.some(selectedItem =>
        selectedItem.orden === item.orden && selectedItem.coditem === item.coditem);
    });

    // Limpiar el array de productos seleccionados
    this.selectedProducts = [];
  }

  onRowUnselect(event: any) {
    // console.log('Row Unselected:', event.data);
    this.updateSelectedProducts();
  }

  updateSelectedProducts() {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement) {
      const elementTagName = focusedElement.id;
      console.log(`Elemento enfocado: ${elementTagName}`);
    }
  }

  getAlmacenesSaldos(codigo) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinpedido/getSaldoStock/";
    return this.api.getAll('/inventario/transac/docinpedido/getSaldoStock/' + this.userConn + "/" + codigo +
      "/" + this.usuarioLogueado + "/" + this.agencia_logueado + "/" + this.BD_storage)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (datav) => {
          this.almacenes_saldos = [datav];
          console.log("getAlmacenesSaldos: ", datav);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminarItemTabla(orden, coditem) {
    // Filtrar el array para eliminar el elemento con el número de orden dado y el código de ítem
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.filter(item => {

      return item.orden !== orden || item.coditem !== coditem;
    });
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => ({
      ...element,
      codaduana: element.codaduana === undefined ? "0" : element.codaduana
    }));
  }

  formatNumberTotalSubTOTALES(numberString: number): string {
    if (numberString === null || numberString === undefined) {
      return '0.00'; // O cualquier valor predeterminado que desees devolver
    }

    // Convertir a cadena de texto y luego reemplazar la coma por el punto y convertir a número
    const formattedNumber = parseFloat(numberString.toString().replace(',', '.'));
    return this.numberFormatter_2decimales.format(formattedNumber);
  }

  selectCheckDetalle(event: any) {
    console.log('Row Selected:', event);

    console.log(this.array_items_carrito_y_f4_catalogo);
  }

  aplicarProveedorItemsSeleccionados() {
    if (this.proveedor_id === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'SELECCIONE PROVEEDOR' });
      return;
    };

    if (this.array_items_carrito_y_f4_catalogo.every(item => item.seleccion === false)) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'HAGA CHECK EN ITEM DEL DETALLE' });
    }


    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => {
      if (element.seleccion === true) {
        return {
          ...element,
          codproveedor: this.proveedor_id,
          desccodproveedor: this.razonsocial_proveedor,
        };
      }
      return element; // Retorna el objeto sin cambios si no cumple la condición
    });
  }

  async quitarProveedorItemsSeleccionados() {
    const result = await this.openConfirmationDialog(`¿ DESEA ELIMINAR LOS PROVEEDORES DEL DETALLE ?`);
    if (result) {
      this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((element) => {
        if (element.seleccion === true) {
          return {
            ...element,
            codproveedor: 0,
            desccodproveedor: "",
          };
        }
        return element; // Retorna el objeto sin cambios si no cumple la condición
      });

      setTimeout(() => {
        this.spinner.hide();
      }, 500);
      return;
    } else (
      this.messageService.add({ severity: 'info', summary: 'Informacion', detail: 'NO SE MODIFICO ' })
    )
  }

  // BUSCADOR ID NUMID
  checkAllDetalle() {
    this.spinner.show();
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((elements) => ({
      ...elements,
      seleccion: true
    }));
    console.log("🚀 ~ ModificarPedidoComponent items_carrito_y_f4_catalogo:", this.array_items_carrito_y_f4_catalogo)

    setTimeout(() => {
      this.spinner.hide();
    }, 100);
    return this.array_items_carrito_y_f4_catalogo;
  }

  desCheckAllDetalle() {
    this.spinner.show();
    this.array_items_carrito_y_f4_catalogo = this.array_items_carrito_y_f4_catalogo.map((elements) => ({
      ...elements,
      seleccion: false
    }));
    console.log("🚀 ~ ModificarPedidoComponent items_carrito_y_f4_catalogo:", this.array_items_carrito_y_f4_catalogo)

    setTimeout(() => {
      this.spinner.hide();
    }, 100);
    return this.array_items_carrito_y_f4_catalogo;
  }

  transferirPedidoIdNumID() {
    if (this.id_ntpedido_buscador === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA ID PEDIDO' });
      return;
    }

    if (this.num_ntpedido_buscador === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'FALTA NUM ID PEDIDO' });
      return;
    }

    this.spinner.show();
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/modif/docmodifinpedido/obtPedidoxModif/"
    return this.api.getAll(`/inventario/modif/docmodifinpedido/obtPedidoxModif/${this.userConn}/${this.id_ntpedido_buscador}/${this.num_ntpedido_buscador}`).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (datav) => {
        console.log("🚀 ~ ModificarPedidoComponent ~ returnthis.api.getAll ~ datav:", datav)

        this.numeroid = datav.cabecera.numeroid;
        this.anulado = datav.cabecera.anulado;
        this.codalmorigenText = datav.cabecera.codalmacen;
        this.codalmdestidoText = datav.cabecera.codalmdestino;
        this.observaciones = datav.cabecera.obs
        this.fecha_ULPedido = this.datePipe.transform(datav.cabecera.fechareg, "yyyy-MM-dd");


        this.grabarReadOnly = datav.grabarReadOnly;
        this.array_items_carrito_y_f4_catalogo = datav.detalle;
      },

      error: (err: any) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      },
      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      }
    })
  }

  async anularPedido() {
    const result = await this.openConfirmationDialog(`¿ DESEA ANULAR ESTE PEDIDO ?`);
    if (!result) {
      return; // Retorna el objeto sin cambios si no cumple la condición
    } else {
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/modif/docmodifinpedido/obtPedidoxModif/"
      return this.api.update(`/inventario/modif/docmodifinpedido/anularPedido/${this.userConn}/${this.codigo_pedido}/${this.usuarioLogueado}`, [])
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            console.log("🚀 ~ ModificarPedidoComponent ~ .pipe ~ datav:", datav)
            this.messageService.add({ severity: 'info', summary: 'Informacion', detail: datav.resp });
            this.id_ntpedido_buscador = this.id;
            this.num_ntpedido_buscador = this.numeroid;

            this.transferirPedidoIdNumID();
          },

          error: (err: any) => {
            console.log(err, errorMessage);
            setTimeout(() => {
              this.spinner.hide();
            }, 10);
          },
          complete: () => {
            setTimeout(() => {
              this.spinner.hide();
            }, 10);
          }
        })
    }
  }

  async habilitarPedido() {
    const result = await this.openConfirmationDialog(`¿ DESEA HABILITAR ESTE PEDIDO ?`);
    if (!result) {
      return; // Retorna el objeto sin cambios si no cumple la condición
    } else {
      this.spinner.show();
      let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/modif/docmodifinpedido/obtPedidoxModif/"
      return this.api.update(`/inventario/modif/docmodifinpedido/habilitarPedido/${this.userConn}/${this.codigo_pedido}/${this.usuarioLogueado}`, [])
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            console.log("🚀 ~ ModificarPedidoComponent ~ .pipe ~ datav:", datav)
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });
            this.id_ntpedido_buscador = this.id;
            this.num_ntpedido_buscador = this.numeroid;

            this.transferirPedidoIdNumID();
          },

          error: (err: any) => {
            console.log(err, errorMessage);
            setTimeout(() => {
              this.spinner.hide();
            }, 10);
          },
          complete: () => {
            setTimeout(() => {
              this.spinner.hide();
            }, 10);
          }
        })
    }
  }

  grabar() {
    let array_doc = {
      cabecera: {
        codigo: this.codigo_pedido,
        id: this.id,
        numeroid: this.numeroid,
        codalmacen: this.codalmorigenText,
        codalmdestino: this.codalmdestidoText,
        fecha: this.fecha_actual,
        obs: this.observaciones,
        horareg: this.hora_actual,
        fechareg: this.fecha_ULPedido,
        usuarioreg: this.usuarioLogueado,
        anulado: this.anulado
      },
      tablaDetalle: this.array_items_carrito_y_f4_catalogo
    }

    this.spinner.show();
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET /inventario/modif/docmodifinpedido/grabarDocumento/"
    return this.api.create(`/inventario/modif/docmodifinpedido/grabarDocumento/${this.userConn}/${this.BD_storage}`, array_doc)
      .pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: async (datav) => {
          console.log("🚀 ~ ModificarPedidoComponent ~ .pipe ~ grabar:", datav);
          if (datav.valido) {
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp });
            const result = await this.openConfirmationOKDialog(datav.resp);
            if (result) {
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: datav.resp });
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          setTimeout(() => {
            this.spinner.hide();
          }, 10);
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 10);
        }
      })
  }









  modalAlmacen(almacen): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { almacen: "almacen" }
    });

    this.almacen_seleccionado = almacen;
    console.log("🚀 ~ NotamovimientoComponent ~ modalAlmacen ~ this.almacen_seleccionado:", this.almacen_seleccionado)
  }

  modalBuscadorAvanzado() {
    this.dialog.open(BuscadorAvanzadoPedidosComponent, {
      width: '900px',
      height: 'auto',
      disableClose: true,
    });
  }

  modalMatrizClasica(): void {
    // Realizamos todas las validaciones
    this.dialog.open(MatrizItemsClasicaComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: {
        descuento: "0",
        codcliente: "0",
        codcliente_real: "0",
        codalmacen: this.agencia_logueado,
        desc_linea_seg_solicitud: "false",
        codmoneda: "BS",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        items: [],
        descuento_nivel: 0,
        tamanio_carrito_compras: this.array_items_carrito_y_f4_catalogo.length,
        tipo_ventana: "inventario",
        id_proforma: this.id,
        num_id_proforma: this.numeroid,
      }
    });
  }

  modalCatalogoProductos(): void {
    this.dialog.open(ModalItemsComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {
        tarifa: 1,
        descuento: 0,
        codcliente: 0,
        codalmacen: this.agencia_logueado,
        desc_linea_seg_solicitud: "",
        codmoneda: "BS",
        fecha: this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd"),
        descuento_nivel: "ACTUAL",
        tipo_ventana: "inventario",
      },
    });
  }

  catalagoProveedor() {
    this.dialog.open(CatalogoProvedoresComponent, {
      width: '470px',
      height: 'auto',
      disableClose: true,
    });
  }

  openConfirmationDialog(message: string): Promise<boolean> {
    //btn si/no
    const dialogRef = this.dialog.open(DialogConfirmActualizarComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  openConfirmationOKDialog(message: string): Promise<boolean> {
    //btn ok
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
