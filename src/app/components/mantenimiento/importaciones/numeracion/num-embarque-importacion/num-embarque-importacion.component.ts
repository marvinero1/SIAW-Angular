import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cpidembarque } from '@services/modelos/objetos';
import { NumEmbarqueImportacionCreateComponent } from './num-embarque-importacion-create/num-embarque-importacion-create.component';
import { NumEmbarqueImportacionEditComponent } from './num-embarque-importacion-edit/num-embarque-importacion-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-num-embarque-importacion',
  templateUrl: './num-embarque-importacion.component.html',
  styleUrls: ['./num-embarque-importacion.component.scss']
})
export class NumEmbarqueImportacionComponent implements OnInit {

  numEmbarq: any = [];
  data: [];
  datanumEmbarqEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cpidembarque>('');
  options: cpidembarque[] = [];
  filteredOptions: Observable<cpidembarque[]>;
  userConn: any;

  nombre_ventana: string = "abmcpidembarque.vb";
  public ventana = "numEmbarques"
  public detalle = "numEmbarques-delete";
  public tipo = "numEmbarques-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllnumEmbarq();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllnumEmbarq() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/importaciones/mant/cpidembarque/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.numEmbarq = datav;

          this.dataSource = new MatTableDataSource(this.numEmbarq);
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
    this.dialog.open(NumEmbarqueImportacionCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): cpidembarque[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cpidembarque): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumEmbarqEdit) {
    this.datanumEmbarqEdit_copied = { ...datanumEmbarqEdit };
    console.log(this.datanumEmbarqEdit_copied);

    this.data = datanumEmbarqEdit;
    this.dialog.open(NumEmbarqueImportacionEditComponent, {
      data: { datanumEmbarqEdit: this.datanumEmbarqEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  importaciones/mant/cpidembarque/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/importaciones/mant/cpidembarque/' + this.userConn + "/" + element.id)
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
