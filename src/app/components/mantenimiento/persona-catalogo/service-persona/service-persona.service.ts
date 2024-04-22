import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicePersonaService {

  @Output() disparadorDePersonas:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
