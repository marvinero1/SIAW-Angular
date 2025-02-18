import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogoPedidoService {

  @Output() disparadorDeCatalogoDePedidos: EventEmitter<any> = new EventEmitter();

  constructor() {

  }


}
