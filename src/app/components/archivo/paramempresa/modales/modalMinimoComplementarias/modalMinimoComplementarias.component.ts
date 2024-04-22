import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modalMinimoComplementarias',
  templateUrl: './modalMinimoComplementarias.component.html',
  styleUrls: ['./modalMinimoComplementarias.component.scss']
})
export class ModalMinimoComplementariasComponent implements OnInit {

  FormularioData:FormGroup;
  dataform:any="";
  userConn:any;
  BD_storage:any;

  dataEmpresa:any=[];
  dataparametros_complementario:any=[];
  tarifa:any=[];
  moneda:any=[];
  minimo_complementario:any=[];

  displayedColumns = ['tarifa','sin_desct','monto','moneda','codempresa','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  public ventana="minimocomplemen-create"
  public detalle="minimocomplemen-detalle";
  public tipo="minimocomplemen-POST";

  constructor(public dialogRef: MatDialogRef<ModalMinimoComplementariasComponent>, private api:ApiService, private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public dataEmpresaParametros: any, public _snackBar: MatSnackBar,public dialog: MatDialog,
    private _formBuilder: FormBuilder, public log_module:LogService){
      this.FormularioData = this.createForm();

      this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
      this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

  }

  ngOnInit() {


    this.dataEmpresa = this.dataEmpresaParametros.dataEmpresaParametros;
    this.getbyCodigoParametros(this.userConn, this.BD_storage);
    this.getAllintarifa(this.userConn);
    this.getAllmoneda(this.userConn);

    // console.log(this.dataEmpresa);
  } 

  createForm(): FormGroup{      
    return this._formBuilder.group({
      codempresa: [this.dataEmpresaParametros.dataEmpresaParametros],
      sindesc:[this.dataform.sindesc, Validators.compose([Validators.required])],
      codtarifa: [this.dataform.codtarifa, Validators.compose([Validators.required])],
      monto: [this.dataform.monto, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
    });
  }

  getAllintarifa(userConn){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -- /inventario/mant/intarifa";
    return this.api.getAll('/inventario/mant/intarifa/'+userConn)
      .subscribe({
        next: (datav) => {
          this.tarifa = datav;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllmoneda(userConn){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/admoneda/'+userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getbyCodigoParametros(userConn, bd){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    // return this.api.getAll('/seg_adm/mant/getParametroMinimoComplementarias/'+this.dataEmpresaParametros.dataEmpresaParametros)
    return this.api.getAll('/seg_adm/mant/adparametros_complementarias/'+userConn+"/"+bd.bd)  
      .subscribe({
        next: (datav) => {
          this.dataparametros_complementario = datav;
          // console.log('data', datav);
          this.dataSource = new MatTableDataSource(this.dataparametros_complementario);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /serol";
     console.log(data);
    
    return this.api.create("/seg_adm/mant/adparametrosComplementarias", data)
      .subscribe({
        next: (datav) => {
          this.minimo_complementario = datav;
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
           console.log('data', datav);
          this.spinner.show();

          setTimeout(() => {
            this.spinner.hide();
          }, 1000);

          this._snackBar.open('Se ha guardado correctamente!', 'Ok', {
            duration: 3000,
          });
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  eliminar(element): void{
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  seg_adm/mant/adarea/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '350px',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result:Boolean)=>{
      // console.log(result);
      if(result) {
        return this.api.delete('/seg_adm/mant/adparametrosComplementarias/'+ element.codigo)
        .subscribe({
          next: () => {
            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
            
            this.getbyCodigoParametros(this.userConn, this.BD_storage);
          },
          error: (err: any) => { 
            console.log(errorMessage);
          },
          complete: () => { }
        })
      }else{
        alert("¡No se elimino!");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
