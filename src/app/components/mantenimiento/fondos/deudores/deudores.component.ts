import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { fndeudor } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { DeudoresCreateComponent } from './deudores-create/deudores-create.component';
import { DeudoresEditComponent } from './deudores-edit/deudores-edit.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component';
@Component({
  selector: 'app-deudores',
  templateUrl: './deudores.component.html',
  styleUrls: ['./deudores.component.scss']
})
export class DeudoresComponent implements OnInit {

  myControl = new FormControl<string | fndeudor>('');
  options: fndeudor[] = [];
  filteredOptions: Observable<fndeudor[]>;
  userConn: any;
  deudor_get: any = [];
  data: [];
  dataDeudorEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'persona', 'fechareg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmfndeudor.vb";
  public ventana = "Deudor"
  public detalle = "Deudor-delete";
  public tipo = "Deudor-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
    this.getAllDeudores();
    this.mandarNombre();
    this.cuentasContablesModal({ id: "a" });
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllDeudores() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/fondos/mant/fndeudor/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.deudor_get = datav;
          console.log(this.deudor_get);

          this.dataSource = new MatTableDataSource(this.deudor_get);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  openDialog(): void {
    this.dialog.open(DeudoresCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): fndeudor[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fndeudor): string {
    return user && user.id ? user.id : '';
  }

  editar(dataDeudorEdit) {
    this.dataDeudorEdit_copied = { ...dataDeudorEdit };

    this.data = dataDeudorEdit;
    this.dialog.open(DeudoresEditComponent, {
      data: { dataDeudorEdit_copied: this.dataDeudorEdit_copied },
      width: 'auto',
      height: 'auto',
    });
  }

  cuentasContablesModal(dataDeudorEdit) {
    this.dataDeudorEdit_copied = { ...dataDeudorEdit };

    this.data = dataDeudorEdit;
    this.dialog.open(CuentasContablesComponent, {
      data: { dataDeudorEdit_copied: this.dataDeudorEdit_copied },
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
        return this.api.delete('/fondos/mant/fndeudor/' + this.userConn + "/" + element.id)
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
