import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-numeracion-comprobantes-edit',
  templateUrl: './numeracion-comprobantes-edit.component.html',
  styleUrls: ['./numeracion-comprobantes-edit.component.scss']
})
export class NumeracionComprobantesEditComponent implements OnInit {

  FormularioDataEdit:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  numcomprob_edit:any=[];
  dataform:any='';
  numcomprob:any=[];
  usuario_logueado:any;
  user_conn:any;
  errorMessage;
  inputValue: number | null = null;

  public ventana="numComprobates"
  public detalle="numComprobates-edit";
  public tipo="numComprobates-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public log_module:LogService, public dialogRef: MatDialogRef<NumeracionComprobantesEditComponent>, 
    @Inject(MAT_DIALOG_DATA) public datanumcomprobEdit: any, private api:ApiService, private datePipe: DatePipe,private toastr: ToastrService,
    public _snackBar: MatSnackBar){
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit(){
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.user_conn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.numcomprob_edit = this.datanumcomprobEdit.datanumcomprobEdit;
  }


  createForm(): FormGroup {
    const usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      id: [this.datanumcomprobEdit.datanumcomprobEdit.id],
      descripcion: [this.dataform.descripcion,Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual,Validators.pattern(/^-?\d+$/)],
      ajuste: [false],
      desde: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      hasta: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  } 

  submitData(){
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:--  /contab/mant/cnnumeracion/ Update";
    return this.api.update('/contab/mant/cnnumeracion/'+this.user_conn+"/"+this.numcomprob_edit.id, data)
      .subscribe({
        next: (datav) => {
          this.numcomprob = datav;
          this.onNoClick();
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },
    
        error: (err: any) => { 
          this.toastr.error('! NO SE EDITO !');
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  onInputChange(value: string){
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
      this.inputValue = parsedValue;
    }else{
      this.numcomprob_edit.nroactual = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
