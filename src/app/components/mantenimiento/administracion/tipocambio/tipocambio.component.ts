import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipocambioCreateComponent } from './tipocambio-create/tipocambio-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LogService } from '@services/log-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-tipocambio',
  templateUrl: './tipocambio.component.html',
  styleUrls: ['./tipocambio.component.scss']
})

export class TipocambioComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  tipo_cambio: any = [];
  BD_storage: any = [];
  data = [];

  dataform: any = '';
  usuarioLogueado: any;
  userConn: any;
  bd_logueado: any;
  habilitar_boton: boolean;

  displayedColumns = ['monedabase', 'moneda', 'codalmacen', 'factor', 'fecha', 'usuarioreg', 'accion'];
  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana: string = "abmadtipocambio.vb";

  public ventana = "Tipo de Cambio"

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, public log_module: LogService,
    private datePipe: DatePipe, private _formBuilder: FormBuilder, public nombre_ventana_service: NombreVentanaService) {
    this.mandarNombre();
    this.FormularioData = this.createForm();

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.api.getRolUserParaVentana(this.nombre_ventana);
  }

  ngOnInit() {
    this.getAllTipoCambio();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      fecha: [this.datePipe.transform(this.dataform.fecha, "yyyy-MM-dd")],
    });
  }

  buscadorTipoCambio() {
    this.data = this.FormularioData.value.fecha;
    let dataTransform = this.datePipe.transform(this.FormularioData.value.fecha, "yyyy-MM-dd")

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adtipocambio/getTipocambioFecha/' + this.userConn + "/" + dataTransform)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio = datav;
          this.tipo_cambio.length > 0 ? this.habilitar_boton = false : this.habilitar_boton = true;
          console.log(this.tipo_cambio);

          this.spinner.show();
          this.dataSource = new MatTableDataSource(this.tipo_cambio);

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

  getAllTipoCambio() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    let dataTransform = this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd");

    return this.api.getAll('/seg_adm/mant/adtipocambio/getTipocambioFecha/' + this.userConn + "/" + dataTransform)
      .subscribe({
        next: (datav) => {
          this.tipo_cambio = datav;
          console.log(this.tipo_cambio);

          this.dataSource = new MatTableDataSource(this.tipo_cambio);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;

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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(TipocambioCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {},
    });
  }

  eliminar(element): void {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:--  /seg_adm/mant/adtipocambio/{moneda}/{fecha}/{codalmacen} Delete TipoCambio";

    let ventana = "tipocambio-delete"
    let detalle = "tipocambio-delete";
    let tipo = "transaccion-tipocambio-DELETE";

    let moneda = element.moneda;
    let fecha_element = element.fecha;
    let codalmacen = element.codalmacen;
    let fecha_element_transform = this.datePipe.transform(fecha_element, "yyyy-MM-dd");
    // console.log(moneda+"/"+fecha_element_transform+"/"+codalmacen);

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: { dataUsuarioEdit: element },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/seg_adm/mant/adtipocambio/' + moneda + "/" + fecha_element_transform + "/" + codalmacen)
          .subscribe({
            next: () => {
              this.log_module.guardarLog(ventana, detalle, tipo, "", "");
              this.spinner.show();
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
        alert("¡No se elimino!");
      }
    });
  }

  mandarNombre() {
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent: this.ventana,
    });
  }
}
