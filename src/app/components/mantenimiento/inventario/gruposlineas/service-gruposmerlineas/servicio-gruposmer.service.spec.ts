/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicioGrupoMerService } from './servicio-gruposmer.service';

describe('Service: ServicioGrupoMerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioGrupoMerService]
    });
  });

  it('should ...', inject([ServicioGrupoMerService], (service: ServicioGrupoMerService) => {
    expect(service).toBeTruthy();
  }));
});
