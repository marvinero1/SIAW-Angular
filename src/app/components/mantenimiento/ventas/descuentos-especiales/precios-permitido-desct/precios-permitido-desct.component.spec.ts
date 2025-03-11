/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PreciosPermitidoDesctComponent } from './precios-permitido-desct.component';

describe('PreciosPermitidoDesctComponent', () => {
  let component: PreciosPermitidoDesctComponent;
  let fixture: ComponentFixture<PreciosPermitidoDesctComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciosPermitidoDesctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciosPermitidoDesctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
