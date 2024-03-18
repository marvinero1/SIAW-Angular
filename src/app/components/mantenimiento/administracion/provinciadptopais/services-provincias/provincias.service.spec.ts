/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProvinciasService } from './provincias.service';

describe('Service: Provincias', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvinciasService]
    });
  });

  it('should ...', inject([ProvinciasService], (service: ProvinciasService) => {
    expect(service).toBeTruthy();
  }));
});
