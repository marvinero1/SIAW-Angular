/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormaPagoService } from './forma-pago.service';

describe('Service: FormaPago', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormaPagoService]
    });
  });

  it('should ...', inject([FormaPagoService], (service: FormaPagoService) => {
    expect(service).toBeTruthy();
  }));
});
