import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {
  
  @Output() disparadorDeInfoFormaPago:EventEmitter<any[]> = new EventEmitter();
  
constructor() { }

}
