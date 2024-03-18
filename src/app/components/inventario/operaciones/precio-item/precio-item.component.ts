import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidarPrecioItemComponent } from './validar-precio-item/validar-precio-item.component';
import { ValidarPermisoItemComponent } from './validar-permiso-item/validar-permiso-item.component';
import { PermisoEspecialPasswordComponent } from '@components/seguridad/permiso-especial-password/permiso-especial-password.component';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';
import { ItemServiceService } from '@components/mantenimiento/ventas/serviciosItem/item-service.service';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ModalItemsComponent } from '@components/mantenimiento/ventas/modal-items/modal-items.component';
@Component({
  selector: 'app-precio-item',
  templateUrl: './precio-item.component.html',
  styleUrls: ['./precio-item.component.scss']
})
export class PrecioItemComponent implements OnInit {

  FormularioData:FormGroup;
  fecha_actual = new Date();
  hora_actual = new Date();
  dataform:any='';
  userConn: any;
  usuarioLogueado: any;

  tarifa_save: any = [];
  tarifa_get: any = []
  codigo_item_catalogo:any=[];
  cod_precio_venta_modal:any=[];
  codigo_item_catalogo_get: any = [];
  precio_actual: any = [];
  
  public item=[]; 
  public data = [];
  
  displayedColumns = ['codigo','descripcion','descripcorta','descripabr','medida','unidad','accion'];

  dataSource = new MatTableDataSource();
  dataSourceWithPageSize = new MatTableDataSource();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
  
  public nombre_ventana: string = "prgindefinir_precioitem.vb"; 
  public ventana="Definir Precio Item"
  public detalle="PrecioItem-UPDATE";
  public tipo = "PrecioItem-UPDATE";
  
  constructor(private api:ApiService, public dialog: MatDialog, private spinner: NgxSpinnerService, private toastr: ToastrService,
    public log_module: LogService, private _formBuilder: FormBuilder,public itemservice:ItemServiceService, 
    public servicioPrecioVenta: ServicioprecioventaService, public nombre_ventana_service: NombreVentanaService) {
    
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;
    
    this.FormularioData = this.createForm();
    this.mandarNombre();
    this.api.getRolUserParaVentana(this.usuarioLogueado, this.nombre_ventana);
  }

  ngOnInit(){
    this.getAllitem();
    this.getTarifa();
    
    this.servicioPrecioVenta.disparadorDePrecioVenta.subscribe(data => {
      console.log("Recibiendo Precio Venta: ", data);
      this.cod_precio_venta_modal = data.precio_venta;
    });

    this.itemservice.disparadorDeItems.subscribe(data =>{
      console.log("Recibiendo Item: " , data);
      this.codigo_item_catalogo = data.item;
    });
  }

  getAllitem(){
    let user_conn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/initem/catalogo/'+user_conn)
      .subscribe({
        next: (datav) => {
          this.item = datav;
          // console.log(this.item);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveItem(event: any){
    const inputValue = event.target.value;
      
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.item.some(objeto => objeto.codigo === inputValue);

    if(!encontrado){
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = inputValue;
    }

    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', inputValue);
  }

  getTarifa(){ 
    let errorMessage:string = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    return this.api.getAll('/inventario/mant/intarifa/catalogo/'+this.userConn+"/"+this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          this.tarifa_get = datav;
          // console.log(this.tarifa_get);
        },
        error: (err: any) => { 
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  onLeaveTarifa(event: any){
    const inputValue = event.target.value;
    let num = Number(inputValue);
    // Verificar si el valor ingresado está presente en los objetos del array
    const encontrado = this.tarifa_get.some(objeto => objeto.codigo === num);

    if(!encontrado){
      // Si el valor no está en el array, dejar el campo vacío
      event.target.value = '';
      console.log("NO ENCONTRADO INPUT");
    } else {
      event.target.value = num;
    }
    // Puedes realizar otras acciones según tus necesidades
    console.log('Input perdió el foco', num);
  }

  getPrecio(){
    let data = this.FormularioData.value;
    let errorMessage = "La Ruta o el servidor presenta fallos al hacer peticion GET";
    let item_form = data.item; 
    let codtarifa_form = data.codtarifa;

    if (item_form !== undefined && codtarifa_form !== undefined) {
      return this.api.getAll('/inventario/oper/prgindefinir_precioitem/getTarifaItem/'+this.userConn+"/"+this.codigo_item_catalogo.codigo+"/"+this.cod_precio_venta_modal.codigo)
        .subscribe({
          next: (datav) => {
            this.precio_actual = datav;
            console.log(this.precio_actual);
            
            
            this.spinner.show();
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          },
                  
          error: (err: any) => { 
            console.log(err, errorMessage);
          },
          complete: () => { }
        })
    } else {
        this.toastr.warning('INGRESE TODOS LOS CAMPOS');
      }
  }

  createForm(): FormGroup{ 
    return this._formBuilder.group({
      codtarifa: [this.dataform.codtarifa, Validators.compose([Validators.required])],
      item: [this.dataform.item, Validators.compose([Validators.required])],
      precio: [this.dataform.precio, Validators.compose([Validators.required])],
    });
  }

  validarPrecioConfirmacion() { 
    let data = this.FormularioData.value;

    const dialogRef = this.dialog.open(ValidarPrecioItemComponent, {
      width: 'auto',
      height: 'auto',
      data:{dataItem:data}
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if (result){
        console.log("Validar Confirmado");

        if (result) {
          this.validarPrecioItemPassword(data);
        } else {
          this.toastr.error('! NO SE CONFIRMADO !');
        }
      }else{
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  validarPrecioItemPassword(data) { 
      const dialogRef = this.dialog.open(ValidarPermisoItemComponent, {
      width: 'auto',
      height:'auto',
      data:{data:data}
    });

    dialogRef.afterClosed().subscribe((result: Boolean)=>{
      if(result) {
        this.modalPassword(data);
      }else{
        this.toastr.error('! CANCELADO !');
      }
    });
  }

  modalPassword(data): void {
    let precio = this.precio_actual.precio
    console.log(precio);
    
    const dialogRefModalPasswordConfirm = this.dialog.open(PermisoEspecialPasswordComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        dataA: precio, //dato A
        dataB: data.precio, //dato B 
        permiso_id: "106", //esto es fijo siempre
        permiso_text:"CAMBIAR PRECIO DE ITEM", //esto es fijo siempre
      }
    });

    dialogRefModalPasswordConfirm.afterClosed().subscribe((result: any) => {
      console.log(result);
      if(result) {
        this.submitData();
      }else{
        this.toastr.error('! CANCELADO NO SE GUARDO !');
      }
    });
  }

  submitData(){
    let data = this.FormularioData.value;
    console.log(data);
    
    let errorMessage = "La Ruta presenta fallos al hacer la creacion"+"Ruta:- /inventario/oper/prgindefinir_precioitem/updateTarifa1/";    
    return this.api.update("/inventario/oper/prgindefinir_precioitem/updateTarifa1/"+this.userConn, data)
      .subscribe({
        next: (datav) => {
          if(data){
            this.tarifa_save = datav;
            this.getPrecio();
            this.log_module.guardarLog(this.ventana,this.detalle, this.tipo);
            this.toastr.success('Guardado con Exito! 🎉');
          } else {
            this.toastr.error('! ERROR AL GUARDAR !');
          }
        },
    
        error: (err) => { 
          console.log(err, errorMessage);
          this.toastr.error('! NO SE GUARDO !');
        },
        complete: () => { }
      })
  }

  modalPrecioTipo(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
    });
  }

  modalItem(): void {
    this.dialog.open(ModalItemsComponent, {
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
