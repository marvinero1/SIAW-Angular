/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemServiceService } from './item-service.service';

describe('Service: ItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemServiceService]
    });
  });

  it('should ...', inject([ItemServiceService], (service: ItemServiceService) => {
    expect(service).toBeTruthy();
  }));
});
