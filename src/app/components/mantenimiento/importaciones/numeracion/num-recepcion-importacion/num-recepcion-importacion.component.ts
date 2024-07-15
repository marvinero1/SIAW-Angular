import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cpidrecepcion } from '@services/modelos/objetos';
import { NumRecepcionImportacionCreateComponent } from './num-recepcion-importacion-create/num-recepcion-importacion-create.component';
import { NumRecepcionImportacionEditComponent } from './num-recepcion-importacion-edit/num-recepcion-importacion-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-num-recepcion-importacion',
  templateUrl: './num-recepcion-importacion.component.html',
  styleUrls: ['./num-recepcion-importacion.component.scss']
})
export class NumRecepcionImportacionComponent implements OnInit {

  numRecepc: any = [];
  data: [];
  datanumRecepcEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cpidrecepcion>('');
  options: cpidrecepcion[] = [];
  filteredOptions: Observable<cpidrecepcion[]>;
  userConn: any;

  nombre_ventana: string = "abmcpidrecepcion.vb";
  public ventana = "numRecepciones"
  public detalle = "numRecepciones-delete";
  public tipo = "numRecepciones-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllnumRecepc(this.userConn);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllnumRecepc(userConn) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/importaciones/mant/cpidrecepcion/' + userConn)
      .subscribe({
        next: (datav) => {
          this.numRecepc = datav;

          this.dataSource = new MatTableDataSource(this.numRecepc);
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
    this.dialog.open(NumRecepcionImportacionCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): cpidrecepcion[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cpidrecepcion): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumRecepcEdit) {
    this.datanumRecepcEdit_copied = { ...datanumRecepcEdit };
    console.log(this.datanumRecepcEdit_copied);

    this.data = datanumRecepcEdit;
    this.dialog.open(NumRecepcionImportacionEditComponent, {
      data: { datanumRecepcEdit: this.datanumRecepcEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  importaciones/mant/cpidrecepcion/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/importaciones/mant/cpidrecepcion/' + this.userConn + "/" + element.id)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

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
