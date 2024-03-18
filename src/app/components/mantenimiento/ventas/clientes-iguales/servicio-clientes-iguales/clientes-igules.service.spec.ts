/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientesIgulesService } from './clientes-igules.service';

describe('Service: ClientesIgules', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientesIgulesService]
    });
  });

  it('should ...', inject([ClientesIgulesService], (service: ClientesIgulesService) => {
    expect(service).toBeTruthy();
  }));
});
