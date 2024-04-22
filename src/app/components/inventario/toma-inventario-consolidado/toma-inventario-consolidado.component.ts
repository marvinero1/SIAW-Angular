import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GruposInventariosComponent } from './grupos-inventarios/grupos-inventarios/grupos-inventarios.component';
import { SaldosInventarioConsolidadoComponent } from './saldos/saldos-inventario-consolidado/saldos-inventario-consolidado.component';
import { CatalogoInventarioComponent } from '../catalogo-inventario/catalogo-inventario.component';
import { ServicioInventarioService } from '../servicio-inventario/servicio-inventario.service';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Item } from '@services/modelos/objetos';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConsolidarInventarioComponent } from './consolidar-inventario/consolidar-inventario.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { NotasAjustesComponent } from './notas-ajustes/notas-ajustes.component';
import { LogService } from '@services/log-service.service';
import { ValidarComponent } from './validar/validar.component';
import { DatePipe } from '@angular/common';
import { PeriodoSistemaService } from '@services/periodoSistema/periodo-sistema.service';
import { ServiceRefreshItemsService } from './services-refresh-item/service-refresh-items.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toma-inventario-consolidado',
  templateUrl: './toma-inventario-consolidado.component.html',
  styleUrls: ['./toma-inventario-consolidado.component.scss']
})
export class TomaInventarioConsolidadoComponent implements OnInit {

  fecha_actual = new Date();
  toma_inventario: boolean = true;
  inventario_fisico: boolean = false;
  numero_id: string = '';
  verificacion: boolean;
  estado_inventario: boolean;

  inventario_consolidado: any = [];
  inventario_catalogo: any = [];
  cabecera: any = [];
  items: any = [];
  options: Item[] = [];
  data: [];
  dato1: any = [];
  data_limpiar: any = [];
  item_limpios: any = [];
  veriPerAbi: any = [];
  inventario_get_leave: any = [];

  userConn: any;
  cabecera_codigo: any;
  periodoCerrado: boolean = false;

  myControl = new FormControl<string | Item>('');
  filteredOptions: Observable<Item[]>;

  nombre_ventana: string = "docininvconsol.vb";
  public ventana = "Toma de Inventario Consolidado"
  public detalle = "ActualizarStock-create";
  public tipo = "ActualizarStock-CREATE";

  displayedColumns = ['item', 'descripcion', 'medida', 'unidad', 'cantidad', 'cantidad_sistema', 'diferencia'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(public dialog: MatDialog, public servicio_inventario: ServicioInventarioService, private api: ApiService,
    private spinner: NgxSpinnerService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService,
    public log_module: LogService, private datePipe: DatePipe, public periodoSistema: PeriodoSistemaService, public router: Router) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.getInventarios();
  }

  ngOnInit() {
    this.servicio_inventario.disparadorDeInventarios.subscribe(data => {
      console.log("Recibiendo Inventario: ", data);
      this.inventario_catalogo = data.inventario;
    });
  }

  private _filter(name: string): Item[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: Item): string {
    return user && user.codigo ? user.codigo : '';
  }

  onLeaveIDInventario(event: any) {
    const inputValue = event.target.value;
    let Mayusucalas = inputValue.toUpperCase();

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.inventario_get_leave.some(objeto => objeto.id === Mayusucalas);
    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = Mayusucalas;
    }
    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', Mayusucalas);
  }

  getInventarios() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/oper/prgcrearinv/catalogointipoinv/"
    return this.api.getAll('/inventario/oper/prgcrearinv/catalogointipoinv/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.inventario_get_leave = datav;
          console.log(this.inventario_get_leave);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  guardar() {
    this.refreshItems(this.cabecera.codigo);
    let errorMessage: string = "Guardar Inventario Consolidado";
    const dialogRef = this.dialog.open(ValidarComponent, {
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        console.log(this.items);

        return this.api.create('/inventario/oper/docininvconsol/addDataininvconsol1/' + this.userConn + "/" + this.cabecera.codigo, this.items)
          .subscribe({
            next: () => {
              this.toastr.success('!GUARDADO EXITOSAMENTE!');
            },
            error: (err: any) => {
              console.log(err, errorMessage);
              this.toastr.error('! NO GUARDO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  eliminar() {
    let codigo = this.cabecera.codigo;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- inventario/oper/docininvconsol/limpiarDataininvconsol1 Delete";

    let ventana = "Toma de Inventario Consolidado-DELETE"
    let detalle = "ActualizarStock-create";
    let tipo = "ActualizarStock-CREATE";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: codigo },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/oper/docininvconsol/deleteDocInvFisc/' + this.userConn + "/" + codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo);

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              location.reload();
            },
            error: (err: any) => {
              console.log(err, errorMessage);
              this.toastr.error('! NO ELIMINADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  limpiar() {
    const dialogRef = this.dialog.open(ValidarComponent, {
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        // mapeo que cambia un valor de un array
        this.items.map(function (dato) {
          console.log(dato);

          dato.cantreal = 0;
          dato.cantsist = 0;
          dato.codinvconsol = 0;
          dato.dif = 0;
        });

        //spinner
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);

        this.actualizarLimpios(this.items);
        this.cargarTablaItems(this.cabecera.codigo);
      } else {
        this.toastr.error('! NO SE LIMPIO !');
      }
    });
  }

  actualizarLimpios(get_items) {
    console.log(this.cabecera.codigo, this.items);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adusuario Update";
    return this.api.update('/inventario/oper/docininvconsol/limpiarDataininvconsol1/' + this.userConn + "/" + this.cabecera.codigo, get_items)
      .subscribe({
        next: (datav) => {
          this.data_limpiar = datav;
          console.log(this.data_limpiar);

          this.toastr.success('! SE LIMPIO EXITOSAMENTE !');
          this.dataSource = new MatTableDataSource(get_items);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          this.toastr.error('! NO SE EDITO !');
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  verificarExistenciaInventario() {
    let fecha_hoy = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/oper/docininvconsol/existeInventario/' + this.userConn + "/" + this.inventario_catalogo.id + "/" + this.numero_id)
      .subscribe({
        next: (datav) => {
          this.verificacion = datav;
          console.log(this.verificacion);
          if (this.verificacion == true) {

            this.toma_inventario = false;
            this.inventario_fisico = true;

            this.cargarCabecera();


            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 1500);
          } else {
            this.toastr.warning('! NO SE ENCONTRO UN INVENTARIO CON ESE NUMERO !');
          }
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! ERROR !');
        },
        complete: () => { }
      })
  }

  cargarCabecera() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/oper/docininvconsol/cargarCabecera/' + this.userConn + "/" + this.inventario_catalogo.id + "/" + this.numero_id)
      .subscribe({
        next: (datav) => {
          this.cabecera = datav;
          console.log(this.cabecera);
          this.cabecera_codigo = this.cabecera.codigo;

          this.cargarTablaItems(this.cabecera.codigo);
          this.estadoInventario(this.cabecera.codigo);
          this.api.getVerificarPeriodoAbierto(this.cabecera.fechafin, 2);
          this.verificarPeriodoSistemaReturn();
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! ERROR CABECERA !');
        },
        complete: () => { }
      })
  }

  estadoInventario(codigo) {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/oper/docininvconsol/invFisConsolIfAbierto/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.estado_inventario = datav;
          console.log(this.estado_inventario);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! ERROR ESTADO !');
        },
        complete: () => { }
      })
  }

  cargarTablaItems(codigo) {
    console.log("CARGAR ITEM");

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/oper/docininvconsol/mostrardetalle/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.items = datav;
          console.log(this.items);

          this.dataSource = new MatTableDataSource(this.items);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.dataSource.data = this.items;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  refreshItems(codigo) {
    console.log("REFRESCAR ITEM");

    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/oper/docininvconsol/mostrardetalle/' + this.userConn + "/" + codigo)
      .subscribe({
        next: (datav) => {
          this.items = datav;
          console.log(this.items);

          this.dataSource = new MatTableDataSource(this.items);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
          this.toastr.error('! SIN ITEMS !');

        },
        complete: () => { }
      })
  }

  // llamarAAFunction() {
  //   this.cargarTablaItems(this.cabecera.codigo);
  //   this.refreshItemSer.callRefreshItemFunction();
  // }

  abrirPeriodoSistema() {
    let data;

    let ventana = "PermisosEspecialesParametros"
    let detalle = " actualizarEstadoAbiertoCerradoTomaInventario-update";
    let tipo = " actualizarEstadoAbiertoCerradoTomaInventario-UPDATE";

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/oper/docininvconsol/updateAbiertoCerrado/ Update";

    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: this.cabecera.id,
        dataB: this.cabecera.numeroid,
        dataPermiso: "17-RE-ABRIR INVENTARIO FISICO CERRADO",
        dataCodigoPermiso: "17",
        abrir: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.update('/inventario/oper/docininvconsol/updateAbiertoCerrado/' + this.userConn + "/" + this.cabecera.codigo + "/true", data)
          .subscribe({
            next: (datav) => {
              console.log(datav);

              this.log_module.guardarLog(ventana, detalle, tipo);
              this.toastr.success(datav.resp);
              this.estadoInventario(this.cabecera.codigo);
            },

            error: (err: any) => {
              console.log(err, errorMessage);
              this.toastr.error('! NO ACTUALIZADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO CLIENTE TRUE !');
      }
    });
  }

  cerrarPeriodoSistema() {
    console.log(this.cabecera);

    let data;

    let ventana = "PermisosEspecialesParametros"
    let detalle = " actualizarEstadoAbiertoCerradoTomaInventario-update";
    let tipo = " actualizarEstadoAbiertoCerradoTomaInventario-UPDATE";

    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /inventario/oper/docininvconsol/updateAbiertoCerrado/ Update";

    const dialogRef = this.dialog.open(PermisosEspecialesParametrosComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: this.cabecera.id,
        dataB: this.cabecera.numeroid,
        dataPermiso: "17-RE-ABRIR INVENTARIO FISICO CERRADO",
        dataCodigoPermiso: "17",
        abrir: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.update('/inventario/oper/docininvconsol/updateAbiertoCerrado/' + this.userConn + "/" + this.cabecera.codigo + "/false", data)
          .subscribe({
            next: (datav) => {
              console.log(datav);
              this.log_module.guardarLog(ventana, detalle, tipo);
              this.toastr.success(datav.resp);
              this.estadoInventario(this.cabecera.codigo);
            },

            error: (err: any) => {
              console.log(err, errorMessage);
              this.toastr.error('! NO ACTUALIZADO !');
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! CANCELADO CLIENTE TRUE !');
      }
    });
  }

  verificarPeriodoSistemaReturn() {
    this.periodoSistema.disparadorDeBooleanoPeriodoSistema.subscribe(data => {
      console.log("Recibiendo Valor Periodo Sistema: ", data);
      this.veriPerAbi = data.periodo;
      console.log(this.veriPerAbi);

      if (this.veriPerAbi == true) {
        this.periodoCerrado = true;
      } else {
        this.periodoCerrado = false;
      }
    });
  }

  notasAjustes() {
    this.dialog.open(NotasAjustesComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataInventario: this.cabecera,
        item_ajustes: this.items,
      },
    });
  }

  catalogoInventario() {
    this.dialog.open(CatalogoInventarioComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  saldoInventario() {
    this.dialog.open(SaldosInventarioConsolidadoComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataCabecera: this.cabecera },
    });
  }

  gruposInventario() {
    this.dialog.open(GruposInventariosComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataInventario: this.cabecera },
    });
  }

  consolidar() {
    this.dialog.open(ConsolidarInventarioComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataInventario: this.cabecera,
        items_consolidar: this.items,
      },
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  minimizar() {
    this.api.ventanaAbiertaCerrada(this.ventana, '/inventario/inventarioFisico/tomaInventario', "abierto");
  }

  close() {
    this.router.navigate(['/']);
  }
}
