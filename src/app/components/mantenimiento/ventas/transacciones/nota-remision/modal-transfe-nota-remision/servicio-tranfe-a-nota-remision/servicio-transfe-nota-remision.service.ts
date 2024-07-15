import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioTransfeNotaRemisionService {

  @Output() disparadorDeProformaTransferir: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
