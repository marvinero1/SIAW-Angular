import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-numpagodeudor-edit',
  templateUrl: './numpagodeudor-edit.component.html',
  styleUrls: ['./numpagodeudor-edit.component.scss']
})
export class NumpagodeudorEditComponent implements OnInit {

  FormularioDataEdit: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  numPagoDeu_edit: any = [];
  dataform: any = '';
  unidadNegocio: [];
  numPagoDeu: any = [];
  usuario_logueado: any;
  user_conn: any;
  errorMessage;
  inputValue: number | null = null;

  public ventana = "tipoPagoaDeudor"
  public detalle = "tipoPagoaDeudor-edit";
  public tipo = "tipoPagoaDeudor-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public log_module: LogService, public dialogRef: MatDialogRef<NumpagodeudorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public datanumPagoDeuEdit: any, private api: ApiService, private datePipe: DatePipe, private toastr: ToastrService,
    public _snackBar: MatSnackBar) {
    
    this.usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    this.numPagoDeu_edit = this.datanumPagoDeuEdit.datanumPagoDeuEdit;
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.getAllUnidadesNegocio();
  }

  getAllUnidadesNegocio() {
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /seg_adm/mant/adunidad/catalogo/";
    return this.api.getAll('/seg_adm/mant/adunidad/catalogo/' + this.user_conn)
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
    const usuario_logueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      id: [this.datanumPagoDeuEdit.datanumPagoDeuEdit?.id],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
      codunidad: [this.dataform.codunidad, Validators.compose([Validators.required])],
    });
  }

  submitData() {
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:--  /fondos/mant/fntipopagoadeudor/ Update";
    return this.api.update('/fondos/mant/fntipopagoadeudor/' + this.user_conn + "/" + this.numPagoDeu_edit.id, data)
      .subscribe({
        next: (datav) => {
          this.numPagoDeu = datav;
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

  onInputChange(value: string) {
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.numPagoDeu_edit.nroactual = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
