import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-menu-ventas',
  templateUrl: './menu-ventas.component.html',
  styleUrls: ['./menu-ventas.component.scss']
})
export class MenuVentasComponent implements OnInit {

  constructor(public router:Router,public log_module:LogService) { }

  ngOnInit() {
  }

  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
}
 