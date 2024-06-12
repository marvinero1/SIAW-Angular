import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cotipodescuento_faltante } from '@services/modelos/objetos';
import { NumeracionDesctVariosDirectosCreateComponent } from './numeracion-desct-varios-directos-create/numeracion-desct-varios-directos-create.component';
import { NumeracionDesctVariosDirectosEditComponent } from './numeracion-desct-varios-directos-edit/numeracion-desct-varios-directos-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-numeracion-desct-varios-directos',
  templateUrl: './numeracion-desct-varios-directos.component.html',
  styleUrls: ['./numeracion-desct-varios-directos.component.scss']
})
export class NumeracionDesctVariosDirectosComponent implements OnInit {

  numDescFalt: any = [];
  data: [];
  datanumDescFaltEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'horareg', 'fechareg', 'usuarioreg', 'codunidad', 'descUnidad', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cotipodescuento_faltante>('');
  options: cotipodescuento_faltante[] = [];
  filteredOptions: Observable<cotipodescuento_faltante[]>;
  userConn: any;

  nombre_ventana: string = "abmcotipodescuento_faltante.vb";
  public ventana = "numDescuentoporFaltante"
  public detalle = "numDescuentoporFaltante-delete";
  public tipo = "numDescuentoporFaltante-DELETE";





  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }





  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.getAllnumDescFalt(this.userConn);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }



  getAllnumDescFalt(userConn) {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/ctsxcob/mant/cotipodescuento_faltante/' + userConn)
      .subscribe({
        next: (datav) => {
          this.numDescFalt = datav;

          this.dataSource = new MatTableDataSource(this.numDescFalt);
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
    this.dialog.open(NumeracionDesctVariosDirectosCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): cotipodescuento_faltante[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: cotipodescuento_faltante): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumDescFaltEdit) {
    this.datanumDescFaltEdit_copied = { ...datanumDescFaltEdit };
    console.log(this.datanumDescFaltEdit_copied);

    this.data = datanumDescFaltEdit;
    this.dialog.open(NumeracionDesctVariosDirectosEditComponent, {
      data: { datanumDescFaltEdit: this.datanumDescFaltEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  ctsxcob/mant/cotipodescuento_faltante/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/ctsxcob/mant/cotipodescuento_faltante/' + this.userConn + "/" + element.id)
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
