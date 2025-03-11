/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ServiceRefreshItemsService } from './service-refresh-items.service';

describe('Service: ServiceRefreshItems', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceRefreshItemsService]
    });
  });

  it('should ...', inject([ServiceRefreshItemsService], (service: ServiceRefreshItemsService) => {
    expect(service).toBeTruthy();
  }));
});
