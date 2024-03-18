import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-ventanas',
  templateUrl: './ventanas.component.html',
  styleUrls: ['./ventanas.component.scss']
})
export class VentanasComponent implements OnInit {
  arrays: any = [];

  constructor(private api:ApiService) { }

  ngOnInit() {
    this.getVentanasAbiertas();
  }

  getVentanasAbiertas() {
    this.arrays = this.api.ventana_estado;

    console.log( this.arrays);
    
  }
}
