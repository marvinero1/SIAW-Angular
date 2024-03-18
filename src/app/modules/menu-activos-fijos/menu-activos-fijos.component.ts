import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-menu-activos-fijos',
  templateUrl: './menu-activos-fijos.component.html',
  styleUrls: ['./menu-activos-fijos.component.scss']
})
export class MenuActivosFijosComponent implements OnInit {

  constructor(public router:Router,public log_module:LogService) { }
 
  ngOnInit() {
  }

  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
}
