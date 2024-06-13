import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ComunicacionproformaService {

  private Desct23ComunicacionEtiquetaAProforma = new Subject<void>();

  triggerFunction$ = this.Desct23ComunicacionEtiquetaAProforma.asObservable();

  constructor() {
  }

  aplicarDesct23ComunicacionEtiquetaAProforma() {
    this.Desct23ComunicacionEtiquetaAProforma.next();
  }

}
