/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StockActualF9Component } from './stock-actual-f9.component';

describe('StockActualF9Component', () => {
  let component: StockActualF9Component;
  let fixture: ComponentFixture<StockActualF9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockActualF9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockActualF9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
