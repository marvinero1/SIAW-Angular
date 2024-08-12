import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cnnumeracion } from '@services/modelos/objetos';
import { NumeracionComprobantesCreateComponent } from './numeracion-comprobantes-create/numeracion-comprobantes-create.component';
import { NumeracionComprobantesEditComponent } from './numeracion-comprobantes-edit/numeracion-comprobantes-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-numeracion-comprobantes',
  templateUrl: './numeracion-comprobantes.component.html',
  styleUrls: ['./numeracion-comprobantes.component.scss']
})
export class NumeracionComprobantesComponent implements OnInit {

  numcomprob: any = [];
  data: [];
  datanumcomprobEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'desde', 'hasta', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cnnumeracion>('');
  options: cnnumeracion[] = [];
  filteredOptions: Observable<cnnumeracion[]>;
  userConn: any;

  nombre_ventana: string = "abmcnnumeracion.vb";
  public ventana = "numComprobates"
  public detalle = "numComprobates-delete";
  public tipo = "numComprobates-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllnumcomprob();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllnumcomprob() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET /contab/mant/cnnumeracion/";
    return this.api.getAll('/contab/mant/cnnumeracion/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.numcomprob = datav;

          this.dataSource = new MatTableDataSource(this.numcomprob);
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
    this.dialog.open(NumeracionComprobantesCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): cnnumeracion[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cnnumeracion): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumcomprobEdit) {
    this.datanumcomprobEdit_copied = { ...datanumcomprobEdit };
    console.log(this.datanumcomprobEdit_copied);

    this.data = datanumcomprobEdit;
    this.dialog.open(NumeracionComprobantesEditComponent, {
      data: { datanumcomprobEdit: this.datanumcomprobEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- contab/mant/cnnumeracion/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/contab/mant/cnnumeracion/' + this.userConn + "/" + element.id)
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
