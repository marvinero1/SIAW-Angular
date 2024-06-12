import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CatalogoMovimientoMercaderiaComponent } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/catalogo-movimiento-mercaderia/catalogo-movimiento-mercaderia.component';
import { MovimientomercaderiaService } from '@components/mantenimiento/inventario/conceptosmovimientosmercaderia/serviciomovimientomercaderia/movimientomercaderia.service';
import { CatalogoNotasMovimientoComponent } from '@components/mantenimiento/inventario/numnotasdemovimiento/catalogo-notas-movimiento/catalogo-notas-movimiento.component';
import { NotasMovimientoService } from '@components/mantenimiento/inventario/numnotasdemovimiento/serviciocatalogonotasmovimiento/notas-movimiento.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmacionNotasAjustesComponent } from './confirmacion-notas-ajustes/confirmacion-notas-ajustes.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { VendedorService } from '@components/mantenimiento/ventas/serviciovendedor/vendedor.service';
import { ModalVendedorComponent } from '@components/mantenimiento/ventas/modal-vendedor/modal-vendedor.component';
import { ServiceRefreshItemsService } from '../services-refresh-item/service-refresh-items.service';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';

@Component({
  selector: 'app-notas-ajustes',
  templateUrl: './notas-ajustes.component.html',
  styleUrls: ['./notas-ajustes.component.scss']
})
export class NotasAjustesComponent implements OnInit {

  FormularioData: FormGroup;

  hora_actual = new Date();
  fecha_actual = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  public cod_vendedor_cliente_modal: string;
  public notas_movimiento_get: string;
  notas_movimiento_get_codigo: string;
  concepto_movimiento_concepto: string;
  notas_movimiento_get_nro_actual: string;
  concepto_movimiento_codigo: string;
  concepto_movimiento_descripcion: string;
  concepto_movimiento_factor: any;
  concepto_movimiento_concat: string;
  userConn: any;
  dataform: any = '';
  sobrantesFisicos = false;
  faltantesFisicos = false;
  disabled = false;
  disabled_FF = false;
  cabecera: any = [];
  cabecera_items: any = [];
  cod_almacen_cliente: any = [];
  cod_almacen_cliente_origen: any = [];
  cod_almacen_cliente_destinado: any = [];
  items_positivos: any = [];
  items_negativos: any = [];
  save_ajustes: any = [];

  nombre_ventana: string = "prggeneraajuste.vb";
  public ventana = "Generar Notas de Ajuste"

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<NotasAjustesComponent>,
    private api: ApiService, @Inject(MAT_DIALOG_DATA) public dataInventario: any,
    @Inject(MAT_DIALOG_DATA) public item_ajustes: any, public log_module: LogService,
    private _formBuilder: FormBuilder, public nombre_ventana_service: NombreVentanaService,
    private toastr: ToastrService, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    public serviciovendedor: VendedorService, public notasMovimientoService: NotasMovimientoService,
    public servicioMovimientoMercaderia: MovimientomercaderiaService, public almacenservice: ServicioalmacenService,
    private refreshItemSer: ServiceRefreshItemsService) {

    this.cabecera = this.dataInventario.dataInventario;
    this.cabecera_items = this.item_ajustes.item_ajustes
    console.log(this.cabecera, this.cabecera_items);

    this.FormularioData = this.createForm();
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    console.log("Sobrantes: " + this.sobrantesFisicos, "Faltantes Fisicos: " + this.faltantesFisicos);

    this.notasMovimientoService.disparadorDeNotasMovimiento.subscribe(data => {
      console.log("Recibiendo Notas de Movimiento: ", data);
      this.notas_movimiento_get = data.movimiento;
      this.notas_movimiento_get_codigo = data.movimiento.codigo;
      this.notas_movimiento_get_nro_actual = data.movimiento.nroactual + 1;
      console.log(this.notas_movimiento_get);
    });

    this.servicioMovimientoMercaderia.disparadorDeConceptos.subscribe(data => {
      console.log("Recibiendo Concepto Mercaderia: ", data);
      console.log("Factor Concepto" + data.concepto.factor);

      this.concepto_movimiento_codigo = data.concepto.codigo;
      this.concepto_movimiento_descripcion = data.concepto.descripcion;
      this.concepto_movimiento_factor = data.concepto.factor;
      this.concepto_movimiento_concat = data.concepto.codigo + " - " + data.concepto.descripcion;
      console.log(this.concepto_movimiento_factor);
    });

    this.serviciovendedor.disparadorDeVendedores.subscribe(data => {
      console.log("Recibiendo Vendedor: ", data);
      this.cod_vendedor_cliente_modal = data.vendedor;
    });

    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.cod_almacen_cliente = data.almacen;
    });

    this.almacenservice.disparadorDeAlmacenesOrigen.subscribe(data => {
      console.log("Recibiendo Almacen Origen: ", data);
      this.cod_almacen_cliente_origen = data.almacen;
    });

    this.almacenservice.disparadorDeAlmacenesDestino.subscribe(data => {
      console.log("Recibiendo Almacen Destino: ", data);
      this.cod_almacen_cliente_destinado = data.almacen;
    });
  }

  createForm(): FormGroup {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    console.log(usuario_logueado);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      numeroid: [{ value: this.dataform.numeroid, disabled: true }, Validators.compose([Validators.required])],
      codconcepto: [this.concepto_movimiento_codigo],
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      fecha: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      codalmacen: [this.dataform.codalmacen],
      codalmorigen: [this.dataform.codalmorigen],
      codalmdestino: [this.dataform.codalmdestino],
      obs: [this.dataform.obs],
      factor: [this.dataform.factor],
      anulada: false,
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.dataform.fechareg, "yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
      fid: ["-"],
      fnumeroid: [0],
      peso: [0],

      // factor: 0, de concepto
      // fid: string,
      // fnumeroid: 0,
      // anulada: true,
      // contabilizada: true,
      // comprobante: 0,
      // peso: 0,
      // idproforma: string,
      // numeroidproforma: 0,
      // codcliente: string,
      // idproforma_sol: string,
      // numeroidproforma_sol: 0
    });
  }

  submitData() {
    let ventana = "Generar Notas de Ajustes";
    let detalle = "Generar Notas de Ajustes-POST";
    let tipo = "GenerarNotasAjustes-POST";

    // let data = this.FormularioData.value;
    console.log("Faltantes Fisicos" + this.faltantesFisicos, "Sobrantes Fisicos" + this.sobrantesFisicos);
    //cuando los items son negativos van con esta variable en TRUE
    this.sobrantesFisicos
    //cuando los items son positivos van con esta variable en TRUE
    this.faltantesFisicos
    //filtro de positivos y megativos de los items.
    this.items_positivos = this.cabecera_items.filter(entry => entry.dif >= 0);
    this.items_negativos = this.cabecera_items.filter(entry => entry.dif < 0);

    console.log(this.items_positivos);
    console.log(this.items_negativos);

    let data_items_positivos = {
      inmovimientoCab: this.FormularioData.value,
      detalleInvConsol: this.items_positivos
    }

    let data_items_negativos = {
      inmovimientoCab: this.FormularioData.value,
      detalleInvConsol: this.items_negativos
    }
    // console.log(data_items_positivos);
    // console.log(data_items_negativos);

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/transac/prggeneraajuste/";

    const dialogRef = this.dialog.open(ConfirmacionNotasAjustesComponent, {
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        if (this.faltantesFisicos) {
          return this.api.create("/inventario/transac/prggeneraajuste/" + this.userConn, data_items_positivos)
            .subscribe({
              next: (datav) => {
                console.log(datav);
                this.save_ajustes = datav;
                this.log_module.guardarLog(ventana, detalle, tipo);

                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1500);

                this.toastr.success('Guardado con Exito! 🎉');
                this.close();
              },

              error: (err) => {
                console.log(err, errorMessage);
                this.toastr.error('! NO SE GUARDO !');
              },
              complete: () => { }
            })
        } else {
          return this.api.create("/inventario/transac/prggeneraajuste/" + this.userConn, data_items_negativos)
            .subscribe({
              next: (datav) => {
                console.log(datav);
                this.save_ajustes = datav;
                this.log_module.guardarLog(ventana, detalle, tipo);

                this.spinner.show();
                setTimeout(() => {
                  this.spinner.hide();
                }, 1500);

                this.toastr.success('Guardado con Exito! 🎉');
                this.close();
              },

              error: (err) => {
                console.log(err, errorMessage);
                this.toastr.error('! NO SE GUARDO !');
              },
              complete: () => { }
            })
        }
      } else {
        this.toastr.error('! SE CANCELO EL AJUSTE !');
      }
    })
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  modalNotasMovimiento() {
    this.dialog.open(CatalogoNotasMovimientoComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  modalAlmacenOrigen() {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { origen: "origen" }
    });
  }

  modalAlmacenDestino() {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { destino: "destino" }
    });
  }

  modalVendedor(): void {
    this.dialog.open(ModalVendedorComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalcatalogoConcepto() {
    this.dialog.open(CatalogoMovimientoMercaderiaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  close() {
    this.dialogRef.close();
    this.refreshItemSer.callItemFunction();
  }
}
