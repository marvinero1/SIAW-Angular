/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicioF9Service } from './servicio-f9.service';

describe('Service: ServicioF9', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioF9Service]
    });
  });

  it('should ...', inject([ServicioF9Service], (service: ServicioF9Service) => {
    expect(service).toBeTruthy();
  }));
});
