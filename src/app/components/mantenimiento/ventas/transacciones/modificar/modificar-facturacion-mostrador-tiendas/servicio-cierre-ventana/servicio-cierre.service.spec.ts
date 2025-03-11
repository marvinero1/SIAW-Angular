/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ServicioCierreService } from './servicio-cierre.service';

describe('Service: ServicioCierre', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioCierreService]
    });
  });

  it('should ...', inject([ServicioCierreService], (service: ServicioCierreService) => {
    expect(service).toBeTruthy();
  }));
});
