import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-numchequesclientes-edit',
  templateUrl: './numchequesclientes-edit.component.html',
  styleUrls: ['./numchequesclientes-edit.component.scss']
})
export class NumchequesclientesEditComponent implements OnInit {

  FormularioDataEdit: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  numChecCli_edit: any = [];
  dataform: any = '';
  unidadNegocio: [];
  numChecCli: any = [];
  cuentas_bancarias: any = [];
  usuario_logueado: any;
  userConn: any;
  errorMessage;
  inputValue1: number | null = null;
  inputValue2: number | null = null;
  inputValue3: number | null = null;

  public ventana = "numeracionChequeCliente"
  public detalle = "numeracionChequeCliente-edit";
  public tipo = "numeracionChequeCliente-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public log_module: LogService, public dialogRef: MatDialogRef<NumchequesclientesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public datanumChecCliEdit: any, private api: ApiService, private datePipe: DatePipe, private toastr: ToastrService,
    public _snackBar: MatSnackBar) {

    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.numChecCli_edit = this.datanumChecCliEdit.datanumChecCliEdit;
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.getNroCuentaBancaria();
    this.getAllUnidadesNegocio();
  }

  getAllUnidadesNegocio() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adunidad/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          this.unidadNegocio = datav;
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  createForm(): FormGroup {
    const usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: this.numChecCli_edit.id,
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
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  /fondos/mant/fnnumeracioncheque_cliente/ Update";
    return this.api.update('/fondos/mant/fnchequera/' + this.userConn + "/" + this.numChecCli_edit.id, data)
      .subscribe({
        next: (datav) => {
          this.numChecCli = datav;
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },

        error: (err: any) => {
          this.toastr.error('! NO SE EDITO !');
          console.log(err, this.errorMessage);
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
