import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecargoServicioService {
  
  @Output() disparadorDeRecargoDocumento: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
