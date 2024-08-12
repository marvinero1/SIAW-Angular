import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '@services/api.service';
import { adUsuario } from '@services/modelos/objetos';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioCreateComponent } from './usuario-create/usuario-create.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';
import { UsuarioDeleteComponent } from './usuario-delete/usuario-delete.component';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  usuarios: any = [];
  data: any = '';
  userConn: any;
  displayedColumns = ['login', 'persona', 'vencimiento', 'activo', 'codrol', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | adUsuario>('');
  options: adUsuario[] = [];
  filteredOptions: Observable<adUsuario[]>;

  nombre_ventana: string = "abmadusuario.vb";
  public ventana = "Usuarios"
  public detalle = "usuario-delete";
  public tipo = "usuario-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllUsers();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.login;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private _filter(name: string): adUsuario[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.login.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: adUsuario): string {
    return user && user.login ? user.login : '';
  }

  getAllUsers() {

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/adusuario/";
    return this.api.getAll('/seg_adm/mant/adusuario/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.usuarios = datav;
          console.log(this.usuarios);

          this.spinner.show();

          this.dataSource = new MatTableDataSource(this.usuarios);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

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
    this.dialog.open(UsuarioCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  editar(dataUsuarioEdit: any) {
    this.data = dataUsuarioEdit;
    const dialogRef = this.dialog.open(UsuarioEditComponent, {
      data: { dataUsuarioEdit: dataUsuarioEdit },
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(dataUsuarioEliminar: any) {
    this.data = dataUsuarioEliminar;
    const dialogRef = this.dialog.open(UsuarioDeleteComponent, {
      data: { dataUsuarioEliminar: dataUsuarioEliminar },
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/adarea/' + this.userConn + "/" + dataUsuarioEliminar.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

              this.toastr.success('!ELIMINADO EXITOSAMENTE!');
              location.reload();
            },
            error: (err: any) => {
              console.log(err);
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
