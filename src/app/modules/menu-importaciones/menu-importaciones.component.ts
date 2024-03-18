import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-menu-importaciones',
  templateUrl: './menu-importaciones.component.html',
  styleUrls: ['./menu-importaciones.component.scss']
})
export class MenuImportacionesComponent {

  constructor(public router:Router,public log_module:LogService) { }
 
  ngOnInit() {
  }

  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
}
