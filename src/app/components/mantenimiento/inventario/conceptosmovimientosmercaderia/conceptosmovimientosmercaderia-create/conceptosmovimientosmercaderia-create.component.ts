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
  selector: 'app-conceptosmovimientosmercaderia-create',
  templateUrl: './conceptosmovimientosmercaderia-create.component.html',
  styleUrls: ['./conceptosmovimientosmercaderia-create.component.scss']
})
export class ConceptosmovimientosmercaderiaCreateComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  userConn:any;
  userLogueado: any = [];
  numTransf: any = [];
  inputValue: number | null = null;

  public ventana="numConceptoNotasMovimiento-create"
  public detalle="numConceptoNotasMovimiento-detalle";
  public tipo="transaccion-numConceptoNotasMovimiento-POST";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<ConceptosmovimientosmercaderiaCreateComponent>, public _snackBar: MatSnackBar,
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
      descripcion: [this.dataform.descripcion,Validators.compose([Validators.required])],
      factor: [this.dataform.factor,Validators.pattern(/^-?\d+$/)],
      traspaso: [this.dataform.traspaso],
      porcosto: [this.dataform.porcosto],
      codtarifa: [this.dataform.codtarifa],
      codcontra_concepto: [this.dataform.codcontra_concepto],
      nroactual: [this.dataform.nroactual,Validators.pattern(/^-?\d+$/)],
      usuario_final: [this.dataform.usuario_final],
      cliente: [this.dataform.cliente], 

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /inventario/mant/inconcepto/";
    
    return this.api.create("/inventario/mant/inconcepto/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.numTransf = datav;

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

  // getAllUnidadesNegocio(){
  //   let errorMessage = "La Ruta presenta fallos al hacer peticion GET /seg_adm/mant/adunidad/catalogo/";
  //   return this.api.getAll('/seg_adm/mant/adunidad/catalogo/'+this.userConn)
  //     .subscribe({
  //       next: (datav) => {
  //         this.negocio = datav;
  //         console.log('data', datav);
  //       },
    
  //       error: (err: any) => { 
  //         console.log(err, errorMessage);
  //       },
  //       complete: () => { }
  //     })
  // }
  
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
