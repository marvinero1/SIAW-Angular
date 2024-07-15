import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogoNotasRemisionService {

  @Output() disparadorDeIDNotaRemision: EventEmitter<any> = new EventEmitter();
  // @Output() disparadorDeIDCotizacion: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
