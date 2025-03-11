/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { DeudorCatalogoService } from './deudor-catalogo.service';

describe('Service: DeudorCatalogo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeudorCatalogoService]
    });
  });

  it('should ...', inject([DeudorCatalogoService], (service: DeudorCatalogoService) => {
    expect(service).toBeTruthy();
  }));
});
