/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { NotasMovimientoService } from './notas-movimiento.service';

describe('Service: NotasMovimiento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotasMovimientoService]
    });
  });

  it('should ...', inject([NotasMovimientoService], (service: NotasMovimientoService) => {
    expect(service).toBeTruthy();
  }));
});
