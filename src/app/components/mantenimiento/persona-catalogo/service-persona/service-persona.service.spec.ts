/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicePersonaService } from './service-persona.service';

describe('Service: ServicePersona', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicePersonaService]
    });
  });

  it('should ...', inject([ServicePersonaService], (service: ServicePersonaService) => {
    expect(service).toBeTruthy();
  }));
});
