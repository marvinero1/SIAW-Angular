import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioprecioventaService {

  @Output() disparadorDePrecioVenta: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDePrecioVentaDetalle: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
