import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemServiceService {

  @Output() disparadorDeItems: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeItemsCatalogo: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeItemsSeleccionados: EventEmitter<any[]> = new EventEmitter();
  @Output() disparadorDeItemsSeleccionadosSinProcesar: EventEmitter<any[]> = new EventEmitter();
  @Output() disparadorDeItemsSeleccionadosProcesadosdelSubTotal: EventEmitter<any[]> = new EventEmitter();

  constructor() {

  }

  enviarItems(items: any[]) {
    this.disparadorDeItemsSeleccionados.emit(items);
  }
  enviarItemsSinProcesar(items: any[]) {
    this.disparadorDeItemsSeleccionadosSinProcesar.emit(items);
  }
  enviarItemsSinProcesarCatalogo(items: any[]) {
    this.disparadorDeItemsCatalogo.emit(items);
  }

  enviarItemsProcesadosSubTotal(items: any[]) {
    this.disparadorDeItemsSeleccionadosProcesadosdelSubTotal.emit(items);
  }
}
