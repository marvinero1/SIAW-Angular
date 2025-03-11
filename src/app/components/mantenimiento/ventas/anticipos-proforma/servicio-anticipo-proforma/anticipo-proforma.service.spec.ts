/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { AnticipoProformaService } from './anticipo-proforma.service';

describe('Service: AnticipoProforma', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnticipoProformaService]
    });
  });

  it('should ...', inject([AnticipoProformaService], (service: AnticipoProformaService) => {
    expect(service).toBeTruthy();
  }));
});
