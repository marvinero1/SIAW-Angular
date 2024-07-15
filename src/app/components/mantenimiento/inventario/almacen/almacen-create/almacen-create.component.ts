import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-almacen-create',
  templateUrl: './almacen-create.component.html',
  styleUrls: ['./almacen-create.component.scss']
})
export class AlmacenCreateComponent {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  isLinear = true;
  dataform: any = '';
  userConn: any;
  usuarioLogueado: any;
  almacen = [];
  planporcen = [];
  adarea = [];
  moneda = [];
  fncuenta = [];

  public ventana = "almacen-create"
  public detalle = "almacen-detalle";
  public tipo = "transaccion-almacen-CREATE";

  constructor(private _formBuilder: FormBuilder, private api: ApiService, private datePipe: DatePipe, public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AlmacenCreateComponent>, private spinner: NgxSpinnerService, private router: Router,
    public log_module: LogService, private toastr: ToastrService,) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
    // this.FormularioData1 = this.createForm1();
    // this.FormularioData2 = this.createForm2();
  }

  ngOnInit(): void {
    this.getAlladArea();
    this.getAllplanporcen();
    this.getAllmoneda();
    this.getAllfncuenta();
  }

  @ViewChild('validEmail') validEmail;

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({

      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      direccion: [this.dataform.direccion, Validators.compose([Validators.required])],
      telefono: [this.dataform.telefono, Validators.compose([Validators.required])],
      email: [this.dataform.email, Validators.compose([Validators.required])],
      nropatronal: [this.dataform.nropatronal, Validators.compose([Validators.required])],
      codarea: [this.dataform.codarea],
      codplanporcen: [this.dataform.codplanporcen],
      tienda: [this.dataform.tienda],
      nropersonas: [this.dataform.nropersonas],
      lugar: [this.dataform.lugar],
      min_solurgente: [this.dataform.min_solurgente],
      codmoneda_min_solurgente: [this.dataform.codmoneda_min_solurgente],
      latitud: [this.dataform.latitud],
      longitud: [this.dataform.longitud],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      actividad: [this.dataform.actividad],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
      fax: ["0000-0000"],

      idcuenta_caja_mn: [this.dataform.idcuenta_caja_mn],
      idcuenta_caja_me: [this.dataform.idcuenta_caja_me],

      pesoest_rendi: [this.dataform.pesoest_rendi,],
      porcenmin_rendi: [this.dataform.porcenmin_rendi,],
      pesomin_rendi: [this.dataform.pesomin_rendi,],
      porcenmin: [this.dataform.porcenmin,],
      pesomin: [this.dataform.pesomin,],
      estandar: [this.dataform.estandar,],
      monestandar: [this.dataform.monestandar,],
      minimo: [this.dataform.minimo,],
      moneda: [this.dataform.moneda,],
      pesoest: [this.dataform.pesoest,],
      graficar: [this.dataform.graficar,],
      analizar_rendimiento: [this.dataform.analizar_rendimiento,],
    });
  }



  submitData() {
    const data = this.FormularioData.value;
    console.log(data);

    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:- /inventario/mant/inalmacen/";
    return this.api.create("/inventario/mant/inalmacen/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.almacen = datav;

          console.log('data', datav);
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 2000);
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
          });
          location.reload();
        },

        error: (err) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlladArea() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adarea/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.adarea = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllplanporcen() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/peplanporcen/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.planporcen = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllmoneda() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllfncuenta() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/fondos/mant/fncuenta/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.fncuenta = datav;
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
