import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogoNotasMovimientoService {
 
  @Output() disparadorDeCatalogoNotasMovimiento:EventEmitter<any> = new EventEmitter();
  
 constructor() { }

}
