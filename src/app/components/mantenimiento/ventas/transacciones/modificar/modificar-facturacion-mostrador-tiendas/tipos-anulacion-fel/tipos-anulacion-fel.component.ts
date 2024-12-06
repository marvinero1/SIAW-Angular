import { Component, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { PermisosEspecialesParametrosComponent } from '@components/seguridad/permisos-especiales-parametros/permisos-especiales-parametros.component';
import { DialogConfirmActualizarComponent } from '@modules/dialog-confirm-actualizar/dialog-confirm-actualizar.component';
import { DialogConfirmacionComponent } from '@modules/dialog-confirmacion/dialog-confirmacion.component';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tipos-anulacion-fel',
  templateUrl: './tipos-anulacion-fel.component.html',
  styleUrls: ['./tipos-anulacion-fel.component.scss']
})
export class TiposAnulacionFelComponent implements OnInit {

  readonly panelOpenState = signal(false);
  @ViewChild('myAcordion') panel!: MatExpansionPanel;

  array_motivos_SIN:any=[]

  codigo_factura_get:any;
  codigo_cliente:any;
  razon_social_cliente:any;

  tipo_motivo:any;
  anular_refacturar:boolean = false;
  es_tienda_get:boolean;

  motivo_sia:any;
  motivo_sin:any;
  
  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;


  constructor(public dialogRef: MatDialogRef<TiposAnulacionFelComponent>, private router: Router,
    private toastr: ToastrService, private api: ApiService, 
    private spinner: NgxSpinnerService, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public codigo_factura: any,
    @Inject(MAT_DIALOG_DATA) public datoA: any, @Inject(MAT_DIALOG_DATA) public datoB: any, @Inject(MAT_DIALOG_DATA) public es_tienda: any

    

  ) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;


    this.codigo_factura_get = codigo_factura.codigo_factura;
    this.codigo_cliente = datoA.datoA;
    this.razon_social_cliente = datoB.datoB;
    this.es_tienda_get = es_tienda.es_tienda
  }

  ngOnInit() {
    this.getSelectMotivoSIN();
  }

  obtenerValorMotivo(value){
    this.tipo_motivo = value;
    this.panel.open();
    console.log("🚀 ~ TiposAnulacionFelComponent ~ obtenerValorMotivo ~ this.valor_motivo:", this.tipo_motivo)
  }


  getSelectMotivoSIN(){
    const url = `/venta/modif/docmodifvefactura_nsf/cargarMotivosAnulaSIN/${this.userConn}`;
    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.getAll(url).subscribe({
      next: (datav) => {
        console.log("🚀 ~ TiposAnulacionFelComponent ~ this.api.getAll ~ datav:", datav)
        this.array_motivos_SIN = datav;
        
        setTimeout(() => {
        this.spinner.hide();
      }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }

  sin_validar_anulacion:boolean = false;
  sin_validar_inventario:boolean = false;

  anularFactura(sin_validar_anulacion_params, sin_validar_inventario_params){
    let array = [{
      motivo_SIA: this.motivo_sia,
      codMotivo_SIN_Datos: this.motivo_sin.codigoclasificador,
      descmotivo_SIN_Datos: this.motivo_sin.descripcion,
      refacturar: this.anular_refacturar
    }];

    const url = `/venta/modif/docmodifvefactura_nsf/Anular_Factura/${this.userConn}/${this.usuarioLogueado}/${this.codigo_factura_get}/${this.BD_storage}/${sin_validar_anulacion_params}/${sin_validar_inventario_params}/${this.tipo_motivo}`;
    //console.log(this.motivo_sia)
    console.log(url, array);

    const errorMessage = `La Ruta presenta fallos al hacer la creación Ruta:- ${url}`;

    this.api.create(url, array).subscribe({
      next: async (datav) => {
        console.log("🚀 ~ ModificarFacturacionMostradorTiendasComponent ~ this.api.getAll ~ datav:", datav);

        const result = await this.openConfirmationOKDialog(datav.eventos[0]);

        if (result){
          // 83 permiso_especial
          // 84 
          // 48 inventario
          if(datav.resp === false && datav.codigo_control === 83){
            const dialogRefParams = await this.dialog.open(PermisosEspecialesParametrosComponent, {
              width: '450px',
              height: 'auto',
              disableClose: true,
              data: {
                dataA: this.codigo_cliente,
                dataB: this.razon_social_cliente,
                dataPermiso: "",
                dataCodigoPermiso: datav.codigo_control.toString(),
                //abrir: true,
              },
            });
      
            dialogRefParams.afterClosed().subscribe(async (result: Boolean) => {
              console.log(result);
              if (result) {
                this.anularFactura(true, false)
              }
            });
          }

          if(datav.resp === false && datav.codigo_control === 48){
            const dialogRefParams = await this.dialog.open(PermisosEspecialesParametrosComponent, {
              width: '450px',
              height: 'auto',
              disableClose: true,
              data: {
                dataA: this.codigo_cliente,
                dataB: this.razon_social_cliente,
                dataPermiso: "",
                dataCodigoPermiso: datav.codigo_control.toString(),
                //abrir: true,
              },
            });
      
            dialogRefParams.afterClosed().subscribe(async (result: Boolean) => {
              console.log(result);
              if (result) {
                this.anularFactura(true, true)
              }
            });
          }

        }

        
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      error: (err) => {
        console.log(err, errorMessage);
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      },

      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 50);
      }
    });
  }

  // modal con los botones SI / NO 
  openConfirmationOKDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      width: '450px',
      height: 'auto',
      data: { mensaje_dialog: message },
      disableClose: true,
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  close() {
    this.dialogRef.close();

    // window.location.reload();
  }

}
