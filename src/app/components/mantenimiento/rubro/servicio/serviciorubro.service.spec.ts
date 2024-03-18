/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiciorubroService } from './serviciorubro.service';

describe('Service: Serviciorubro', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiciorubroService]
    });
  });

  it('should ...', inject([ServiciorubroService], (service: ServiciorubroService) => {
    expect(service).toBeTruthy();
  }));
});
