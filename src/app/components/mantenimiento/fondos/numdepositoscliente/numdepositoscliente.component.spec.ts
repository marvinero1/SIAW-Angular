/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumdepositosclienteComponent } from './numdepositoscliente.component';

describe('NumdepositosclienteComponent', () => {
  let component: NumdepositosclienteComponent;
  let fixture: ComponentFixture<NumdepositosclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumdepositosclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumdepositosclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
