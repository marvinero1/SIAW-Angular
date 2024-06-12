import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cnsucursal } from '@services/modelos/objetos';
import { SucursalCreateComponent } from './sucursal-create/sucursal-create.component';
import { SucursalEditComponent } from './sucursal-edit/sucursal-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrls: ['./sucursal.component.scss']
})
export class SucursalComponent implements OnInit {

  sucur: any = [];
  data: [];
  datasucurEdit_copied: any = [];

  displayedColumns = ['codigo', 'descripcion', 'codalmacen', 'almDesc', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cnsucursal>('');
  options: cnsucursal[] = [];
  filteredOptions: Observable<cnsucursal[]>;
  userConn: any;

  nombre_ventana: string = "abmcnsucursal.vb";
  public ventana = "sucursales"
  public detalle = "sucursales-delete";
  public tipo = "sucursales-DELETE";


  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllsucur(this.userConn);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllsucur(userConn) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/contab/mant/cnsucursal/' + userConn)
      .subscribe({
        next: (datav) => {
          this.sucur = datav;

          this.dataSource = new MatTableDataSource(this.sucur);
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
    this.dialog.open(SucursalCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): cnsucursal[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cnsucursal): string {
    return user && user.codigo ? user.codigo : '';
  }

  editar(datasucurEdit) {
    this.datasucurEdit_copied = { ...datasucurEdit };
    console.log(this.datasucurEdit_copied);

    this.data = datasucurEdit;
    this.dialog.open(SucursalEditComponent, {
      data: { datasucurEdit: this.datasucurEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  contab/mant/cnsucursal/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/contab/mant/cnsucursal/' + this.userConn + "/" + element.codigo)
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
