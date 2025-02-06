import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExceltoexcelService {

  @Output() disparadorDeNotaMovimiento:EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeProforma:EventEmitter<any> = new EventEmitter();

  constructor() { }
}
