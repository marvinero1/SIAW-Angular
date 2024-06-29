import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  @Output() disparadorDeVendedores: EventEmitter<any> = new EventEmitter();

  @Output() disparadorDeVendedoresBuscadorGeneral: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

}
