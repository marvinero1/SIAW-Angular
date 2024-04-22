import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-menu-planillas-personal',
  templateUrl: './menu-planillas-personal.component.html',
  styleUrls: ['./menu-planillas-personal.component.scss']
})
export class MenuPlanillasPersonalComponent implements OnInit {

  constructor(public router:Router,public log_module:LogService) { }
 
  ngOnInit() {
  }

  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
}
