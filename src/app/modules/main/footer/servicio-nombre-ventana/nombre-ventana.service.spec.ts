/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NombreVentanaService } from './nombre-ventana.service';

describe('Service: NombreVentana', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NombreVentanaService]
    });
  });

  it('should ...', inject([NombreVentanaService], (service: NombreVentanaService) => {
    expect(service).toBeTruthy();
  }));
});
