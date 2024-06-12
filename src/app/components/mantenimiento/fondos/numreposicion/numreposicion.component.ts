import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { fnTipoReposicion } from '@services/modelos/objetos';
import { NumreposicionCreateComponent } from './numreposicion-create/numreposicion-create.component';
import { NumreposicionEditComponent } from './numreposicion-edit/numreposicion-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-numreposicion',
  templateUrl: './numreposicion.component.html',
  styleUrls: ['./numreposicion.component.scss']
})
export class NumreposicionComponent implements OnInit {

  numRepo: any = [];
  data: [];
  dataNumRepoEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'horareg', 'fechareg', 'usuarioreg', 'codunidad', 'descUnidad', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | fnTipoReposicion>('');
  options: fnTipoReposicion[] = [];
  filteredOptions: Observable<fnTipoReposicion[]>;
  userConn: any;

  nombre_ventana: string = "abmfntiporeposicion.vb";
  public ventana = "TipoReposicion"
  public detalle = "TipoReposicion-delete";
  public tipo = "TipoReposicion-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllNumReposiciones(this.userConn);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllNumReposiciones(userConn) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/fondos/mant/fntiporeposicion/' + userConn)
      .subscribe({
        next: (datav) => {
          this.numRepo = datav;

          this.dataSource = new MatTableDataSource(this.numRepo);
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

  openDialog(): void {
    this.dialog.open(NumreposicionCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): fnTipoReposicion[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fnTipoReposicion): string {
    return user && user.id ? user.id : '';
  }

  editar(dataNumRepoEdit) {
    this.dataNumRepoEdit_copied = { ...dataNumRepoEdit };
    console.log(this.dataNumRepoEdit_copied);

    this.data = dataNumRepoEdit;
    this.dialog.open(NumreposicionEditComponent, {
      data: { dataNumRepoEdit: this.dataNumRepoEdit_copied },
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  fondos/mant/fntiporeposicion/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/fondos/mant/fntiporeposicion/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);

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
}
