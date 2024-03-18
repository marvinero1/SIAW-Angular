import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioInventarioService {
  
  @Output() disparadorDeInventarios:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
