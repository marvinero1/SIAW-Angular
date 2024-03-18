import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioF9Service {

  @Output() disparadorDeItemF9: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
