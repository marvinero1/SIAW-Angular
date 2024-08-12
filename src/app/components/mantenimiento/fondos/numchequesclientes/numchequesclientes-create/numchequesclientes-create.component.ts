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
  selector: 'app-numchequesclientes-create',
  templateUrl: './numchequesclientes-create.component.html',
  styleUrls: ['./numchequesclientes-create.component.scss']
})
export class NumchequesclientesCreateComponent implements OnInit {

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  numChecCli: any = [];
  cuentas_bancarias: any = [];
  userConn: any;
  userLogueado: any = [];
  inputValue1: number | null = null;
  inputValue2: number | null = null;
  inputValue3: number | null = null;

  public ventana = "numeracionChequeCliente-create"
  public detalle = "numeracionChequeCliente-detalle";
  public tipo = "transaccion-numeracionChequeCliente-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<NumchequesclientesCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.userLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit() {
    this.getNroCuentaBancaria();
  }

  createForm(): FormGroup {
    let usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      codcuentab: [this.dataform.codcuentab, Validators.compose([Validators.required])],
      nrodesde: [this.dataform.nrodesde, Validators.pattern(/^-?\d+$/)],
      nrohasta: [this.dataform.nrohasta, Validators.pattern(/^-?\d+$/)],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData() {
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:-- /fondos/mant/fnchequera/";

    return this.api.create("/fondos/mant/fnchequera/" + this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.numChecCli = datav;

          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.onNoClick();
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

  getNroCuentaBancaria() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET /seg_adm/mant/adunidad/catalogo/";
    return this.api.getAll('/ctsxcob/mant/cocuentab/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.cuentas_bancarias = datav;
          console.log('data', datav);
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

  onInputChange1(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue1 = parsedValue;
    } else {
      this.inputValue1 = null;
    }
  }

  onInputChange2(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue2 = parsedValue;
    } else {
      this.inputValue2 = null;
    }
  }

  onInputChange3(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue3 = parsedValue;
    } else {
      this.inputValue3 = null;
    }
  }
}
