/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CatalogoNotasMovimientoService } from './catalogo-notas-movimiento.service';

describe('Service: CatalogoNotasMovimiento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogoNotasMovimientoService]
    });
  });

  it('should ...', inject([CatalogoNotasMovimientoService], (service: CatalogoNotasMovimientoService) => {
    expect(service).toBeTruthy();
  }));
});
