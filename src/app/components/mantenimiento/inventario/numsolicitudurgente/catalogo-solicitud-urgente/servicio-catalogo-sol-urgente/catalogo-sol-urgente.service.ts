import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogoSolUrgenteService {

  @Output() disparadorDeCatalogoDeSolicitudesUrgentes: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

}
