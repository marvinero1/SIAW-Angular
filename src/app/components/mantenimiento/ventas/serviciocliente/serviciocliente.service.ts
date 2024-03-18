import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioclienteService {

  @Output() disparadorDeClientes: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeDireccionesClientes: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeClienteReal: EventEmitter<any> = new EventEmitter();


  constructor() {

  }
}
