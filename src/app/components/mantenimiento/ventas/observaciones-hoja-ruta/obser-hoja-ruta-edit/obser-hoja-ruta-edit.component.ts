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
  selector: 'app-obser-hoja-ruta-edit',
  templateUrl: './obser-hoja-ruta-edit.component.html',
  styleUrls: ['./obser-hoja-ruta-edit.component.scss']
})
export class ObserHojaRutaEditComponent implements OnInit {

  FormularioData:FormGroup;
  dataform:any='';
  data_linea_producto=[];
  public ingrupo=[];
  public grupo_linea=[];
  public sub_grupo_linea = [];
  hoja_data_edit: any = [];
  userConn:any;
  usuarioLogueado: any;
  inputValue: number | null = null;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana="lineaProd-create"
  public detalle="lineaProd";
  public tipo="lineaProd-POST";

  constructor(private api:ApiService, public dialogRef: MatDialogRef<ObserHojaRutaEditComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService,
    public _snackBar: MatSnackBar, private spinner: NgxSpinnerService, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public hoja: any) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.hoja_data_edit = hoja.hoja;
    this.FormularioData = this.createForm();
  }

  ngOnInit(){

  }
  
  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: this.hoja_data_edit.codigo,
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      tipo: [this.dataform.tipo, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    console.log(data);
    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:--  /inventario/mant/inlinea  POST";
    return this.api.update("/venta/mant/veobs_ruta/"+this.userConn+"/"+this.hoja_data_edit.codigo, data)
      .subscribe({
        next: (datav) => {
          this.data_linea_producto = datav;

          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.spinner.show();
          this.toastr.success('Guardado con Exito! 🎉');  
          
          location.reload();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onInputChange(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);
    console.log(parsedValue);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {

      this.inputValue = parsedValue;
    } else {
      this.inputValue = 0;
    }
  }
  
  close(): void {
    this.dialogRef.close();
  }

}
