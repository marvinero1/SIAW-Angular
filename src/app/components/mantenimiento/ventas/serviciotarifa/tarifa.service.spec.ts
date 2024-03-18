/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TarifaService } from './tarifa.service';

describe('Service: Tarifa', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TarifaService]
    });
  });

  it('should ...', inject([TarifaService], (service: TarifaService) => {
    expect(service).toBeTruthy();
  }));
});
