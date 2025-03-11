/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ServicioUsuarioService } from './servicio-usuario.service';

describe('Service: ServicioUsuario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioUsuarioService]
    });
  });

  it('should ...', inject([ServicioUsuarioService], (service: ServicioUsuarioService) => {
    expect(service).toBeTruthy();
  }));
});
