import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { LocalidadesCreateComponent } from './localidades-create/localidades-create.component';
import { Localidades } from '@services/modelos/objetos';
import { LocalidadesEditComponent } from './localidades-edit/localidades-edit.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {

  localidad: any = [];
  data: [];

  displayedColumns = ['codigo', 'descripcion', 'provincia', 'codigo_postal', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmadlocalidad.vb";
  public ventana = "Localidades"

  myControl = new FormControl<string | Localidades>('');
  options: Localidades[] = [];
  filteredOptions: Observable<Localidades[]>;
  userConn: any;

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {
    this.mandarNombre();

    let usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllArea(this.userConn);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllArea(userConn) {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/abmadlocalidad/' + userConn)
      .subscribe({
        next: (datav) => {
          this.localidad = datav;

          this.dataSource = new MatTableDataSource(this.localidad);
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LocalidadesCreateComponent, {
      width: '750px',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  private _filter(name: string): Localidades[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: Localidades): string {
    return user && user.codigo ? user.codigo : '';
  }

  editar(dataLocalidadEdit) {
    this.data = dataLocalidadEdit;
    this.dialog.open(LocalidadesEditComponent, {
      data: { dataLocalidadEdit: dataLocalidadEdit },
      width: '750px',
      height: 'auto',
    });
  }

  eliminar(element): void {
    let ventana = "loaclaidades"
    let detalle = "localidades-delete";
    let tipo = "localidades-DELETE";

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/abmadlocalidad/' + this.userConn + "/" + element.codigo)
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

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

}
