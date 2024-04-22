import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-banco-create',
  templateUrl: './banco-create.component.html',
  styleUrls: ['./banco-create.component.scss']
})
export class BancoCreateComponent {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  userConn:any;
  userLogueado: any = [];
  banco_post:any=[];
  inputValue: number | null = null;

  public ventana="Banco-create"
  public detalle="Banco-detalle";
  public tipo="transaccion-Banco-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<BancoCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  } 

  ngOnInit() {

  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      nombre: [this.dataform.nombre, Validators.compose([Validators.required])],
      direccion: [this.dataform.direccion],
      nit: [this.dataform.nit, Validators.pattern(/^-?\d+$/)],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /ctsxcob/mant/cobanco/";
    
    return this.api.create("/ctsxcob/mant/cobanco/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.banco_post = datav;

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
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onInputChange(value: string) {
    console.log(value);
    
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.inputValue = 0;
    }
  }

}
