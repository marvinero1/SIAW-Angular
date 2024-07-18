import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioTransfeAProformaService {

  @Output() disparadorDeProformaTransferir: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeCotizacionTransferir: EventEmitter<any> = new EventEmitter();

  constructor() {

  }
}
