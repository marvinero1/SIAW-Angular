import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeriodoSistemaService {
  
  @Output() disparadorDeBooleanoPeriodoSistema: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
