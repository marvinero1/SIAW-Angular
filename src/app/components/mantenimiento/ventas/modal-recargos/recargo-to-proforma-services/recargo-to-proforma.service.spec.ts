/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { RecargoToProformaService } from './recargo-to-proforma.service';

describe('Service: RecargoToProforma', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecargoToProformaService]
    });
  });

  it('should ...', inject([RecargoToProformaService], (service: RecargoToProformaService) => {
    expect(service).toBeTruthy();
  }));
});
