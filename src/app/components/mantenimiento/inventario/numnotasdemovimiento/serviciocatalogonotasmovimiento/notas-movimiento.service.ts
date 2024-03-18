import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotasMovimientoService {

  @Output() disparadorDeNotasMovimiento:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
