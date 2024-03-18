/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PuntoventaService } from './puntoventa.service';

describe('Service: Puntoventa', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PuntoventaService]
    });
  });

  it('should ...', inject([PuntoventaService], (service: PuntoventaService) => {
    expect(service).toBeTruthy();
  }));
});
