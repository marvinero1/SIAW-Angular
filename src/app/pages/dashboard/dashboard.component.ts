import {Component} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '@services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TipocambiovalidacionComponent } from '@components/seguridad/tipocambiovalidacion/tipocambiovalidacion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { NombreVentanaService } from '@modules/main/footer/servicio-nombre-ventana/nombre-ventana.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    
  public usuarios:any; 
  public tipo_cambio$=[];
  public moneda$ =[];
  public tamanio_tipo_cambio:number;
  public tamanio_moneda: any = [];
  
  public ventana = "Dashboard";

  constructor(private api:ApiService, private datePipe: DatePipe, public dialog: MatDialog,
    private spinner: NgxSpinnerService, public nombre_ventana_service:NombreVentanaService) { 
    
    this.mandarNombre();
  }

  ngOnInit(): void{
    
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
  }

  
  mandarNombre(){
    this.nombre_ventana_service.disparadorDeNombreVentana.emit({
      nombre_vent:this.ventana,
    });
  }

}
