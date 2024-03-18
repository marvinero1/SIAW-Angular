import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {
  
  @Output() disparadorDeProvincias: EventEmitter<any> = new EventEmitter();
  
  constructor() {
    
  }

}
