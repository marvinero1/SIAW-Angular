import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemCreateComponent } from './item-create/item-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { FormControl } from '@angular/forms';
import { Item } from '@services/modelos/objetos';
import { Observable, map, startWith } from 'rxjs';
import { ModalSaldoCubrirComponent } from './modal-saldoCubrir/modal-saldoCubrir.component';
import { ModalComponenteskitComponent } from './modal-componenteskit/modal-componenteskit.component';
import { ModalMaximoVentasComponent } from './modal-maximoVentas/modal-maximoVentas.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ModalPrecioControlComponent } from './modal-precioControl/modal-precioControl.component';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  nombre_ventana: string = "abminitem.vb";

  public item = [];
  public data = [];
  displayedColumns = ['codigo', 'descripcion', 'descripcorta', 'descripabr', 'medida', 'unidad', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;


  myControl = new FormControl<string | Item>('');
  options: Item[] = [];
  filteredOptions: Observable<Item[]>;
  userConn: any;

  public ventana = "Item"
  public detalle = "initem-detalle";
  public tipo = "transaccion-initem-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllitem();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private _filter(name: string): Item[] {
    const filterValue = name.toLowerCase();
    let a = this.options.filter(option => option.codigo.toLowerCase().includes(filterValue))

    return a;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: Item): string {
    return user && user.codigo ? user.codigo : '';
  }

  getAllitem() {
    let user_conn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/initem/' + user_conn)
      .subscribe({
        next: (datav) => {
          this.item = datav;

          this.dataSource = new MatTableDataSource(this.item);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1500);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/inventario/mant/initem/' + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
              this.toastr.success('! SE ELIMINO EXITOSAMENTE !');
              this.spinner.show();
              setTimeout(() => {
                this.spinner.hide();
              }, 1500);

              location.reload();
            },
            error: (err: any) => {
              console.log(errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! NO SE ELIMINO !');
      }
    });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(ItemCreateComponent, {
      width: '1100px',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  editar(item): void {
    this.data = item;
    const dialogRef = this.dialog.open(ItemEditComponent, {
      data: { dataItem: item },
      width: '750px',
    });
  }

  saldosAcubrir(item) {
    this.data = item;
    const dialogRef = this.dialog.open(ModalSaldoCubrirComponent, {
      data: { dataItem: item },
      width: '750px',
    });
  }

  componentesArmarKit(item) {
    this.data = item;
    const dialogRef = this.dialog.open(ModalComponenteskitComponent, {
      data: { dataItem: item },
      width: '750px',
    });
  }

  maximoVentas(item) {
    this.data = item;
    const dialogRef = this.dialog.open(ModalMaximoVentasComponent, {
      data: { dataItem: item },
      width: '1050px',
    });
  }

  controPrecio(item) {
    this.data = item;
    const dialogRef = this.dialog.open(ModalPrecioControlComponent, {
      data: { dataItem: item },
      width: '750px',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
