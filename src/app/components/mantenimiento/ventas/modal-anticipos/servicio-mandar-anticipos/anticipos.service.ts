import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnticiposService {
  
  @Output() disparadorDeCatalagoAnticipo:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
