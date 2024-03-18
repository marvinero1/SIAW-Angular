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
  selector: 'app-numlibrosbancos-create',
  templateUrl: './numlibrosbancos-create.component.html',
  styleUrls: ['./numlibrosbancos-create.component.scss']
})
export class NumlibrosbancosCreateComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  numLibrBanco:any=[];
  cuentas_bancarias:any=[];
  userConn:any;
  userLogueado:any=[];
  inputValue: number | null = null;

  public ventana="numeracionlibrosbancos-create"
  public detalle="numeracionlibrosbancos-detalle";
  public tipo="transaccion-numeracionlibrosbancos-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<NumlibrosbancosCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
    
  } 

  ngOnInit() {
    this.getNroCuentaBancaria();
  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      id: [this.dataform.id, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual, Validators.pattern(/^-?\d+$/)],
      codcuentab: [this.dataform.codcuentab],
      desde: [this.datePipe.transform(this.dataform.desde, "yyyy-MM-dd")],
      hasta: [this.datePipe.transform(this.dataform.hasta, "yyyy-MM-dd")],
      origen: [this.dataform.origen],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /fondos/mant/fntipo_librobanco/";
    
    return this.api.create("/fondos/mant/fntipo_librobanco/"+this.userConn, data)
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

  getNroCuentaBancaria(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET /seg_adm/mant/adunidad/catalogo/";
    return this.api.getAll('/ctsxcob/mant/cocuentab/catalogo/'+this.userConn)
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
  
  
  onInputChange(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.inputValue = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
