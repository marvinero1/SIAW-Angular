import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioCierreService {
  
  @Output() disparadorDeBooleanCierreModalAnulacion: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
