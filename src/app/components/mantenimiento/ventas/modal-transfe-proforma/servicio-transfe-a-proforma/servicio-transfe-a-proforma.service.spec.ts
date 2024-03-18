/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicioTransfeAProformaService } from './servicio-transfe-a-proforma.service';

describe('Service: ServicioTransfeAProforma', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioTransfeAProformaService]
    });
  });

  it('should ...', inject([ServicioTransfeAProformaService], (service: ServicioTransfeAProformaService) => {
    expect(service).toBeTruthy();
  }));
});
