import { Component, OnInit } from '@angular/core';
import { CuentasCatalogoComponent } from '../cuentas-catalogo/cuentas-catalogo.component';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogService } from '@services/log-service.service';
import { ToastrService } from 'ngx-toastr';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.scss']
})
export class CuentasContablesComponent implements OnInit {

  constructor(private api:ApiService,public dialog: MatDialog, private spinner: NgxSpinnerService,
    public log_module: LogService, private toastr: ToastrService, public nombre_ventana_service: NombreVentanaService) { }

  ngOnInit() {
  }




  
  cuentasContablesModal(){ 
    this.dialog.open(CuentasCatalogoComponent, {
      width: 'auto',
      height:'auto',
    });
  }
}
