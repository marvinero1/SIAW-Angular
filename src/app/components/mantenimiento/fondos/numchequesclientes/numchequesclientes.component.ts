import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { fnNumeracionChequeCliente } from '@services/modelos/objetos';
import { NumchequesclientesCreateComponent } from './numchequesclientes-create/numchequesclientes-create.component';
import { NumchequesclientesEditComponent } from './numchequesclientes-edit/numchequesclientes-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
@Component({
  selector: 'app-numchequesclientes',
  templateUrl: './numchequesclientes.component.html',
  styleUrls: ['./numchequesclientes.component.scss']
})
export class NumchequesclientesComponent implements OnInit {

  numChecCli: any = [];
  data: [];
  datanumChecCliEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'codcuentab', 'nroactual', 'nrodesde', 'nrohasta', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | fnNumeracionChequeCliente>('');
  options: fnNumeracionChequeCliente[] = [];
  filteredOptions: Observable<fnNumeracionChequeCliente[]>;
  userConn: any;

  nombre_ventana: string = "abmfnnumeracioncheque_cliente.vb";
  public ventana = "numeracionChequeCliente"
  public detalle = "numeracionChequeCliente-delete";
  public tipo = "numeracionChequeCliente-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

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
    return this.api.getAll('/fondos/mant/fnchequera/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.numChecCli = datav;

          this.dataSource = new MatTableDataSource(this.numChecCli);
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
    this.dialog.open(NumchequesclientesCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): fnNumeracionChequeCliente[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fnNumeracionChequeCliente): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumChecCliEdit) {
    this.datanumChecCliEdit_copied = { ...datanumChecCliEdit };
    console.log(this.datanumChecCliEdit_copied);

    this.data = datanumChecCliEdit;
    this.dialog.open(NumchequesclientesEditComponent, {
      data: { datanumChecCliEdit: this.datanumChecCliEdit_copied },
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
        return this.api.delete('/fondos/mant/fnchequera/' + this.userConn + "/" + element.id)
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
