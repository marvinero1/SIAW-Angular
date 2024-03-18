import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceRefreshItemsService {

  private ItemsFunctionSubject = new Subject<void>();

  refreshItemsFunctionCalled$ = this.ItemsFunctionSubject.asObservable();

  callItemFunction() {
    this.ItemsFunctionSubject.next();
  }

}
