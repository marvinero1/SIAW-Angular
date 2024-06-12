import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { CatalogoInventarioComponent } from '../catalogo-inventario/catalogo-inventario.component';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ServicioInventarioService } from '../servicio-inventario/servicio-inventario.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatrizInventarioComponent } from '../matriz-inventario/matriz-inventario.component';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
@Component({
  selector: 'app-registrar-inventario-grupo',
  templateUrl: './registrar-inventario-grupo.component.html',
  styleUrls: ['./registrar-inventario-grupo.component.scss']
})
export class RegistrarInventarioGrupoComponent implements OnInit, AfterViewInit {

  @HostListener("document:keydown.F4", []) unloadHandler(event: KeyboardEvent) {
    this.modalCatalogoProductos();
  }

  cod_inventario: any = [];
  get_observaciones: any = [];
  codigo_item_catalogo: any = [];
  list_item_inventario: any[] = [];
  item_obtenido = [];

  fecha_actual = new Date();
  hora_actual = new Date();
  userConn: any;
  numero_id: any;
  nro: any;
  userLogueado: any;
  verificacion_grupo: string;
  zona: number = 0;
  cantidad_item_matriz: number;

  displayedColumns = ['item', 'descripcion', 'medida', 'unidad', 'zona', 'cantidad'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  nombre_ventana: string = "abmadarea.vb";
  public ventana = "Registro de Inventario por Grupo"
  public detalle = "area-delete";
  public tipo = "area-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService,
    private servicioInventario: ServicioInventarioService, private datePipe: DatePipe, public itemservice: ItemServiceService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {

    this.servicioInventario.disparadorDeInventarios.subscribe(data => {
      console.log("Recibiendo Inventario: ", data);
      this.cod_inventario = data.inventario;
    });

    this.itemservice.disparadorDeItems.subscribe(data => {
      console.log("Recibiendo Item: ", data);
      this.list_item_inventario.push(data);
      this.codigo_item_catalogo = data.item;
      this.cantidad_item_matriz = data.cantidad;
    });

    this.dataSource = new MatTableDataSource(this.list_item_inventario);
  }

  ngAfterViewInit(): void {
    this.list_item_inventario = [];
  }


  //   refrescar ruta ingrupoper getObs
  //   {
  //   "codinvconsol": 91, guardar
  //   "codgrupo": 1529, guardar
  //   "obs": "SAMUEL" mpostrar
  // }

  // luego docinfisico POST validarInvGrup
  // si es true, ya se creo la cabezaera y esta habilitado y pasa a la otra NombreVentanaService

  // luego cargar datos cabecera
  //   "codinvconsol": 91,
  //     "codgrupo": 1529
  // a datosCabecera docinfisico


  refrescar() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/ingrupoper/getObs/' + this.userConn + "/" + this.cod_inventario.id + "/" + this.numero_id + "/" + this.nro)
      .subscribe({
        next: (datav) => {
          this.get_observaciones = datav;
          console.log(this.get_observaciones);
          this.spinner.show();
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  crearCabecera() {
    let data = [];
    let fecha_now = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /seg_adm/mant/adarea/";
    return this.api.create("/inventario/transac/docinfisico/validaInvGrup/" + this.userConn + "/" + this.cod_inventario.id + "/" + this.numero_id + "/" + this.nro + "/" + hora_actual_complete + "/" + fecha_now + "/" + "dpd2", data)
      .subscribe({
        next: (datav) => {
          this.verificacion_grupo = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! Ya se registro esa toma de inventario, Para llevar a cabo modificaciones por favor entre a Revision de Toma de Inventario. !');
        },
        complete: () => { }
      })
  }

  limpiar() {
    this.cod_inventario.id = "";
    this.numero_id = "";
    this.get_observaciones.obs = "";
    this.nro = "";
  }

  limpiarCantidades() {

  }

  matrizModal() {

  }

  guardarInventario() {


  }

  catalogoInventario() {
    this.dialog.open(CatalogoInventarioComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  modalCatalogoProductos(): void {
    this.dialog.open(ModalItemsComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalMatrizProductos(): void {
    this.dialog.open(MatrizInventarioComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
}
