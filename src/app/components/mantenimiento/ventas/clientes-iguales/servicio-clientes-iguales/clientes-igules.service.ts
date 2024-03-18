import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientesIgulesService {
  
  @Output() disparadorDeClienteA: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeClienteB:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
