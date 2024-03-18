import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonedaServicioService {

  @Output() disparadorDeMonedas:EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
