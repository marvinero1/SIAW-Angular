import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogoFacturasService {

  @Output() disparadorDeIDFacturas: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
