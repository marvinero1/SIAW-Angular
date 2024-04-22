/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumpagodeudorComponent } from './numpagodeudor.component';

describe('NumpagodeudorComponent', () => {
  let component: NumpagodeudorComponent;
  let fixture: ComponentFixture<NumpagodeudorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumpagodeudorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumpagodeudorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
