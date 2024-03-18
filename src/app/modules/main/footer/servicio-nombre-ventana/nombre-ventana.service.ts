import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NombreVentanaService {

  @Output() disparadorDeNombreVentana:EventEmitter<any> = new EventEmitter();

  constructor(){ 

  }

}
