import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-cliente-info',
  templateUrl: './modal-cliente-info.component.html',
  styleUrls: ['./modal-cliente-info.component.scss']
})
export class ModalClienteInfoComponent implements OnInit {

  cod_cliente: any;
  info_cliente_completo: any = [];
  casa_matriz: any = [];
  anticipos: any = [];
  tiendas: any = [];
  titulares: any = [];
  envio_cliente: any = [];
  ult_compras: any = [];
  prom_especial: any = [];
  info_cliente_final: any = [];
  info_completo: any = [];
  otra_info_cliente: any = [];

  userConn: any;
  usuario_logueado: any;
  bd_logueado: any = [];

  constructor(public dialogRef: MatDialogRef<ModalClienteInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public codigo_cliente: any, private api: ApiService,
    private spinner: NgxSpinnerService,) {

    this.cod_cliente = codigo_cliente.codigo_cliente;
    this.userConn = localStorage.getItem("user_conn") !== undefined ? JSON.parse(localStorage.getItem("user_conn")) : null;
    this.bd_logueado = localStorage.getItem("bd_logueado") !== undefined ? JSON.parse(localStorage.getItem("bd_logueado")) : null;
    this.usuario_logueado = localStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(localStorage.getItem("usuario_logueado")) : null;

    console.log(this.cod_cliente);
  }

  ngOnInit() {
    this.infoClientesCompleto();
  }

  infoClientesCompleto() {
    let errorMessage = "La Ruta presenta fallos al hacer peticion GET --/inventario/oper/prgcrearinv/catalogointipoinv/"
    return this.api.getAll('/venta/transac/prgveclienteinfo/' + this.userConn + "/" + this.cod_cliente + "/" + this.bd_logueado.bd + "/" + this.usuario_logueado)
      .subscribe({
        next: (datav) => {
          this.info_cliente_completo = datav;
          this.info_completo = this.info_cliente_completo.infoCliente;
          this.casa_matriz = this.info_cliente_completo.creditosCliente;
          this.anticipos = this.info_cliente_completo.antCobCliente;
          this.tiendas = this.info_cliente_completo.tiendasTitulCliente[0].tienda;
          this.titulares = this.info_cliente_completo.tiendasTitulCliente[0].titular;
          this.envio_cliente = this.info_cliente_completo.ulttEnvioCliente;
          this.ult_compras = this.info_cliente_completo.ultiCompCliente;
          this.prom_especial = this.info_cliente_completo.promEspCliente;
          this.info_cliente_final = this.info_cliente_completo.infClienteFinal;
          this.otra_info_cliente = this.info_cliente_completo.otrsCondCliente;

          //proformas

          console.log(this.info_cliente_completo.antCobCliente);
          console.log(this.info_cliente_completo.creditosCliente);
          console.log(this.info_cliente_completo.infClienteFinal);
          console.log(this.info_cliente_completo.infoCliente);
          console.log(this.info_cliente_completo.otrsCondCliente);
          console.log(this.info_cliente_completo.preciosCliente);
          console.log(this.info_cliente_completo.profApnoTransCliente);
          console.log(this.info_cliente_completo.profnoApronoAnuCliente);
          console.log(this.info_cliente_completo.promEspCliente);
          console.log(this.info_cliente_completo.tiendasTitulCliente);
          console.log(this.info_cliente_completo.ultiCompCliente);
          console.log(this.info_cliente_completo.ulttEnvioCliente);
        },

        error: (err: any) => {
          console.log(err, errorMessage);
        },
        complete: () => { }
      })
  }

  close() {
    this.dialogRef.close();
  }
}
