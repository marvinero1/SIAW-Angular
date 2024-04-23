import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalGenerarAutorizacionComponent } from '@components/seguridad/modal-generar-autorizacion/modal-generar-autorizacion.component';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-herramientas',
  templateUrl: './herramientas.component.html',
  styleUrls: ['./herramientas.component.scss']
})
export class HerramientasComponent implements OnInit {

  constructor(public router: Router, public log_module: LogService, public dialog: MatDialog) { }

  ngOnInit() {
  }

  guardarRutaLOG(nombre, ruta) {
    this.log_module.guardarVentana(nombre, ruta);

    switch (ruta) {
      case 'ModalGenerarAutorizacionComponent':
        this.openDialogGenerarAutorizacion();
        break;

      default:
        break;
    }
  }

  openDialogGenerarAutorizacion() {
    this.dialog.open(ModalGenerarAutorizacionComponent, {
      width: 'auto',
      height: 'auto',
    });
  }
}
