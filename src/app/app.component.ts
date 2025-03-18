import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SesionExpiradaComponent } from '@pages/errors/sesion-expirada/sesion-expirada.component';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = '';
  count: number = 0;
  counter = 0;
  fecha_actual = new Date();
  hora_actual = new Date();
  IP_api: any = [];

  userConn: any;
  public agencia_storage: any = '';
  public agencia_logueado: any = '';
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(private primengConfig: PrimeNGConfig) {
    this.agencia_storage = sessionStorage.getItem("agencia_logueado") === null ? "" : JSON.parse(sessionStorage.getItem("agencia_logueado"));
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true; // Habilita las animaciones ripple globalmente 
  }
}
