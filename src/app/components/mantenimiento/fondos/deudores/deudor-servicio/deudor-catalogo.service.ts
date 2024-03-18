import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeudorCatalogoService {
  
  @Output() disparadorDeDeudor: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
