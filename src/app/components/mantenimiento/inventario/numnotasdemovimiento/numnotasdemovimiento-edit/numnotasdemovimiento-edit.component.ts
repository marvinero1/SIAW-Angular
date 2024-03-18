import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AreaEditComponent } from '@components/mantenimiento/administracion/area/area-edit/area-edit.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
@Component({
  selector: 'app-numnotasdemovimiento-edit',
  templateUrl: './numnotasdemovimiento-edit.component.html',
  styleUrls: ['./numnotasdemovimiento-edit.component.scss']
})
export class NumnotasdemovimientoEditComponent implements OnInit {

  public FormularioDataEdit:FormGroup;
  public fecha_actual = new Date();
  public hora_actual = new Date();
  public numnotasmovimientoedit:any=[];
  public dataform:any='';
  public empresa:[];
  public unidadnegocio=[];
  public area:any=[];
  public errorMessage;

  userConn: any;
  usuarioLogueado: any;
  
  public ventana="nts-movimiento-edit"
	public detalle="nts-movimiento-detalle";
	public tipo="transaccion-nts-movimiento-PUT";
  
  constructor(private _formBuilder: FormBuilder, public dialogRef: MatDialogRef<AreaEditComponent>, public log_module:LogService,
    @Inject(MAT_DIALOG_DATA) public dataAreaEdit: any, private api:ApiService, private datePipe: DatePipe, 
    public _snackBar: MatSnackBar) {
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    
    this.numnotasmovimientoedit = this.dataAreaEdit.dataAreaEdit;
    console.log( this.numnotasmovimientoedit);
    
    
    this.FormularioDataEdit = this.createForm();
  }

  ngOnInit(){    
    this.getAllUnidadNegocio();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      id: [this.numnotasmovimientoedit.id],
      descripcion: [this.dataform.descripcion,Validators.compose([Validators.required])],
      nroactual: [this.dataform.nroactual],
      codunidad: [this.dataform.codunidad],

      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  getAllUnidadNegocio(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adempresa/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.unidadnegocio = datav;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  submitData(){
    let data = this.FormularioDataEdit.value;
    this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /seg_adm/mant/adusuario Update";

    return this.api.update('/inventario/mant/intipomovimiento/'+ this.userConn+"/"+this.numnotasmovimientoedit.id, data)
      .subscribe({
        next: (datav) => {
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.area = datav;
          this.onNoClick();

          this._snackBar.open('Se ha editado correctamente!', 'Ok', {
            duration: 3000,
            panelClass: ['coorporativo-snackbar', 'login-snackbar'],
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
