import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LugarService {
  
  @Output() disparadorDeLugares: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
