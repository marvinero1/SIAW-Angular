/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ServicioLineaProductoService } from './servicio-linea-producto.service';

describe('Service: ServicioLineaProducto', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioLineaProductoService]
    });
  });

  it('should ...', inject([ServicioLineaProductoService], (service: ServicioLineaProductoService) => {
    expect(service).toBeTruthy();
  }));
});
