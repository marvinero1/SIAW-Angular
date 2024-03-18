import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-menu-compras',
  templateUrl: './menu-compras.component.html',
  styleUrls: ['./menu-compras.component.scss']
})
export class MenuComprasComponent implements OnInit {

  constructor(public router:Router,public log_module:LogService) { }
 
  ngOnInit() {
  }

  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
}
