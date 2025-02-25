/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CatalogoSolUrgenteService } from './catalogo-sol-urgente.service';

describe('Service: CatalogoSolUrgente', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogoSolUrgenteService]
    });
  });

  it('should ...', inject([CatalogoSolUrgenteService], (service: CatalogoSolUrgenteService) => {
    expect(service).toBeTruthy();
  }));
});
