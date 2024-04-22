import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {

  @Output() disparadorDeDescuentos: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeDescuentosDelModalTotalDescuentos: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeDescuentosDetalle: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

}
