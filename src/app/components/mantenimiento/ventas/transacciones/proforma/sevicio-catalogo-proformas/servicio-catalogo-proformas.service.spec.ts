/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicioCatalogoProformasService } from './servicio-catalogo-proformas.service';

describe('Service: ServicioCatalogoProformas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioCatalogoProformasService]
    });
  });

  it('should ...', inject([ServicioCatalogoProformasService], (service: ServicioCatalogoProformasService) => {
    expect(service).toBeTruthy();
  }));
});
