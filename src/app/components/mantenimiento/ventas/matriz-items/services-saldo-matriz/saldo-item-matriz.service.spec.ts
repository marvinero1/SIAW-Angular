/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SaldoItemMatrizService } from './saldo-item-matriz.service';

describe('Service: SaldoItemMatriz', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaldoItemMatrizService]
    });
  });

  it('should ...', inject([SaldoItemMatrizService], (service: SaldoItemMatrizService) => {
    expect(service).toBeTruthy();
  }));
});
