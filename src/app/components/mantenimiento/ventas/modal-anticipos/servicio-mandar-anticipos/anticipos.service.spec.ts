/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { AnticiposService } from './anticipos.service';

describe('Service: Anticipos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnticiposService]
    });
  });

  it('should ...', inject([AnticiposService], (service: AnticiposService) => {
    expect(service).toBeTruthy();
  }));
});
