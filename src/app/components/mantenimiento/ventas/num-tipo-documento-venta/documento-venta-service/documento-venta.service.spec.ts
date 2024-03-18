/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DocumentoVentaService } from './documento-venta.service';

describe('Service: DocumentoVenta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentoVentaService]
    });
  });

  it('should ...', inject([DocumentoVentaService], (service: DocumentoVentaService) => {
    expect(service).toBeTruthy();
  }));
});
