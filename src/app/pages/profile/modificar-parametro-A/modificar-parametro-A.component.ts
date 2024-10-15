import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modificar-parametro-A',
  templateUrl: './modificar-parametro-A.component.html',
  styleUrls: ['./modificar-parametro-A.component.scss']
})
export class ModificarParametroAComponent implements OnInit {

  nombre_ventana: string = "prgmodifparametros_a.vb";

  FormularioData: FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  rosca: any = [];
  userConn: any;
  cod_empresa: any = [];
  empresa: any;
  control: boolean;
  isChecked = true;
  bd: any;
  usuarioLogueado: any;

  public ventana = "prgmodifparametros_a-create"
  public detalle = "prgmodifparametros_a-detalle";
  public tipo = "transaccion-prgmodifparametros_a-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api: ApiService, public dialogRef: MatDialogRef<ModificarParametroAComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService,) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.bd = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;

    this.FormularioData = this.createForm();
    this.getCodEmpresa()
  }

  ngOnInit(): void {
    this.control = this.cod_empresa;
    console.log();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      control: [this.dataform.control],
    });
  }

  getCodEmpresa() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET -/seg_adm/mant/adparametros/";
    return this.api.getAll('/seg_adm/mant/adparametros/' + this.userConn + "/" + this.bd.bd)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
          this.cod_empresa = this.empresa.cierres_diarios;
          console.log(this.cod_empresa);

          this.spinner.show();
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

  submitData() {
    let bd1 = this.bd.bd;

    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion" + "Ruta:- /seg_adm/mant/adparametros/updateCierresDiarios UPDATE";

    console.log(data.control);

    return this.api.update("/seg_adm/mant/adparametros/updateCierresDiarios/" + this.userConn + "/" + bd1 + "/" + data.control, data)
      .subscribe({
        next: (datav) => {
          this.rosca = datav;
          console.log('data', datav);

          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo, "", "");
          this.toastr.success('! SE GUARDO EXITOSAMENTE !');

          this._snackBar.open('Se Guardo Correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbarBlue', 'login-snackbar'],
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


  onNoClick(): void {
    this.dialogRef.close();
  }
}
