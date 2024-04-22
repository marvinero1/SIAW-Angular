import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-menu-cuentas-cobrar',
  templateUrl: './menu-cuentas-cobrar.component.html',
  styleUrls: ['./menu-cuentas-cobrar.component.scss']
})
export class MenuCuentasCobrarComponent implements OnInit {

  constructor(public router:Router,public log_module:LogService) { }

  ngOnInit() {
  }
  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
}
