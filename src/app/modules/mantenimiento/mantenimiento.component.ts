import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.scss']
})
export class MantenimientoComponent implements OnInit {

  constructor(public router:Router,public log_module:LogService) { }
 
  ngOnInit() {

  }

  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }

 toggleMenu(menuTrigger: MatMenuTrigger) {
    if (menuTrigger.menuOpen) {
      menuTrigger.closeMenu();
    } else {
      menuTrigger.openMenu();
    }
  }

}
