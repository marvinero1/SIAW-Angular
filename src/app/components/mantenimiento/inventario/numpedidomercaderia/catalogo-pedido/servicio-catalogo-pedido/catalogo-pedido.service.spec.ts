/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CatalogoPedidoService } from './catalogo-pedido.service';

describe('Service: CatalogoPedido', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogoPedidoService]
    });
  });

  it('should ...', inject([CatalogoPedidoService], (service: CatalogoPedidoService) => {
    expect(service).toBeTruthy();
  }));
});
