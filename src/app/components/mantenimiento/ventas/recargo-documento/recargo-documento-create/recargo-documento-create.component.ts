import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiciorubroService } from '@components/mantenimiento/rubro/servicio/serviciorubro.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { veRecargo } from '@services/modelos/objetos';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { RecargoServicioService } from '../service-recargo/recargo-servicio.service';
@Component({
  selector: 'app-recargo-documento-create',
  templateUrl: './recargo-documento-create.component.html',
  styleUrls: ['./recargo-documento-create.component.scss']
})
export class RecargoDocumentoCreateComponent implements OnInit {

  @HostListener("document:keydown.enter", []) unloadHandler(event: KeyboardEvent) {
    this.mandarPtoVenta();
  };

  @HostListener('dblclick') onDoubleClicked2() {
    this.mandarPtoVenta();
  };

  recargos: any = [];
  recargo_view: any = [];
  data: [];
  userConn: any;

  public codigo: string = '';

  displayedColumns = ['codigo', 'descripcion', 'descorta'];

  dataSource = new MatTableDataSource<veRecargo>();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  options: veRecargo[] = [];
  filteredOptions: Observable<veRecargo[]>;
  myControlCodigo = new FormControl<string | veRecargo>('');
  myControlDescripcion = new FormControl<string | veRecargo>('');

  nombre_ventana: string = "abmverecargo.vb";
  public ventana = "Recargos"
  public detalle = "Recargos-delete";
  public tipo = "Recargos-DELETE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService,
    public servicioRecargo: RecargoServicioService, public dialogRef: MatDialogRef<RecargoDocumentoCreateComponent>,) {

    this.mandarNombre();

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit(): void {
    this.getAllTipoCredito();
  }

  private _filter(name: string): veRecargo[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.descripcion.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  displayFn(user: veRecargo): string {
    return user && user.descripcion ? user.descripcion : '';
  }

  getAllTipoCredito() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /venta/mant/verecargo/";
    return this.api.getAll('/venta/mant/verecargo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.recargos = datav;
          console.log(this.recargos);

          this.dataSource = new MatTableDataSource(this.recargos);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  mandarPtoVenta() {
    this.servicioRecargo.disparadorDeRecargoDocumento.emit({
      recargo: this.recargo_view,
    });

    this.close();
  }

  getDescripcionView(element) {
    this.recargo_view = element;
    console.log(this.recargo_view);
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
