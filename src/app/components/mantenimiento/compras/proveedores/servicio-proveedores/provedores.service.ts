import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProvedoresService {

  @Output() disparadorDeProvedor: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
