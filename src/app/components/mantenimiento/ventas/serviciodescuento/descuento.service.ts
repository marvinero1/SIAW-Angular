import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {

  @Output() disparadorDeDescuentos:EventEmitter<any> = new EventEmitter();

  constructor() { 
    
  }

}
