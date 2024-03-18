import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@services/log-service.service';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.scss']
})
export class AyudaComponent implements OnInit {

  constructor(public route:Router, public router:Router, public log_module:LogService) { }

  ngOnInit() {
  }
  guardarRutaLOG(nombre, ruta){
    this.log_module.guardarVentana(nombre,ruta);
    this.router.navigate([ruta]);
  }
  documentationError(){
    this.route.navigateByUrl('sistema/documentacion/errores');
  }
  

}
