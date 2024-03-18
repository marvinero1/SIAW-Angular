import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovimientomercaderiaService {

  @Output() disparadorDeConceptos:EventEmitter<any> = new EventEmitter();
    
  constructor() { }

}
