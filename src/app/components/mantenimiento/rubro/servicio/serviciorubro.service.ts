import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiciorubroService {

  @Output() disparadorDeRubro:EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
