/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { MovimientomercaderiaService } from './movimientomercaderia.service';

describe('Service: Movimientomercaderia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovimientomercaderiaService]
    });
  });

  it('should ...', inject([MovimientomercaderiaService], (service: MovimientomercaderiaService) => {
    expect(service).toBeTruthy();
  }));
});
