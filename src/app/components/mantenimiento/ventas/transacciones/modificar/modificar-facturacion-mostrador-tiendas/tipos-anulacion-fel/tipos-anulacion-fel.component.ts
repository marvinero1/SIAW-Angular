import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipos-anulacion-fel',
  templateUrl: './tipos-anulacion-fel.component.html',
  styleUrls: ['./tipos-anulacion-fel.component.scss']
})
export class TiposAnulacionFelComponent implements OnInit {

  userConn: any;
  usuarioLogueado: any;
  agencia_logueado: any;
  BD_storage: any;

  constructor(public dialogRef: MatDialogRef<TiposAnulacionFelComponent>, private router: Router,
    private toastr: ToastrService) {

    this.userConn = sessionStorage.getItem("user_conn") !== undefined ? JSON.parse(sessionStorage.getItem("user_conn")) : null;
    this.usuarioLogueado = sessionStorage.getItem("usuario_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("usuario_logueado")) : null;
    this.agencia_logueado = sessionStorage.getItem("agencia_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("agencia_logueado")) : null;
    this.BD_storage = sessionStorage.getItem("bd_logueado") !== undefined ? JSON.parse(sessionStorage.getItem("bd_logueado")) : null;
  }

  ngOnInit() {
  }

  soloFactura(){

  }

  facturaNRDesapruebaProforma(){

  }

  anularTodo(){

  }

  close() {
    this.toastr.info("PROCESO COMPLETADO ✅");
    sessionStorage.removeItem("data_impresion");
    this.dialogRef.close();

    window.location.reload();
  }

}
