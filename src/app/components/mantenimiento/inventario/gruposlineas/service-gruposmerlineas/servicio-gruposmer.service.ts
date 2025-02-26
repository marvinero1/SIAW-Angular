import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioGrupoMerService {

  @Output() disparadorDeGrupoMer:EventEmitter<any> = new EventEmitter();

  constructor() { }

}
