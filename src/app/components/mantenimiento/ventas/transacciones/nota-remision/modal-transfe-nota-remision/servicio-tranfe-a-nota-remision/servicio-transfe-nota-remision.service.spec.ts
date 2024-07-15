/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicioTransfeNotaRemisionService } from './servicio-transfe-nota-remision.service';

describe('Service: ServicioTransfeNotaRemision', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioTransfeNotaRemisionService]
    });
  });

  it('should ...', inject([ServicioTransfeNotaRemisionService], (service: ServicioTransfeNotaRemisionService) => {
    expect(service).toBeTruthy();
  }));
});
