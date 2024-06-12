import { Component, OnInit } from '@angular/core';
import { ModalDescuentosComponent } from './modal-descuentos/modal-descuentos.component';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ToastrService } from 'ngx-toastr';
import { LogService } from '@services/log-service.service';
import { ServicioalmacenService } from '../../inventario/almacen/servicioalmacen/servicioalmacen.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DescuentoService } from '../serviciodescuento/descuento.service';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { LineasPorcentajeDesctComponent } from './lineas-porcentaje-desct/lineas-porcentaje-desct.component';
import { PreciosPermitidoDesctComponent } from './precios-permitido-desct/precios-permitido-desct.component';
@Component({
  selector: 'app-descuentos-especiales',
  templateUrl: './descuentos-especiales.component.html',
  styleUrls: ['./descuentos-especiales.component.scss']
})
export class DescuentosEspecialesComponent implements OnInit {

  FormularioData: FormGroup;
  FormularioDataEdit: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';

  userConn: any;
  usuarioLogueado;

  descuento: any = [];
  save_descuento: any = [];
  moneda_get: any = [];
  empaque_get: any = [];
  descuento_codigo: number;

  nombre_ventana: string = "abmvedescuento.vb";
  public ventana = "Desct. Especiales"
  public detalle = "destEspecial";
  public tipo = "desceunto-especial-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, public nombre_ventana_service: NombreVentanaService,
    public servicioDescuento: DescuentoService, public almacenservice: ServicioalmacenService, private _formBuilder: FormBuilder,
    private datePipe: DatePipe) {

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.api.getRolUserParaVentana(this.nombre_ventana);

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.getAllmoneda();
    this.getAllEmpaque();

    this.servicioDescuento.disparadorDeDescuentos.subscribe(data => {
      console.log("Recibiendo Descuento: ", data.descuento);
      this.descuento = data.descuento;
      this.descuento_codigo = data.descuento.codigo;
    });
  }

  createForm(): FormGroup {
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      codempaque: [this.dataform.codempaque, Validators.compose([Validators.required])],
      monto: [this.dataform.monto, Validators.compose([Validators.required]), Validators.pattern(/^-?\d+$/)],
      moneda: [this.dataform.moneda, Validators.compose([Validators.required])],
      descuento: [this.dataform.descuento, Validators.pattern(/^-?\d+$/)],
      ultimos: [false],
      habilitado: [false],
      desde_fecha: ["1900-01-01"],
      hasta_fecha: ["1900-01-01"],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [usuario_logueado],
    });
  }


  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/vedescuento/";

    return this.api.create("/venta/mant/vedescuento/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.save_descuento = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');
          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  editar() {
    let data1 = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /venta/mant/vedescuento/ UPDATE";
    let a = this.descuento.codigo;

    return this.api.update("/venta/mant/vedescuento/" + this.userConn + "/" + a, data1)
      .subscribe({
        next: (datav) => {
          this.save_descuento = datav;
          // console.log(this.save_descuento);

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');
          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE EDITO !');
        },
        complete: () => { }
      })
  }

  eliminar() {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/vedescuento/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: this.descuento.codigo },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/vedescuento/' + this.userConn + "/" + this.descuento.codigo)
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

  getAllmoneda() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda_get = datav;
          console.log(this.moneda_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllEmpaque() {
    let errorMessage: string;
    errorMessage = "La Ruta presenta fallos al hacer peticion GET";
    return this.api.getAll('/venta/mant/veempaque/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.empaque_get = datav;
          console.log(this.empaque_get);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  limpiar() {
    this.descuento.codigo = "";
    this.descuento.descripcion = "";
    this.descuento.codempaque = "";
    this.descuento.empaqueDescrip = "";
    this.descuento.monto = "";
    this.descuento.moneda = "";
    this.descuento.monedaDescrip = "";
    this.descuento.descuento = "";
    this.descuento.ultimos = "";
  }

  modalDescuento(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
      data: { almacen: "almacen" }
    });
  }

  modalEmpaque(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalMoneda(): void {
    this.dialog.open(ModalDescuentosComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  preciosPermitidos() {
    this.dialog.open(PreciosPermitidoDesctComponent, {
      width: 'auto',
      height: 'auto',
      data: { descuento: this.descuento }
    });
  }

  lineasEspeciales() {
    this.dialog.open(LineasPorcentajeDesctComponent, {
      width: 'auto',
      height: 'auto',
      data: { descuento: this.descuento }
    });
  }
}
