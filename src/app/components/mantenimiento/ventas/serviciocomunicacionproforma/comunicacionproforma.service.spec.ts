/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ComunicacionproformaService } from './comunicacionproforma.service';

describe('Service: Comunicacionproforma', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComunicacionproformaService]
    });
  });

  it('should ...', inject([ComunicacionproformaService], (service: ComunicacionproformaService) => {
    expect(service).toBeTruthy();
  }));
});
