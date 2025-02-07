import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalPrecioVentaComponent } from '@components/mantenimiento/ventas/modal-precio-venta/modal-precio-venta.component';
import { ServicioprecioventaService } from '@components/mantenimiento/ventas/servicioprecioventa/servicioprecioventa.service';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { VistaPreviaNmComponent } from './vista-previa-nm/vista-previa-nm.component';
@Component({
  selector: 'app-dialog-tarifa-impresion',
  templateUrl: './dialog-tarifa-impresion.component.html',
  styleUrls: ['./dialog-tarifa-impresion.component.scss']
})
export class DialogTarifaImpresionComponent implements OnInit {

  private unsubscribe$ = new Subject<void>();

  codigo_concepto_get:any;
  cod_concepto_descrip_get:any;
  total_get:any;
  codigoNM_get:any;

  cod_precio_venta_modal_codigo:any;

  userConn:any;
  usuarioLogueado:any;
  agencia_logueado:any;
  BD_storage:any;

  constructor(public dialogRef: MatDialogRef<DialogTarifaImpresionComponent>, 
    private api: ApiService, private messageService: MessageService, private dialog: MatDialog, 
    private servicioPrecioVenta: ServicioprecioventaService,
    @Inject(MAT_DIALOG_DATA) public cod_concepto_descrip: any, @Inject(MAT_DIALOG_DATA) public total: any,
    @Inject(MAT_DIALOG_DATA) public codigoNM: any, @Inject(MAT_DIALOG_DATA) public codigo_concepto: any  ) { 

      this.cod_concepto_descrip_get = cod_concepto_descrip.cod_concepto_descrip;
      this.total_get = total.total;
      this.codigoNM_get = codigoNM.codigoNM;
      this.codigo_concepto_get = codigo_concepto.codigo_concepto

      this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
      this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
      this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
      this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  
    }

  ngOnInit(){ }

  async impresion(){
    console.log("🚀 ~ DialogTarifaImpresionComponent ~ impresion ~ this.codigo_concepto_get :", this.codigo_concepto_get )

    // SI EL CONCEPTO ES EL 12 HAY QUE PEDIR EL CODTARIFA Y COLOCARLO EN EL CAMPO DEL ARRAY XDXD
    if(this.codigo_concepto_get === "12"){
      this.impresionAjuste();
      return;
    }

    if(this.codigo_concepto_get != "12"){
      let array_send:any = {
        codEmpresa: this.BD_storage,
        codclientedescripcion: "",
        codtarifa: 0,
        usuario: this.usuarioLogueado,
        codconceptodescripcion: this.cod_concepto_descrip_get,
        total: this.total.total.toString(),
        codigoNM: this.codigoNM_get
      };
      console.log("🚀 ~ DialogTarifaImpresionComponent ~ impresion ~ a:", array_send)

      let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/grabarDocumento/";
      return this.api.create('/inventario/transac/docinmovimiento/impresionNotaMovimiento/'+this.userConn, array_send)
        .pipe(takeUntil(this.unsubscribe$)).subscribe({
          next: (datav) => {
            console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ imprimirNM:", datav);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp+'🖨️' });
          },

          error: (err: any) => {
            console.log(err, errorMessage);
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'OCURRIO UN ERROR 🖨️' });

          },
          complete: () => {
            setTimeout(() => {
              window.location.reload();
            }, 3111);
            }
        });
    }
  }  

  impresionAjuste(){
    this.modalPrecioVenta();
    // precio_venta
    this.servicioPrecioVenta.disparadorDePrecioVenta.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log("Recibiendo Precio de Venta: ", data);
      //this.cod_precio_venta_modal = data.precio_venta;
      this.cod_precio_venta_modal_codigo = data.precio_venta.codigo;

      if(this.cod_precio_venta_modal_codigo != 0){
        let array_send:any = {
          codEmpresa: this.BD_storage ,
          codclientedescripcion: "",
          codtarifa: this.cod_precio_venta_modal_codigo,
          usuario: this.usuarioLogueado,
          codconceptodescripcion: this.cod_concepto_descrip_get,
          total: this.total.total.toString(),
          codigoNM: this.codigoNM_get
        };
        console.log("🚀 ~ DialogTarifaImpresionComponent ~ impresion ~ a:", array_send)
    
        let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/inventario/transac/docinmovimiento/grabarDocumento/";
        return this.api.create('/inventario/transac/docinmovimiento/impresionNotaMovimiento/'+this.userConn, array_send)
          .pipe(takeUntil(this.unsubscribe$)).subscribe({
            next: (datav) => {
            console.log("🚀 ~ NotamovimientoComponent ~ .pipe ~ imprimirNM:", datav);
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: 'IMPRIMIENDO 🖨️' });
            this.messageService.add({ severity: 'success', summary: 'Accion Completada', detail: datav.resp+'🖨️' });
            },
    
            error: (err: any) => {
              console.log(err, errorMessage);
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'OCURRIO UN ERROR 🖨️' });
            },
            complete: () => {
              setTimeout(() => {
                window.location.reload();
              }, 3111);
              
            }
          })
      }else{
        console.warn("ESCOJA TARIFA NO SEA GIL")
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'ESCOJA TARIFA NO SEA GIL' });
      }
    });
    // fin_precio_venta
  }

  vistaPrevia(){
    this.dialog.open(VistaPreviaNmComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { 
        codigoNM: this.codigoNM_get,
        codtarifa: this.cod_precio_venta_modal_codigo,
      }
    });
  }

  modalPrecioVenta(): void {
    this.dialog.open(ModalPrecioVentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: { detalle: false }
    });
  }

  close(){
    this.dialogRef.close();
  }
}
