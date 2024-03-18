/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumdepositosbancariosCreateComponent } from './numdepositosbancarios-create.component';

describe('NumdepositosbancariosCreateComponent', () => {
  let component: NumdepositosbancariosCreateComponent;
  let fixture: ComponentFixture<NumdepositosbancariosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumdepositosbancariosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumdepositosbancariosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
