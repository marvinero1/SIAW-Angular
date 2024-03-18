import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentoVentaService {
  
  @Output() disparadorDeDocDeVenta: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
