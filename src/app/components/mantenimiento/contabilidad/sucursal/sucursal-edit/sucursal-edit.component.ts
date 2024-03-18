import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sucursal-edit',
  templateUrl: './sucursal-edit.component.html',
  styleUrls: ['./sucursal-edit.component.scss']
})
export class SucursalEditComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  sucur:any=[];
  userConn:any;
  userLogueado: any = [];
  sucursal_edit: any = [];
  sucursal_edit_codigo: any;

  almacen_get: any = [];
  cod_almacen:any=[];

  public ventana="sucursales-update"
  public detalle="sucursales-detalle";
  public tipo="transaccion-sucursales-PUT";

  constructor(private _formBuilder: FormBuilder, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<SucursalEditComponent>, public _snackBar: MatSnackBar,
    public log_module: LogService, private toastr: ToastrService, public dialog: MatDialog,
    public almacenservice: ServicioalmacenService, @Inject(MAT_DIALOG_DATA) public datasucurEdit: any ) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.userLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.sucursal_edit = datasucurEdit.datasucurEdit;
    this.sucursal_edit_codigo = datasucurEdit.datasucurEdit.codigo;
    this.FormularioData = this.createForm();
  } 
  
  ngOnInit() {
    this.almacenservice.disparadorDeAlmacenes.subscribe(data => {
      console.log("Recibiendo Almacen: ", data);
      this.cod_almacen = data.almacen;
    });

    this.getAlmacenCatalogo();
  }
  
  getAlmacenCatalogo() {
    let errorMessage: string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/inalmacen/catalogo/";
    return this.api.getAll('/inventario/mant/inalmacen/catalogo/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.almacen_get = datav;
        },
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {}
      })
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
      data:{almacen:"almacen"}
    });
  }

  onLeaveAlmacen(event: any) {
    const inputValue = event.target.value;
    let entero = Number(inputValue);

    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.almacen_get.some(objeto => objeto.codigo === entero);

    if (!encontrado) {
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO VALOR DE INPUT");
    } else {
      event.target.value = entero;
    }
  }

  createForm(): FormGroup{
    let usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.sucursal_edit_codigo, Validators.pattern(/^-?\d+$/)],
      codalmacen: [this.dataform.codalmacen,Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion,],

      horareg: [hora_actual_complete],
      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      usuarioreg: [usuario_logueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /contab/mant/cnsucursal/";
    
    return this.api.update("/contab/mant/cnsucursal/"+this.userConn+"/"+this.sucursal_edit_codigo, data)
      .subscribe({
        next: (datav) => {
          this.sucur = datav;

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

}
