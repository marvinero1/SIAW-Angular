import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cuentas-efectivos-edit',
  templateUrl: './cuentas-efectivos-edit.component.html',
  styleUrls: ['./cuentas-efectivos-edit.component.scss']
})
export class CuentasEfectivosEditComponent implements OnInit {
  
  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform: any = '';
  userConn:any;
  numLibrBanco:any=[];
  cuentas_bancarias:any=[];
  userLogueado: any = [];
  moneda: any = [];
  cuentas_efectivas_edit: any = [];
  inputValue: number | null = null;

  public ventana="cuentas_efectivo-create"
  public detalle="cuentas_efectivo-detalle";
  public tipo="transaccion-cuentas_efectivo-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<CuentasEfectivosEditComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public datacuentasefectivoEdit: any) {
    
    this.cuentas_efectivas_edit = datacuentasefectivoEdit.datacuentasefectivoEdit;

    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  } 

  ngOnInit() {
    this.getMoneda();
  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      id: [this.cuentas_efectivas_edit.id, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      balance: [this.dataform.balance,Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda],
      fecha: [this.datePipe.transform(this.dataform.fecha, "yyyy-MM-dd")],
      tipo_movimiento: [this.dataform.tipo_movimiento],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /fondos/mant/fncuenta/";
    
    return this.api.update("/fondos/mant/fncuenta/"+this.userConn+"/"+this.cuentas_efectivas_edit.id , data)
      .subscribe({
        next: (datav) => {
          this.numLibrBanco = datav;

          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
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

  getMoneda(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/fondos/mant/fncuenta/";
    return this.api.getAll('/seg_adm/mant/admoneda/'+this.userConn)
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

  onNoClick(): void {
    this.dialogRef.close();
  }

}
