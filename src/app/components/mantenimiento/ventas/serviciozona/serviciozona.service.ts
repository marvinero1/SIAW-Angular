import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiciozonaService {

  @Output() disparadorDeZonas:EventEmitter<any> = new EventEmitter();

  constructor() {  }

}
