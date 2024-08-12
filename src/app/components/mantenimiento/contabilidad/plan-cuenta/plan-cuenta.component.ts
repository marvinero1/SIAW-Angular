import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { cnplancuenta } from '@services/modelos/objetos';
import { PlanCuentaCreateComponent } from './plan-cuenta-create/plan-cuenta-create.component';
import { PlanCuentaEditComponent } from './plan-cuenta-edit/plan-cuenta-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-plan-cuenta',
  templateUrl: './plan-cuenta.component.html',
  styleUrls: ['./plan-cuenta.component.scss']
})
export class PlanCuentaComponent implements OnInit {

  plancuent: any = [];
  data: [];
  dataplancuentEdit_copied: any = [];

  displayedColumns = ['codigo', 'descripcion', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | cnplancuenta>('');
  options: cnplancuenta[] = [];
  filteredOptions: Observable<cnplancuenta[]>;
  userConn: any;

  nombre_ventana: string = "abmcnplancuenta.vb";
  public ventana = "plandeCuenta"
  public detalle = "plandeCuenta-delete";
  public tipo = "plandeCuenta-DELETE";


  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.mandarNombre();
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllplancuent();
  }

  getAllplancuent() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET --/contab/mant/cnplancuenta/";
    return this.api.getAll('/contab/mant/cnplancuenta/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.plancuent = datav;

          this.dataSource = new MatTableDataSource(this.plancuent);
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
    this.dialog.open(PlanCuentaCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  editar(dataplancuentEdit) {
    this.dataplancuentEdit_copied = { ...dataplancuentEdit };
    console.log(this.dataplancuentEdit_copied);

    this.data = dataplancuentEdit;
    this.dialog.open(PlanCuentaEditComponent, {
      data: { dataplancuentEdit: this.dataplancuentEdit_copied },
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
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  contab/mant/cnplancuenta/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/contab/mant/cnplancuenta/' + this.userConn + "/" + element.codigo)
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
