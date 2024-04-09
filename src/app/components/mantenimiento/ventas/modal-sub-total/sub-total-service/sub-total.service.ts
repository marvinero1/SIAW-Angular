import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubTotalService {

  @Output() disparadorDeSubTotal: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
