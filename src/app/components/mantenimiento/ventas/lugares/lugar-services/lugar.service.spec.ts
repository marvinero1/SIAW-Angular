/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { LugarService } from './lugar.service';

describe('Service: Lugar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LugarService]
    });
  });

  it('should ...', inject([LugarService], (service: LugarService) => {
    expect(service).toBeTruthy();
  }));
});
