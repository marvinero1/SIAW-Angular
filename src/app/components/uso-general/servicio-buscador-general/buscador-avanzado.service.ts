import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuscadorAvanzadoService {

  @Output() disparadorDeID_NumeroIDNotaRemision: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeID_NumeroIDModificarProforma: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeID_NumeroIDModificarFacturaMostradorTiendas: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeID_NumeroIDNotasMovimiento: EventEmitter<any> = new EventEmitter();


  //ANTICIPOS
  @Output() disparadorDeAnticipoSeleccionado: EventEmitter<any> = new EventEmitter();

  //PEDIDOS
  @Output() disparadorDePedidoSeleccionado: EventEmitter<any> = new EventEmitter();


  constructor() { }

}
