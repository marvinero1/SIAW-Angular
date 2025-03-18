import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-menu-fondos',
  templateUrl: './menu-fondos.component.html',
  styleUrls: ['./menu-fondos.component.scss']
})
export class MenuFondosComponent implements OnInit {

  constructor(public router:Router, public log_module:LogService) { }
 
  ngOnInit() {
  }

  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
}
