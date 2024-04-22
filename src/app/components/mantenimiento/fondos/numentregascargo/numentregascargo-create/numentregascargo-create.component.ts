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
  selector: 'app-numentregascargo-create',
  templateUrl: './numentregascargo-create.component.html',
  styleUrls: ['./numentregascargo-create.component.scss']
})
export class NumentregascargoCreateComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  numEntC:any=[];
  negocio:any=[];
  userConn:any;
  userLogueado:any=[];
  inputValue: number | null = null;

  public ventana="tipoEntrega-create"
  public detalle="tipoEntrega-detalle";
  public tipo="transaccion-tipoEntrega-POST";


  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<NumentregascargoCreateComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
    this.getAllUnidadesNegocio();
  } 



  ngOnInit() {

  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      id: [this.dataform.id,Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion,Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual,Validators.pattern(/^-?\d+$/)],
      codunidad: [this.dataform.codunidad],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /fondos/mant/fntipoentrega/";
    
    return this.api.create("/fondos/mant/fntipoentrega/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.numEntC = datav;

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

  getAllUnidadesNegocio(){
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET /seg_adm/mant/adunidad/catalogo/";
    return this.api.getAll('/seg_adm/mant/adunidad/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.negocio = datav;
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

  onInputChange(value: string) {
    // Validar y formatear el valor ingresado
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    } else {
      this.inputValue = null;
    }
  }
}
