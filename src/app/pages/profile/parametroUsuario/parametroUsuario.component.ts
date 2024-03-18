import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-parametroUsuario',
  templateUrl: './parametroUsuario.component.html',
  styleUrls: ['./parametroUsuario.component.scss']
})
export class ParametroUsuarioComponent implements OnInit {

  FormularioDataParamUsuario:FormGroup;
  dataform:any=[];
  public moneda:any=[];
  public vendedor:any=[];
  public almacen:any=[];
  public id_comprobante:any=[];
  public tipo_comprobante:any=[];
  public id_cobranza:any=[];
  public tipo_movimiento:any=[];
  public usuario_logueado:any=[];
  errorMessage: string;
  dataformupdate:any=[];
  
  constructor(private api:ApiService, private spinner: NgxSpinnerService, public dialog: MatDialog, public _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder){  

  }

  ngOnInit(){
    this.getUsuarioLogueadoParametrosUsuario();
    this.getAllVendedor();
    this.getAllmoneda();
    this.getAllAlmacen();
    this.getAllIDComprobante();
    this.getAllTipoComprobante();
    this.getAllMovimiento();

    this.FormularioDataParamUsuario = this.createForm();
  }

  getUsuarioLogueadoParametrosUsuario(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/adusparametros";
    return this.api.getById('/seg_adm/mant/adusparametros/'+'dpd2')
      .subscribe({
        next: (datav) => {
          this.usuario_logueado = datav;
          console.log(this.usuario_logueado);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllVendedor(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/venta/mant/vevendedor')
      .subscribe({
        next: (datav) => {
          this.vendedor = datav;
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllmoneda(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/seg_adm/mant/admoneda')
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

  getAllAlmacen(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/inventario/mant/inalmacen')
      .subscribe({
        next: (datav) => {
          this.almacen = datav;
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllIDComprobante(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/contab/mant/cnnumeracion')
      .subscribe({
        next: (datav) => {
          this.id_comprobante = datav;
          // console.log(this.id_comprobante);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAllTipoComprobante(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/contab/mant/cntipo')
      .subscribe({
        next: (datav) => {
          this.tipo_comprobante = datav;
          // console.log(this.tipo_comprobante);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }


  // Ventas
  getAllIDCobranza(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/contab/mant/cntipo')
      .subscribe({
        next: (datav) => {
          this.id_cobranza = datav;
          // console.log(this.tipo_comprobante);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }



   // Inventario
   getAllMovimiento(){
    let errorMessage:string;
    errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET --/seg_adm/mant/admoneda";
    return this.api.getAll('/inventario/mant/intipomovimiento')
      .subscribe({
        next: (datav) => {
          this.tipo_movimiento = datav;
          // console.log(this.tipo_comprobante);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  createForm(): FormGroup{
    return this._formBuilder.group({
      codvendedor: [this.dataform.codvendedor, Validators.compose([Validators.required])],
      codmoneda: [this.dataform.codmoneda, Validators.compose([Validators.required])],
      codalmacen: [this.dataform.codalmacen, Validators.compose([Validators.required])],
      codmonedatdc: [this.dataform.codmonedatdc],
      cumpleanios: [1],
      usar_bd_opcional: [0],

      idcomprobante: [this.dataform.idcomprobante == null ? false:true],
      codtipo : [this.dataform.codtipo == null ? false:true],
      mostrar_alertas_cta_automatica: [this.dataform.mostrar_alertas_cta_automatica == null ? false:true],

      codalmsald1: [this.dataform.codalmsald1 == null ? false:true],
      codalmsald2: [this.dataform.codalmsald2 == null ? false:true],
      codalmsald3: [this.dataform.codalmsald3 == null ? false:true],
      codalmsald4: [this.dataform.codalmsald4 == null ? false:true],
      codalmsald5: [this.dataform.codalmsald5 == null ? false:true],

      idmovimiento: [this.dataform.idmovimiento == null ? false:true],
      catalogo_items_estado: [this.dataform.idmovimiento == null ? false:true],


      alerta_nr_sin_fact: [this.dataform.alerta_nr_sin_fact == null ? false:true],
      habilitar_boton_grabar: [this.dataform.habilitar_boton_grabar == null ? false:true],


      alerta_cheque_cliente: [this.dataform.alerta_cheque_cliente == null ? false:true],
      avisar_sindistribuir: [this.dataform.avisar_sindistribuir == null ? false:true],

      
      // coddescuento: [this.dataform.coddescuento],
      // idcuenta: [this.dataform.idcuenta],
      // idremito: [this.dataform.idremito],
      // codcliente: [this.dataform.codcliente],
      // idnotacredito : [this.dataform.idnotacredito ],
      // alerta_nr_sin_fact : [this.dataform.alerta_nr_sin_fact ],
      // habilitar_boton_grabar : [this.dataform.habilitar_boton_grabar ],


      // cierres_diarios: [this.dataform.cierres_diarios == null ? false:true],   
    });
  }

  submitDataUpdateParamUsuario(){
    let data = this.FormularioDataParamUsuario.value;
    console.log(data);

    // this.errorMessage = "La Ruta o el servidor presenta fallos al hacer la creacion"+"Ruta:--  /seg_adm/mant/adusuario Update";
    // return this.api.update('/seg_adm/mant/adparametros/'+"PS/", data)
    //   .subscribe({
    //     next: (datav) => {
    //       this.dataformupdate = datav;
    //       // console.log('data', datav);
    //       this._snackBar.open('Se ha editado correctamente!', 'Ok', {
    //         duration: 3000,
    //       });
    //       // location.reload();
    //     },
    
    //     error: (err: any) => { 
    //       console.log(err, this.errorMessage);
    //     },
    //     complete: () => { }
    //   })
  }
}
