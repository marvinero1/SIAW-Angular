/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicioclienteService } from './serviciocliente.service';

describe('Service: Serviciocliente', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioclienteService]
    });
  });

  it('should ...', inject([ServicioclienteService], (service: ServicioclienteService) => {
    expect(service).toBeTruthy();
  }));
});
