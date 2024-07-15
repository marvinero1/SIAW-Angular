import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { fndeudor_compuesto } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { DeudoresCompCreateComponent } from './deudores-comp-create/deudores-comp-create.component';
import { DeudoresCompEditComponent } from './deudores-comp-edit/deudores-comp-edit.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { DeudoresIntegrantesComponent } from './deudores-integrantes/deudores-integrantes.component';
@Component({
  selector: 'app-deudores-compuestos',
  templateUrl: './deudores-compuestos.component.html',
  styleUrls: ['./deudores-compuestos.component.scss']
})
export class DeudoresCompuestosComponent implements OnInit {

  deudores_compuestos: any = [];
  data: [];
  dataBancoEdit_copied: any = [];

  displayedColumns = ['id', 'descripcion', 'fechareg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | fndeudor_compuesto>('');
  options: fndeudor_compuesto[] = [];
  filteredOptions: Observable<fndeudor_compuesto[]>;
  userConn: any;
  inputValue: number | null = null;

  nombre_ventana: string = "abmfndeudor_compuesto.vb";
  public ventana = "Deudores Compuestos"
  public detalle = "Deudores Compuestos-delete";
  public tipo = "Deudores Compuestos-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllDeudoresCompuestos();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.id;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  getAllDeudoresCompuestos() {
    let errorMessage: string = "La Ruta presenta fallos al hacer peticion GET --/fondos/mant/fndeudor_compuesto/";
    return this.api.getAll('/fondos/mant/fndeudor_compuesto/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.deudores_compuestos = datav;
          console.log(this.deudores_compuestos);

          this.dataSource = new MatTableDataSource(this.deudores_compuestos);
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
    this.dialog.open(DeudoresCompCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  private _filter(name: string): fndeudor_compuesto[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.id.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayFn(user: fndeudor_compuesto): string {
    return user && user.id ? user.id : '';
  }

  editar(datanumRetBancEdit) {
    this.dataBancoEdit_copied = { ...datanumRetBancEdit };
    console.log(this.dataBancoEdit_copied);

    this.data = datanumRetBancEdit;
    this.dialog.open(DeudoresCompEditComponent, {
      data: { dataDeudorCompEdit: this.dataBancoEdit_copied },
      width: 'auto',
      height: 'auto',
    });
  }

  integrantes(datanumRetBancEdit) {
    this.dataBancoEdit_copied = { ...datanumRetBancEdit };
    console.log(this.dataBancoEdit_copied);

    this.data = datanumRetBancEdit;
    this.dialog.open(DeudoresIntegrantesComponent, {
      data: { dataIntegrantes: this.dataBancoEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  fondos/mant/fntiporetiro/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/fondos/mant/fndeudor_compuesto/' + this.userConn + "/" + element.id)
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
