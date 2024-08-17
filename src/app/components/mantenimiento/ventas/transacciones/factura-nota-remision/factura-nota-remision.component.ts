import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
export interface PeriodicElement {
  numero: number;
  descuento: number;
  subtotal: number;
  recargos: number;
  montoiva: number;
  total: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { numero: 1, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 2, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 3, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 4, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 5, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 6, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 7, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 8, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 9, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 10, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
  { numero: 11, descuento: 0.00, subtotal: 528.65, recargos: 0.00, montoiva: 1.0079, total: 582.20 },
];

@Component({
  selector: 'app-factura-nota-remision',
  templateUrl: './factura-nota-remision.component.html',
  styleUrls: ['./factura-nota-remision.component.scss']
})
export class FacturaNotaRemisionComponent implements OnInit {

  public nombre_ventana: string = "prgfacturarNR_cufd.vb";
  public ventana: string = "Facturacion FEL";
  public detalle = "Facturacion FEL";
  public tipo = "transaccion-fact_fel-POST";


  almacn_parame_usuario: any = [];
  selectedItems!: any[];
  CUFD: any = 'BRXxDSmZDQkE=NzThERTczRUFFOTY=QnxIVUFHU0lZVUFIwQ0ZBRjRBNzk5M'


  hora_fecha_server: any = [];
  fecha_actual: any;
  fecha_actual_format: any;

  almacn_parame_usuario_almacen: any;
  cod_precio_venta_modal_codigo: any;
  cod_descuento_modal: any;
  cod_control: string;
  id_proforma_numero_id: any;


  public moneda_get_catalogo: any;
  public moneda_get_fuction: any = [];


  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  displayedColumns: string[] = ['numero', 'subtotal', 'recargos', 'montoiva', 'total'];
  dataSource = ELEMENT_DATA;

  items = Array.from({ length: 100000 }, (_, i) => ({
    label: `20240812 #${i}`, value: i + `VALOR CRECIENTE`
  }))



  // dataSource = new MatTableDataSource();
  // dataSourceWithPageSize = new MatTableDataSource();

  constructor(public dialog: MatDialog, private api: ApiService, private datePipe: DatePipe, public nombre_ventana_service: NombreVentanaService) {
    this.cod_control = '9F6F73D67AE8E74'
    /*let usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;*/

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.fecha_actual_format = this.datePipe.transform(this.fecha_actual, 'dd-MM-yyyy');

    this.mandarNombre();
    this.getHoraFechaServidorBckEnd();
    this.getAlmacenParamUsuario();
    this.getAllmoneda();
  }

  getHoraFechaServidorBckEnd() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/venta/transac/veproforma/fechaHoraServidor/";
    return this.api.getAll('/venta/transac/veproforma/fechaHoraServidor/' + this.userConn)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.fecha_actual = this.datePipe.transform(datav.fechaServidor, "yyyy-MM-dd");;
          this.hora_fecha_server = datav.horaServidor;


          console.log(this.fecha_actual, this.hora_fecha_server);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getAllmoneda() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get_fuction = datav;
          console.log(this.moneda_get_fuction);
          const encontrado = this.moneda_get_fuction.some((moneda) => moneda.codigo === 'BS');

          if (encontrado) {
            console.log("HAY BS")
            this.moneda_get_catalogo = "BS";
            console.log(encontrado, this.moneda_get_catalogo);
            //this.getMonedaTipoCambio(this.moneda_get_catalogo);
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacenParamUsuario() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adusparametros/getInfoUserAdus/";
    return this.api.getAll('/seg_adm/mant/adusparametros/getInfoUserAdus/' + this.userConn + "/" + this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.almacn_parame_usuario = datav;
          console.log('data', this.almacn_parame_usuario);

          //this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.cod_precio_venta_modal_codigo = this.almacn_parame_usuario.codtarifa;
          this.cod_descuento_modal = this.almacn_parame_usuario.coddescuento;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getIdTipo() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/transac/veproforma/catalogoNumProf/";
    return this.api.getAll('/venta/transac/veremision/getParametrosIniciales/' + this.userConn + "/" + this.usuarioLogueado + "/" + this.BD_storage)
      .subscribe({
        next: (datav) => {
          console.log('data', datav);
          this.almacn_parame_usuario_almacen = datav.id;
          this.id_proforma_numero_id = datav.numeroid;
          this.almacn_parame_usuario_almacen = datav.codalmacen;
          this.moneda_get_catalogo = datav.codmoneda;
          //this.tdc = datav.codtarifadefect;
          //this.cod_descuento_modal_codigo = datav.coddescuentodefect;
          this.cod_precio_venta_modal_codigo = datav.codtarifadefect;
          //this.cod_vendedor_cliente_modal = datav.codvendedor;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }



















  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

}
