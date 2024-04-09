/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SubTotalService } from './sub-total.service';

describe('Service: SubTotal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubTotalService]
    });
  });

  it('should ...', inject([SubTotalService], (service: SubTotalService) => {
    expect(service).toBeTruthy();
  }));
});
