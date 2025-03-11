/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { CatalogoFacturasService } from './catalogo-facturas.service';

describe('Service: CatalogoFacturas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogoFacturasService]
    });
  });

  it('should ...', inject([CatalogoFacturasService], (service: CatalogoFacturasService) => {
    expect(service).toBeTruthy();
  }));
});
