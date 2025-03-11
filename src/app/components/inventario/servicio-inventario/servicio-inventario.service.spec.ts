/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ServicioInventarioService } from './servicio-inventario.service';

describe('Service: ServicioInventario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioInventarioService]
    });
  });

  it('should ...', inject([ServicioInventarioService], (service: ServicioInventarioService) => {
    expect(service).toBeTruthy();
  }));
});
