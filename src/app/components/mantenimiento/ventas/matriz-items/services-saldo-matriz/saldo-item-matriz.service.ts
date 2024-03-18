import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaldoItemMatrizService {
  
  @Output() disparadorDeSaldoAlm1:EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeSaldoAlm2:EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeSaldoAlm3:EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeSaldoAlm4:EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeSaldoAlm5:EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
