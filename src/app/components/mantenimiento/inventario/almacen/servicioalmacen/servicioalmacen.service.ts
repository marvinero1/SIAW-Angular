import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioalmacenService {

  @Output() disparadorDeAlmacenes: EventEmitter<any> = new EventEmitter();
  
  @Output() disparadorDeAlmacenesOrigen: EventEmitter<any> = new EventEmitter();
  
  @Output() disparadorDeAlmacenesDestino:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
