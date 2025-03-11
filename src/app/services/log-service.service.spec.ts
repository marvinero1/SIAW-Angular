/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { LogService } from './log-service.service';

describe('Service: LogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogService]
    });
  });

  it('should ...', inject([LogService], (service: LogService) => {
    expect(service).toBeTruthy();
  }));
});
