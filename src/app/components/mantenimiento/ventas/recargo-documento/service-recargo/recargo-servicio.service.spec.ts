/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecargoServicioService } from './recargo-servicio.service';

describe('Service: RecargoServicio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecargoServicioService]
    });
  });

  it('should ...', inject([RecargoServicioService], (service: RecargoServicioService) => {
    expect(service).toBeTruthy();
  }));
});
