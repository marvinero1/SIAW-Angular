/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicioalmacenService } from './servicioalmacen.service';

describe('Service: Servicioalmacen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioalmacenService]
    });
  });

  it('should ...', inject([ServicioalmacenService], (service: ServicioalmacenService) => {
    expect(service).toBeTruthy();
  }));
});
