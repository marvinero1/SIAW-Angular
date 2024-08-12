import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NumlibrosbancosEditComponent } from './numlibrosbancos-edit/numlibrosbancos-edit.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from '@services/log-service.service';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { NumlibrosbancosCreateComponent } from './numlibrosbancos-create/numlibrosbancos-create.component';
import { fntipo_librobanco } from '@services/modelos/objetos';
@Component({
  selector: 'app-numlibrosbancos',
  templateUrl: './numlibrosbancos.component.html',
  styleUrls: ['./numlibrosbancos.component.scss']
})
export class NumlibrosbancosComponent implements OnInit {

  num_lib_bancos: any = [];
  data: [];
  datanumLibBancoEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'nroactual', 'codcuentab', 'desde', 'hasta', 'origen', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | fntipo_librobanco>('');
  options: fntipo_librobanco[] = [];
  filteredOptions: Observable<fntipo_librobanco[]>;
  userConn: any;

  nombre_ventana: string = "abmfntipo_librobanco.vb";
  public ventana = "Tipos de Libros de Bancos"
  public detalle = "numeracionChequeCliente-delete";
  public tipo = "numeracionChequeCliente-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllNumChequesClientes();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }


  getAllNumChequesClientes() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/fondos/mant/fntipo_librobanco/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.num_lib_bancos = datav;

          this.dataSource = new MatTableDataSource(this.num_lib_bancos);
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
    this.dialog.open(NumlibrosbancosCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): fntipo_librobanco[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fntipo_librobanco): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumChecCliEdit) {
    this.datanumLibBancoEdit_copied = { ...datanumChecCliEdit };
    console.log(this.datanumLibBancoEdit_copied);

    this.data = datanumChecCliEdit;
    this.dialog.open(NumlibrosbancosEditComponent, {
      data: { datanumChecCliEdit: this.datanumLibBancoEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  fondos/mant/fnnumeracioncheque_cliente/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/fondos/mant/fntipo_librobanco/' + this.userConn + "/" + element.id)
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
