import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { DialogDeleteComponent } from '@modules/dialog-delete/dialog-delete.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-urgentes-almacenes',
  templateUrl: './urgentes-almacenes.component.html',
  styleUrls: ['./urgentes-almacenes.component.scss']
})
export class UrgentesAlmacenesComponent implements OnInit {

  FormularioData: FormGroup;  
  fecha_actual = new Date();
  hora_actual = new Date();
  userConn: string; 
  usuario: string; 
  usuario_logueado: string;
  cod_precio_venta_modal_codigo: string;

  dataform: any = '';
  almacen_codigo: any;
  almacen: any = [];
  pedidos_urgentes: any = [];
  moneda: any = [];
  cod_precio_venta_modal: any = [];
  tarifa_get: any = [];
  urgente_save: any = [];

  montoInputView: boolean = false;
  pesoInputView: boolean = false;
  trueBooleano: boolean = true;
  falseBooleano: boolean = false;

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  displayedColumns = ['codtarifa', 'suarea', 'monto', 'codmoneda', 'peso', 'accion'];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  nombre_ventana:string="abminalmacen.vb";
  public ventana="Almacen"
  public detalle="almacen-detalle";
  public tipo = "transaccion-almacen-DELETE";

  constructor(public dialog: MatDialog, private api: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public nombre_ventana_service: NombreVentanaService, public log_module: LogService, public router: Router,
    @Inject(MAT_DIALOG_DATA) public cod_almacen_solurgente: any, private _formBuilder: FormBuilder,
    public servicioPrecioVenta: ServicioprecioventaService, public dialogRef: MatDialogRef<UrgentesAlmacenesComponent>) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuario = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    this.getMoneda();
    this.getTarifa();
  
    this.FormularioData = this.createForm();
    this.almacen = cod_almacen_solurgente.cod_almacen_solurgente;
    this.almacen_codigo = cod_almacen_solurgente.cod_almacen_solurgente.codigo;

    this.cargarTablaPedidosUrgentes();
  }

  ngOnInit() {
    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;
    });
    // fin_precio_venta
  }

  cargarTablaPedidosUrgentes() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/mant/inalmacen/catalogo/"
    return this.api.getAll('/inventario/mant/insolurgente_parametros/'+this.userConn+"/"+ this.almacen_codigo)
      .subscribe({
        next: (datav) => {
          this.pedidos_urgentes = datav;
          console.log(this.pedidos_urgentes);

          this.dataSource = new MatTableDataSource(this.pedidos_urgentes);
          this.dataSource.paginator = this.paginator;
          this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getMoneda(){
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET -/seg_adm/mant/admoneda/";
    return this.api.getAll('/seg_adm/mant/admoneda/'+this.userConn)
      .subscribe({
        next: (datav) => {
          this.moneda = datav;
          //console.log( this.moneda);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  getTarifa(){ 
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    
    return this.api.getAll('/inventario/mant/intarifa/catalogo/'+this.userConn+"/"+this.usuario)
      .subscribe({
        next: (datav) => {
          this.tarifa_get = datav;
          console.log(this.tarifa_get);
        },
    
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  createForm(): FormGroup {   
    return this._formBuilder.group({
      codigo:0,
      codalmacen: 311,
      codtarifa:0,
      suarea: [this.dataform.suarea, Validators.compose([Validators.required])],
      monto: [this.dataform.monto],
      codmoneda: [this.dataform.codmoneda],
      peso: [this.dataform.peso,],
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /inventario/mant/insolurgente_parametros/";
    
    return this.api.create("/inventario/mant/insolurgente_parametros/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          this.urgente_save = datav;

          this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
          this.cargarTablaPedidosUrgentes();
          this.spinner.show();

          this.toastr.success('Guardado con Exito! 🎉');
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }
  
  onLeavePrecio(event: any){
    const inputValue = event.target.value;
    let numero = Number(inputValue);
      
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get.some(objeto => objeto.codigo === numero);

    if(!encontrado){
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = numero;
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', numero);
  }

  eliminar(element) {
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:-- /venta/mant/insolurgente_parametros/ Delete";

    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: 'auto',
      height:'auto',
      data:{dataUsuarioEdit:element},
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        return this.api.delete('/inventario/mant/insolurgente_parametros/'+this.userConn+"/"+element.codigo)
        .subscribe({
          next: () => {
            this.log_module.guardarLog(this.ventana, this.detalle, this.tipo);
            
            this.toastr.success('!ELIMINADO EXITOSAMENTE!');
             this.cargarTablaPedidosUrgentes();
          },
          error: (err: any) => { 
            console.log(err, errorMessage);
            this.toastr.error('! NO ELIMINADO !');
          },
          complete: () => { }
        })
      }else{
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
  
  verMonto(value) {
    console.log(value);
    
    if(this.montoInputView == true) {
      this.montoInputView = false;
    } else {
      this.montoInputView = true;
    }
  }

  verPeso(value) {
    console.log(value);
    
    if(this.pesoInputView == true) {
      this.pesoInputView = false;
    } else {
      this.pesoInputView = true;
    }
  }

  close(){
    this.dialogRef.close();
  }
}
