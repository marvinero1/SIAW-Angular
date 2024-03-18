/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PeriodoSistemaService } from './periodo-sistema.service';

describe('Service: PeriodoSistema', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodoSistemaService]
    });
  });

  it('should ...', inject([PeriodoSistemaService], (service: PeriodoSistemaService) => {
    expect(service).toBeTruthy();
  }));
});
