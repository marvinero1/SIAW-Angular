import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoidService {
  
  @Output() disparadorDeIDTipo:EventEmitter<any> = new EventEmitter();

  constructor() { 
  }

}
