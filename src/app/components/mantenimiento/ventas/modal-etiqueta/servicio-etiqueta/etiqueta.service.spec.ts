/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { EtiquetaService } from './etiqueta.service';

describe('Service: Etiqueta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EtiquetaService]
    });
  });

  it('should ...', inject([EtiquetaService], (service: EtiquetaService) => {
    expect(service).toBeTruthy();
  }));
});
