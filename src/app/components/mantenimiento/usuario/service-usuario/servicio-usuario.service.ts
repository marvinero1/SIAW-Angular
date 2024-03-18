import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarioService {
  
  @Output() disparadorDeUsuarios:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
