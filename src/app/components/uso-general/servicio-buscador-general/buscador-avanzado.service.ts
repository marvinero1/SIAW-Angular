import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuscadorAvanzadoService {

  @Output() disparadorDeID_NumeroID: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
