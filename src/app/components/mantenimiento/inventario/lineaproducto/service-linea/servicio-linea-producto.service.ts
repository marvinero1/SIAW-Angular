import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioLineaProductoService {

  @Output() disparadorDeLineaItem:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
