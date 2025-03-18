import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormaPagoService } from './services-forma-pago/forma-pago.service';

@Component({
  selector: 'app-modal-forma-pago',
  templateUrl: './modal-forma-pago.component.html',
  styleUrls: ['./modal-forma-pago.component.scss']
})

export class ModalFormaPagoComponent implements OnInit{

  catalogo_fn_cuentas:any=[];
  selectedfn_cuenta:any;

  catalogo_cotippago:any=[];
  selected_cotippago:any;

  catalogo_cuentas_bancos:any=[];
  selected_cuentas_bancos:any;

  catalogo_cuentas_bancos_cheques:any=[];
  selected_cuentas_bancos_cheques:any;

  numero_cheque:any;

  array_default:any=[];

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  tipo_pago_nota_remision:any;

  constructor(public dialog: MatDialog, private api: ApiService, public dialogRef: MatDialogRef<ModalFormaPagoComponent>,
    private toastr: ToastrService,private formaPagoService:FormaPagoService,
    @Inject(MAT_DIALOG_DATA) public tipo_pago: any) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
      
    this.tipo_pago_nota_remision = tipo_pago?.tipo_pago;
    console.log("🚀 ~ ModalFormaPagoComponent ~ tipo_pago_nota_remision:", this.tipo_pago_nota_remision)
  }

  ngOnInit() {
    
    this.getCatalogoTipoPago();
    this.getCatalogoFncuentas();
    this.getValorDefaultArray();

    // valor por defecto del array
    // this.getCatalogoBancosCheques();
  }

  getCatalogoFncuentas() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/fondos/mant/fncuenta/catalogo/";
    return this.api.getAll('/fondos/mant/fncuenta/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          this.catalogo_fn_cuentas = datav;
          this.catalogo_fn_cuentas = this.catalogo_fn_cuentas?.map((item: any) => {
            return {
              ...item,
              label: `${item.id} - ${item.descripcion}` // Combinación de id y descripción
            };
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getValorDefaultArray() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/transac/prgfacturarNR_cufd/getDataDefectPedirTipoPago/";

    if(this.tipo_pago_nota_remision === 0){
      return this.api.getAll('/venta/transac/prgfacturarNR_cufd/getDataDefectPedirTipoPago/' + this.userConn +"/"+ this.BD_storage +"/"+ this.usuarioLogueado)
      .subscribe({
        next: (datav) => {
          console.log(datav);
          let b;
          this.catalogo_cuentas_bancos = datav.codcuentab;
          this.selected_cuentas_bancos_cheques = datav.codbanco;

          // Buscar el objeto que coincida con el código de tipo de pago
          this.selected_cotippago = this.catalogo_cotippago.find(item => item.codigo === datav.codtipopago);
          
          // Asignar cuenta
          this.selectedfn_cuenta = this.catalogo_fn_cuentas.find(item => item.id === datav.idcuenta);
          this.numero_cheque = datav.nrocheque;

          b = {
            codbanco: this.selected_cuentas_bancos_cheques,
            codcuentab: this.catalogo_cuentas_bancos,
            codtipopago: this.selected_cotippago,
            idcuenta: this.selectedfn_cuenta,
            nrocheque:  this.numero_cheque,
          }

          console.table(b);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {}
      })
    }else{
      this.selected_cuentas_bancos_cheques = "";
      this.catalogo_cuentas_bancos = "";
      this.selected_cotippago = "1";
      this.selectedfn_cuenta ="";
      this.numero_cheque="";
    };     
    
  }

  getCatalogoTipoPago() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/ctsxcob/mant/cotippago/catalogo/";
    return this.api.getAll('/ctsxcob/mant/cotippago/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          this.catalogo_cotippago = datav;
          this.catalogo_cotippago = this.catalogo_cotippago?.map((item: any) => {
            return {
              ...item,
              label: `${item.codigo} - ${item.descripcion}` // Combinación de id y descripción
            };
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getCatalogoCuentas() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/ctsxcob/mant/cocuentab/catalogo/";
    return this.api.getAll('/ctsxcob/mant/cocuentab/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          this.catalogo_cuentas_bancos = datav;
          this.catalogo_cuentas_bancos = this.catalogo_cuentas_bancos?.map((item: any) => {
            return {
              ...item,
              label: `${item.codigo} - ${item.descripcion}` // Combinación de id y descripción
            };
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  getCatalogoBancosCheques() {
    let errorMessage: string = "La Ruta o el servidor presenta fallos al hacer peticion GET -/ctsxcob/mant/cobanco/catalogo/";
    return this.api.getAll('/ctsxcob/mant/cobanco/catalogo/' + this.userConn)
      .subscribe({
        next: (datav) => {
          // console.log(datav);
          this.catalogo_cuentas_bancos_cheques = datav;
          this.catalogo_cuentas_bancos_cheques = this.catalogo_cuentas_bancos_cheques?.map((item: any) => {
            return {
              ...item,
              label: `${item.codigo} - ${item.descripcion}` // Combinación de id y descripción
            };
          });
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => {
        }
      })
  }

  enviarData(){
    let array=[{
      IngresoEfectivo:this.selectedfn_cuenta.id,
      TipoPago:this.selected_cotippago.codigo,
      NrodeCuenta:this.selected_cuentas_bancos?.codigo === undefined ? " ": this.selected_cuentas_bancos?.codigo,
      BancoCheque:this.selected_cuentas_bancos_cheques?.codigo === undefined ? " ": this.selected_cuentas_bancos_cheques?.codigo,
      NumCheque:this.numero_cheque === undefined ? "0": this.numero_cheque,
    }];

    console.log(array);

    this.formaPagoService.disparadorDeInfoFormaPago.emit(array);
    this.toastr.info("ENVIO CORRECTO");
    this.close();
  }

  close(){
    this.dialogRef.close();
  }
}
