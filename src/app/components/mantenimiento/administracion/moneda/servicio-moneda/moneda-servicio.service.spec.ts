/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MonedaServicioService } from './moneda-servicio.service';

describe('Service: MonedaServicio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonedaServicioService]
    });
  });

  it('should ...', inject([MonedaServicioService], (service: MonedaServicioService) => {
    expect(service).toBeTruthy();
  }));
});
