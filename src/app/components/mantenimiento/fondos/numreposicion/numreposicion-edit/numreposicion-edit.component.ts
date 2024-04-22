import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-numreposicion-edit',
  templateUrl: './numreposicion-edit.component.html',
  styleUrls: ['./numreposicion-edit.component.scss']
})
export class NumreposicionEditComponent implements OnInit {

  FormularioDataEdit:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  numRepo_edit:any=[];
  dataform:any='';
  unidadNegocio:[];
  numRepo:any=[];
  usuario_logueado:any;
  user_conn:any;
  errorMessage;
  inputValue: number | null = null;

  public ventana="tipoReposicion"
  public detalle="tipoReposicion-edit";
  public tipo="tipoReposicion-edit-PUT";

  constructor(private _formBuilder: FormBuilder, public log_module:LogService, public dialogRef: MatDialogRef<NumreposicionEditComponent>, 
    @Inject(MAT_DIALOG_DATA) public dataNumRepoEdit: any, private api:ApiService, private datePipe: DatePipe,private toastr: ToastrService,
    public _snackBar: MatSnackBar){
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit(){
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    this.user_conn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

    this.numRepo_edit = this.dataNumRepoEdit.dataNumRepoEdit;
    this.getAllUnidadesNegocio();
  }

  getAllUnidadesNegocio(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adunidad/catalogo/'+this.user_conn)
      .subscribe({
        next: (datav) => {
          this.unidadNegocio = datav;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  createForm(): FormGroup {
    const usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      id: [this.dataNumRepoEdit.dataNumRepoEdit.id],
      descripcion: [this.dataform.descripcion,Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual,Validators.pattern(/^-?\d+$/)],
      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
      codunidad: [this.dataform.codunidad, Validators.compose([Validators.required])],
    });
  } 

  submitData(){
    let data = this.FormularioDataEdit.value;

    this.errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:--  /fondos/mant/fntiporeposicion/ Update";
    return this.api.update('/fondos/mant/fntiporeposicion/'+this.user_conn+"/"+this.numRepo_edit.id, data)
      .subscribe({
        next: (datav) => {
          this.numRepo = datav;
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
      this.numRepo_edit.nroactual = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
