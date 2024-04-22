import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioidproformaService {

  @Output() disparadorDeIDProformas:EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
