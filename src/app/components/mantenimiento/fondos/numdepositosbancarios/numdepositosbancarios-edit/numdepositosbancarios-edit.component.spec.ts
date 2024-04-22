/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumdepositosbancariosEditComponent } from './numdepositosbancarios-edit.component';

describe('NumdepositosbancariosEditComponent', () => {
  let component: NumdepositosbancariosEditComponent;
  let fixture: ComponentFixture<NumdepositosbancariosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumdepositosbancariosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumdepositosbancariosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
