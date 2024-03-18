import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlmacenComponent } from '@components/mantenimiento/inventario/almacen/modal-almacen/modal-almacen.component';
import { ServicioalmacenService } from '@components/mantenimiento/inventario/almacen/servicioalmacen/servicioalmacen.service';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-parametros-facturacion-SIAT',
  templateUrl: './parametros-facturacion-SIAT.component.html',
  styleUrls: ['./parametros-facturacion-SIAT.component.scss']
})
export class ParametrosFacturacionSIATComponent implements OnInit {

  nombre_ventana: string = "prgadsiat_parametros_facturacion.vb";
  
  FormularioDataInternet: FormGroup;
  FormularioDataSIN: FormGroup;
  
  userConn:any;
  BD_storage:any;
  nombre_almacen:any;
  cod_almacen_input:any;
  cod_sistema:any;
  para_facturacion:any=[];
  servicio_internet_activo:any;
  servicio_sin_activo: any;
  servicio_actividad: any=[];

  dataform: any = "";
  almacen_local:any=[];
  sector:any=[];
  factura:any=[];
  tipo_emision:any=[];
  empresa:any=[];
  sucursal:any=[];
  actividad:any=[];
  servicio_internet:any=[];
  servicio_sin: any = [];
  para_facturacion_copied: any = [];
  public cod_almacen_cliente:string;

  public ventana="Parametros Facturacion"
  public detalle="parametros_facturacion-update";
  public tipo="parametros_facturacion-UPDATE";

  constructor(public dialog: MatDialog, public log_module:LogService,public almacenservice:ServicioalmacenService,
    private api:ApiService,private toastr: ToastrService,private _formBuilder: FormBuilder,public nombre_ventana_service:NombreVentanaService){
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.BD_storage = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;

    this.getSucursal();
    this.getActividad();
    this.getTipoEmision();
    this.getTipoFactura();
    this.getTipoDocSector();
    this.getAlmacenLocal(this.BD_storage);
    this.getNombreEmpresa(this.BD_storage);
    this.mandarNombre();
  }

  ngOnInit(){
    this.almacenservice.disparadorDeAlmacenes.subscribe(data =>{
      console.log("Recibiendo Almacen: ", data);
      this.cod_almacen_cliente = data.almacen;
    });
  }

  getSucursal(){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/prgadsiat_parametros_facturacion/sucursales/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.sucursal = datav;
          console.log(this.sucursal);
          
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getActividad(){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/prgadsiat_parametros_facturacion/actividades/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.actividad = datav;
          console.log(this.actividad);
          
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getNombreEmpresa(bd){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adempresa/getNomEmpresa/'+this.userConn+"/"+bd.bd)
      .subscribe({
        next: (datav) => {
          this.empresa = datav;
          console.log(this.empresa);
          
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTipoEmision(){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/prgadsiat_parametros_facturacion/tipoEmision/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.tipo_emision = datav;
          console.log(this.tipo_emision);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTipoFactura(){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/prgadsiat_parametros_facturacion/tipoFactura/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.factura = datav;
          console.log(this.factura);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTipoDocSector(){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/prgadsiat_parametros_facturacion/tipoDocSector/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.sector = datav;
          console.log(this.sector);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getAlmacenLocal(bd){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/adempresa/'+this.userConn+"/"+bd.bd)
      .subscribe({
        next: (datav) => {
          this.almacen_local = datav;
          console.log(this.almacen_local);
          let cod_almacen = this.almacen_local.codalmacen;
          console.log(cod_almacen);
          
          this.getParamFacturacion(cod_almacen);
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getParamFacturacion(codAlmacenLocal){
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/seg_adm/mant/prgadsiat_parametros_facturacion/paramFacturacion/'+this.userConn+"/"+codAlmacenLocal)
      .subscribe({
        next: (datav) => {
          this.para_facturacion = datav;
          this.para_facturacion_copied ={...datav};
          console.log(this.para_facturacion_copied);
          this.servicio_actividad = Number(this.para_facturacion.codactividad);

          console.log( this.servicio_actividad );          
        },
                
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  actualizarServicioInternet(valor){
    let data=[];
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /seg_adm/mant/prgadsiat_parametros_facturacion/updateServInternet/ Update";
    return this.api.update('/seg_adm/mant/prgadsiat_parametros_facturacion/updateServInternet/'+this.userConn+"/"+valor, data)
      .subscribe({
        next: (datav) => {
          this.servicio_internet = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.toastr.success('! SE EDITO EXITOSAMENTE !');
          location.reload();
        },
    
        error: (err: any) => { 
          this.toastr.error('! NO SE EDITO !');
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  actualizarServicioSIN(valor){
    let data=[];
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /seg_adm/mant/prgadsiat_parametros_facturacion/updateServSIN/ Update";
    return this.api.update('/seg_adm/mant/prgadsiat_parametros_facturacion/updateServSIN/'+this.userConn+"/"+valor, data)
      .subscribe({
        next: (datav) => {
          this.servicio_internet = datav;
          this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
          this.toastr.success('! SE ACTUALIZO EXITOSAMENTE !');
          location.reload();
        },
    
        error: (err: any) => { 
          this.toastr.error('! NO SE EDITO !');
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  changeInternetActivo(value){
    console.log(value);
    this.actualizarServicioInternet(value);
  }

  changeSINActivo(value){
    console.log(value);
    this.actualizarServicioSIN(value);
  }

  modalAlmacen(): void {
    this.dialog.open(ModalAlmacenComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  mandarNombre(){
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent:this.ventana,
    });
  }
}
