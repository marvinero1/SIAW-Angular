/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { BuscadorAvanzadoService } from './buscador-avanzado.service';

describe('Service: BuscadorAvanzado', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuscadorAvanzadoService]
    });
  });

  it('should ...', inject([BuscadorAvanzadoService], (service: BuscadorAvanzadoService) => {
    expect(service).toBeTruthy();
  }));
});
