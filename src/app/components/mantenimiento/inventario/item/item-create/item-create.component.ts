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
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss'],
})
export class ItemCreateComponent implements OnInit {
  
  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  rosca:any=[];
  inudemed:any=[];
  interminacion:any=[];
  inresistencia:any=[];
  inlinea:any=[];
  initem_create:any=[];
  userConn:any;
  usuarioLogueado:any;

  public ventana="initem-create"
  public detalle="initem-detalle";
  public tipo="transaccion-initem-POST";

  constructor(private _formBuilder: FormBuilder,  private datePipe: DatePipe,  private spinner: NgxSpinnerService,
    private api:ApiService, public dialogRef: MatDialogRef<ItemCreateComponent>, public _snackBar: MatSnackBar,
    public log_module:LogService,private toastr: ToastrService,){
      
  this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

  this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;

  this.FormularioData = this.createForm();
  }

  ngOnInit(): void {
    this.getAllRosca();
    this.getAllinudemed();
    this.getAllinTerminacion();
    this.getAllinReistencia();
    this.getAllinLinea();
  }

  createForm(): FormGroup {
    let hour = this.hora_actual.getHours();
    let minuts = this.hora_actual.getMinutes();
    let hora_actual_complete = hour + ":" + minuts;  

    return this._formBuilder.group({
      codigo: [this.dataform.codigo, Validators.compose([Validators.required])],
      descripcion: [this.dataform.descripcion, Validators.compose([Validators.required])],
      descripcorta: [this.dataform.descripcorta, Validators.compose([Validators.required])],
      descripabr: [this.dataform.descripabr, Validators.compose([Validators.required])],

      medida: [this.dataform.medida],
      unidad: [this.dataform.unidad],
      rosca: [this.dataform.rosca],
      terminacion: [this.dataform.terminacion],
      codresistencia: [this.dataform.codresistencia],
      peso: [this.dataform.peso],
      kit: [this.dataform.kit],
      clasificacion: [this.dataform.clasificacion],
      codlinea: [this.dataform.codlinea],
      estadocv: [this.dataform.estadocv],
      enlinea: [this.dataform.enlinea],
      reservastock: [this.dataform.reservastock],
      usar_en_movimiento: [this.dataform.usar_en_movimiento],
      controla_negativo: [this.dataform.controla_negativo],
      codigobarra: [this.dataform.codigobarra],
      paga_comision: [this.dataform.paga_comision],

      costo: [0],
      monedacosto: [""],
      saldominimo: [0],
      iva: [0],
      codmoneda_valor_criterio: [""],
      porcen_gac: [0],
      nandina: [""],
      porcen_saldo_restringido: [0],
      codproducto_sin: [""],

      fechareg: [this.datePipe.transform(this.fecha_actual,"yyyy-MM-dd")],
      horareg: [hora_actual_complete],
      usuarioreg: [this.usuarioLogueado],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    console.log(data);
    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:--  /inventario/mant/initem  POST";
    return this.api.create("/inventario/mant/initem/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.initem_create = datav;

          console.log('data', datav);
          this.toastr.success('! SE GUARDO EXITOSAMENTE !');
          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          location.reload();
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  getAllinudemed(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --inventario/mant/inudemed";
    return this.api.getAll('/inventario/mant/inudemed/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.inudemed = datav;
          console.log('UnidadMedida: ',  this.inudemed);
        },
                
        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllRosca(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/inventario/mant/inrosca";
    return this.api.getAll('/inventario/mant/inrosca/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.rosca = datav;
          // console.log('roscas', datav);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllinTerminacion(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --inventario/mant/interminacion";
    return this.api.getAll('/inventario/mant/interminacion/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.interminacion = datav;
          // console.log('roscas', datav);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllinReistencia(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --inventario/mant/inresistencia";
    return this.api.getAll('/inventario/mant/inresistencia/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.inresistencia = datav;
          // console.log('roscas', datav);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllinLinea(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --inventario/mant/inresistencia";
    return this.api.getAll('/inventario/mant/inlinea/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.inlinea = datav;
          // console.log('roscas', datav);
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
