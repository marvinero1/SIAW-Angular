/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ServicioprecioventaService } from './servicioprecioventa.service';

describe('Service: Servicioprecioventa', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicioprecioventaService]
    });
  });

  it('should ...', inject([ServicioprecioventaService], (service: ServicioprecioventaService) => {
    expect(service).toBeTruthy();
  }));
});
