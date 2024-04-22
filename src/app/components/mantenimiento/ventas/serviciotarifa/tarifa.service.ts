import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

  @Output() disparadorDeTarifa:EventEmitter<any> = new EventEmitter();

  constructor(){

  }
}
