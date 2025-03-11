/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { DescuentoService } from './descuento.service';

describe('Service: Descuento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescuentoService]
    });
  });

  it('should ...', inject([DescuentoService], (service: DescuentoService) => {
    expect(service).toBeTruthy();
  }));
});
