/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CatalogoNotasRemisionService } from './catalogo-notas-remision.service';

describe('Service: CatalogoNotasRemision', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogoNotasRemisionService]
    });
  });

  it('should ...', inject([CatalogoNotasRemisionService], (service: CatalogoNotasRemisionService) => {
    expect(service).toBeTruthy();
  }));
});
