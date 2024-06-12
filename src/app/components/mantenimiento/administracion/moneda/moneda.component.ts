import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { Moneda } from '@services/modelos/objetos';
import { MonedaCreateComponent } from './moneda-create/moneda-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrls: ['./moneda.component.scss']
})
export class MonedaComponent implements OnInit {

  nombre_ventana: string = "abmadmoneda.vb";
  moneda: any = [];
  userConn: string;

  displayedColumns = ['codigo', 'descripcion', 'horareg', 'fechareg', 'usuarioreg', 'accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild("dialogD") dialogD: ElementRef;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  myControl = new FormControl<string | Moneda>('');
  options: Moneda[] = [];
  filteredOptions: Observable<Moneda[]>;

  public ventana = "Moneda"
  public detalle = "moneda-detalle";
  public tipo = "transaccion-moneda-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.mandarNombre();

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllmoneda();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.codigo;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );
  }

  private _filter(name: string): Moneda[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.codigo.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: Moneda): string {
    return user && user.codigo ? user.codigo : '';
  }

  getAllmoneda() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;

          this.dataSource = new MatTableDataSource(this.moneda);
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
    this.dialog.open(MonedaCreateComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion" + "Ruta:--seg_adm/mant/admoneda/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete("/seg_adm/mant/admoneda/" + this.userConn + "/" + element.codigo)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);

              this.toastr.success('!SE ELIMINO EXITOSAMENTE!');
              setTimeout(() => {
                this.spinner.hide();
              }, 1500);

              location.reload();
            },
            error: (err: any) => {
              console.log(errorMessage);
            },
            complete: () => { }
          })
      } else {
        this.toastr.error('! NO SE ELIMINO !');
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
