import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuntoventaService {
  
  @Output() disparadorDePuntosVenta: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
