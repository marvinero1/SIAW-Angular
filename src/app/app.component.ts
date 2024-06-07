import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { NavigationEnd } from '@angular/router';
import { SesionExpiradaComponent } from '@pages/errors/sesion-expirada/sesion-expirada.component';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  count: number = 0;
  counter = 0;
  fecha_actual = new Date();
  hora_actual = new Date();
  IP_api: any = [];

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;

  constructor(private bnIdle: BnNgIdleService, public dialog: MatDialog) {
    // this.abrirModalSesionExpirada();
    // console.log(publicIpv4());
  }

  ngOnInit(): void {


    // 900 = 15 minute
    // 600 = 10 minute
    // 60 = 1 minute
    // 30 = 30seg
    // 5 = 5 seg
    // this.bnIdle.startWatching(9000000).subscribe((res) => { //cambiar el valor del starWatching 50
    //   this.counter = this.counter === 60 ? 0 : this.counter + 1; //this.counter es el contador a mayor numero tamanio mas tardara en salir el modal
    //   // console.log(this.counter);
    //   if(res && this.counter == 1){
    //     let hour = this.hora_actual.getHours();
    //     let minuts = this.hora_actual.getMinutes();
    //     console.log('sesion expirada:', this.count, hour+":"+minuts);
    //     this.abrirModalSesionExpirada();
    //   }
    // });    
  }

  ngAfterViewInit() {
    //Si se coloca esto en cada componente q tiene el paginator ya no sale PAGINATION PER PAGE
    //pero tiene q ser de manera global y no componenete por componente
    // this.paginator._intl.itemsPerPageLabel = 'Items por página:';
    // this.paginator._intl.nextPageLabel = 'Siguiente';
    // this.paginator._intl.previousPageLabel = 'Anterior';
  }

  abrirModalSesionExpirada() {
    this.dialog.open(SesionExpiradaComponent, {
      width: '450px',
      height: 'auto',
      disableClose: true
    });
  }
}
