import { DatePipe } from '@angular/common';
import { Component, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.scss']
})
export class UsuarioEditComponent {

  @Input()usuario ='';
  dataform:any='';
  usuario_edit:any=[];
  pepersona:any = [];
  serol:any = [];
  fecha_actual = new Date();
  hora_actual = new Date();
  errorMessage;

  FormularioDataEdit:FormGroup;

  public ventana="usuario-edit"
	public detalle="usuario-detalle";
	public tipo="transaccion-usuario-PUT";

  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<UsuarioEditComponent>, public log_module:LogService,
    @Inject(MAT_DIALOG_DATA) public dataUsuarioEdit: any, private api:ApiService,private datePipe: DatePipe, public _snackBar: MatSnackBar){
  }

  ngOnInit(): void {
    this.usuario_edit = this.dataUsuarioEdit.dataUsuarioEdit;
    this.FormularioDataEdit = this.createForm();
    
    this.getAllpePersona();
    this.getAllRol();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      login: [this.dataform.login,Validators.compose([Validators.required])],
      password: [this.dataform.password,Validators.compose([Validators.required])],
      persona: [this.dataform.persona],
      vencimiento: [this.datePipe.transform(this.dataform.vencimiento, "yyyy-MM-dd")],
      activo: [this.dataform.activo, parseInt(this.dataform.activo)],
      codrol: [this.dataform.codrol],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: ["DPD200"],
    });
  }

  getAllpePersona(){
    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/pers_plan/mant/pepersona')
      .subscribe({
        next: (datav) => {
          this.pepersona = datav;
          // console.log('data', datav);
        },
    
        error: (err: any) => { 
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  getAllRol(){
    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/serol')
      .subscribe({
        next: (datav) => {
          this.serol = datav;
          // console.log('data', datav);
        },
    
        error: (err: any) => { 
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }

  submitData(){
    let data = this.FormularioDataEdit.value;
    // console.log(data);
    // console.log('/usuarioEstado/'+data.$id, data);
    
    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /seg_adm/mant/adusuario Update";
    return this.api.update('/seg_adm/mant/adusuario/'+data.login, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.serol = datav;
          // console.log('data', datav);
          this.onNoClick();

          this._snackBar.open('Se ha editado correctamente!', 'Ok', {
            duration: 3000,
          });
          location.reload();
        },
    
        error: (err: any) => { 
          console.log(err, this.errorMessage);
        },
        complete: () => { }
      })
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
