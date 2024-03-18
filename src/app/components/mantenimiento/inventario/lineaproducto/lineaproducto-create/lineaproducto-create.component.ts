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
  selector: 'app-lineaproducto-create',
  templateUrl: './lineaproducto-create.component.html',
  styleUrls: ['./lineaproducto-create.component.scss']
})
export class LineaproductoCreateComponent implements OnInit {

  FormularioData:FormGroup;
  dataform:any='';
  data_linea_producto=[];
  public ingrupo=[];
  public grupo_linea=[];
  public sub_grupo_linea=[];
  userConn:any;
  usuarioLogueado:any;

  fecha_actual = new Date();
  hora_actual = new Date();

  public ventana="lineaProd-create"
  public detalle="lineaProd";
  public tipo="lineaProd-POST";

  constructor(private api:ApiService, public dialogRef: MatDialogRef<LineaproductoCreateComponent>,
    private _formBuilder: FormBuilder, private datePipe: DatePipe, public log_module: LogService,
    public _snackBar: MatSnackBar, private spinner: NgxSpinnerService, private toastr: ToastrService,) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.FormularioData = this.createForm();
  }

  ngOnInit(){
    this.getAlllineaDescuento();
    this.getAllGrupoLineas();
    this.getAllSubGrupoVenta();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      descdetallada: [this.dataform.descdetallada],
      codgrupo: [this.dataform.codgrupo],
      codgrupomer: [this.dataform.codgrupomer],
      codsubgrupo_vta: [this.dataform.codsubgrupo_vta],
      porcentaje_comis: [0],


      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    console.log(data);
    
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /inventario/mant/inlinea  POST";
    return this.api.create("/inventario/mant/inlinea/"+this.userConn, data)
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

  getAlllineaDescuento(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/ingrupo/";
    return this.api.getAll('/inventario/mant/ingrupo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.ingrupo = datav;
          // console.log('ingrupo', datav);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllGrupoLineas(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/ingrupomer/";
    return this.api.getAll('/inventario/mant/ingrupomer/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.grupo_linea = datav;
          // console.log('gruposLineas', datav);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllSubGrupoVenta(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET /inventario/mant/insubgrupoVta/";
    return this.api.getAll('/inventario/mant/insubgrupo_vta/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.sub_grupo_linea = datav;
          // console.log('gruposLineas', datav);
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
