import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dptopais-edit',
  templateUrl: './dptopais-edit.component.html',
  styleUrls: ['./dptopais-edit.component.scss']
})
export class DptopaisEditComponent implements OnInit {

  FormularioDataEdit: FormGroup;
  dataform: any = '';
  dpto: any = [];
  userConn: any;
  fecha_actual = new Date();
  hora_actual = new Date();
  errorMessage: string;

  public ventana = "dptopais-update"
  public detalle = "dptopais-detalle";
  public tipo = "dptopais-EDIT";


  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<DptopaisEditComponent>, public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dataDptoEdit: any, public log_module: LogService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;

    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit() {
    this.dpto = this.dataDptoEdit.dataDptoEdit;
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;

    return this._formBuilder.group({
      codigo: [this.dataDptoEdit.dataDptoEdit.codigo],
      nombre: [this.dataform.nombre, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual, "yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: ["DPD200"],
    });
  }

  submitData() {
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion" + "Ruta:-/seg_adm/mant/addepto/";
    return this.api.update('/seg_adm/mant/addepto/' + this.userConn + "/" + this.dataDptoEdit.dataDptoEdit.codigo, data)
      .subscribe({
        next: (datav) => {
          this.dpto = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.onNoClick();
          this._snackBar.open('Se ha editado correctamente!', 'Ok', {
            duration: 3000,
          });
          location.reload();
        },

        error: (err: any) => {
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
