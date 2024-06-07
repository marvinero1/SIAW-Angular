import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImpresionProformaEtiquetaItemsService {

  @Output() disparadorDeCodigoProforma: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
