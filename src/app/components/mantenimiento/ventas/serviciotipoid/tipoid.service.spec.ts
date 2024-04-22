/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TipoidService } from './tipoid.service';

describe('Service: Tipoid', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoidService]
    });
  });

  it('should ...', inject([TipoidService], (service: TipoidService) => {
    expect(service).toBeTruthy();
  }));
});
