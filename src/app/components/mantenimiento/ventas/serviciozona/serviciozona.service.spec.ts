/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ServiciozonaService } from './serviciozona.service';

describe('Service: Serviciozona', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiciozonaService]
    });
  });

  it('should ...', inject([ServiciozonaService], (service: ServiciozonaService) => {
    expect(service).toBeTruthy();
  }));
});
