import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecargoToProformaService {

  @Output() disparadorDeRecargo_a_Proforma: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

}
