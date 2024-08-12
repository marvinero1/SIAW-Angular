import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-empresa-create',
  templateUrl: './empresa-create.component.html',
  styleUrls: ['./empresa-create.component.scss']
})
export class EmpresaCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  empresa: any = [];
  cnplancuenta: any = [];
  moneda: any = [];
  almacen: any = [];

  userConn
  usuario_logueado;

  public ventana = "empresa-create"
  public detalle = "empresa-detalle";
  public tipo = "transaccion-empresa-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe,
    private api: ApiService, public dialogRef: MatDialogRef<EmpresaCreateComponent>, public _snackBar: MatSnackBar,
    private toastr: ToastrService, public log_module: LogService) {

    this.FormularioData = this.createForm();
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
  }

  ngOnInit(): void {
    this.getPlanCuenta();
    this.getMoneda();
    this.getAlmacen();
  }

  createForm(): FormGroup {

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nit: [this.dataform.descripcion, Validators.compose([Validators.required])],
      actividad: [this.dataform.actividad, Validators.compose([Validators.required])],

      direccion: [this.dataform.direccion],
      municipio: [this.dataform.municipio],
      iniciogestion: [this.dataform.iniciogestion],
      fingestion: [this.dataform.fingestion],

      plancuenta: [this.dataform.plancuenta],
      moneda: [this.dataform.moneda],
      monedapol: [this.dataform.moneda],
      codalmacen: [this.dataform.codalmacen],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuario_logueado],
    });
  }

  submitData() {

    let data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/mant/adempresa/";
    return this.api.create("/seg_adm/mant/adempresa/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
          console.log('data', datav);
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");

          this.toastr.success('! GUARDADO EXITOSAMENTE !');

          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
          });

          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  getPlanCuenta() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/cnplancuenta/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.cnplancuenta = datav;
          //console.log(datav);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getMoneda() {

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
          //console.log( this.moneda);
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacen() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/mant/inalmacen/";
    return this.api.getAll('/inventario/mant/inalmacen/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen = datav;
          console.log(this.almacen);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
