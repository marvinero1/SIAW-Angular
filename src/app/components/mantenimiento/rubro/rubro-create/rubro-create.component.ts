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
  selector: 'app-rubro-create',
  templateUrl: './rubro-create.component.html',
  styleUrls: ['./rubro-create.component.scss']
})
export class RubroCreateComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  rubro:any=[];
  moneda:any=[];
  empresa:any=[];
  userConn:any;
  userLogueado:any=[];

  public ventana="rubro-create"
  public detalle="rubro-detalle";
  public tipo="transaccion-rubro-POST";
  
  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<RubroCreateComponent>, public _snackBar: MatSnackBar,
    public log_module:LogService,private toastr: ToastrService){

    this.FormularioData = this.createForm();
  } 

  ngOnInit(): void {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    console.log(this.userLogueado);

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.maxLength(3), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],

      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /venta/mant/verubro/";
    
    return this.api.create("/venta/mant/verubro/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.rubro = datav;

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

  getAllEmpresa(user_conn){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adempresa/'+user_conn)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
          //console.log('data', datav);
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
