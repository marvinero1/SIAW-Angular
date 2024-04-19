import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RecargoDocumentoCreateComponent } from './recargo-documento-create/recargo-documento-create.component';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RecargoServicioService } from './service-recargo/recargo-servicio.service';
@Component({
  selector: 'app-recargo-documento',
  templateUrl: './recargo-documento.component.html',
  styleUrls: ['./recargo-documento.component.scss']
})
export class RecargoDocumentoComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';

  userConn: any;
  usuarioLogueado;
  moneda_get: any = [];
  recargo: any = [];
  recargo_get: any = [];
  recargo_get_service: any = [];

  monto = false;
  porcentaje = false;
  indeterminate = false;
  disabled = false;
  checked = true;

  codigo: any;
  descripcion: any;
  descorta: any;
  moneda: any;
  porcentaje_set: any;
  monto_set: any;
  modificable: any;

  nombre_ventana: string = "abmverecargo.vb";
  public ventana = "Recargos"
  public detalle = "Recargos-CREATE";
  public tipo = "Recargos-CREATE";

  constructor(private api: ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<RecargoDocumentoComponent>, public log_module: LogService, private toastr: ToastrService,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public servicioRecargo: RecargoServicioService) {

    this.FormularioData = this.createForm();

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  }

  ngOnInit() {
    this.servicioRecargo.disparadorDeRecargoDocumento.subscribe(data => {
      console.log("Recibiendo Recargo: ", data);
      this.recargo_get_service = data.punto_venta;
    });

    this.getAllmoneda();
  }

  getAllmoneda() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/admoneda/catalogo/";
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

  createForm(): FormGroup {
    let user = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.maxLength(3), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      descorta: [this.dataform.descorta, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      permitido: [this.dataform.permitido],
      modificable: [this.dataform.modificable],
      moneda: [this.dataform.moneda],
      monto: [this.dataform.monto],
      montopor: [this.dataform.montopor],
      porcentaje: [this.dataform.porcentaje],

      horareg: [hora_actual_complete],
      usuarioreg: [user],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
    });
  }

  createFormEdit(): FormGroup {
    let user = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.maxLength(3), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      descorta: [this.dataform.descorta, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      permitido: [this.dataform.permitido],
      modificable: [this.dataform.modificable],
      moneda: [this.dataform.moneda],
      monto: [this.dataform.monto],
      montopor: [this.dataform.montopor],
      porcentaje: [this.dataform.porcentaje],

      horareg: [hora_actual_complete],
      usuarioreg: [user],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
    });
  }

  submitData() {
    const data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/verecargo/";

    return this.api.create("/venta/mant/verecargo/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.recargo = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);

          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
          this.toastr.success('Guardado con Exito! 🎉');
          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        },
        complete: () => { }
      })
  }

  editar() {
    const data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /venta/mant/verecargo/";

    return this.api.update("/venta/mant/verecargo/" + this.userConn + '/' + this.recargo_get_service.codigo, data)
      .subscribe({
        next: (datav) => {
          this.recargo = datav;
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(RecargoDocumentoCreateComponent, {
      width: 'auto',
      height: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  eliminar(codigo): void {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:  venta/mant/vetipocredito Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height: 'auto',
      data: { dataUsuarioEdit: this.recargo_get_service.codigo },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        return this.api.delete('/venta/mant/verecargo/' + this.userConn + "/" + codigo)
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

  limpiar() {
    this.recargo_get_service.codigo = "";
    this.recargo_get_service.descripcion = "";
    this.recargo_get_service.descorta = "";
    this.recargo_get_service.permitido = "";
    this.recargo_get_service.modificable = "";
    this.recargo_get_service.mondesc = "";
    this.recargo_get_service.moneda = "";
    this.recargo_get_service.monto = "";
    this.recargo_get_service.montopor = "";
    this.recargo_get_service.porcentaje = "";
  }


}
