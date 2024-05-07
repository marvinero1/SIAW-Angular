import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnticipoProformaService {

  @Output() disparadorDeTablaDeAnticipos: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
