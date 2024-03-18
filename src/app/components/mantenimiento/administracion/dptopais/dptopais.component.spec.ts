/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DptopaisComponent } from './dptopais.component';

describe('DptopaisComponent', () => {
  let component: DptopaisComponent;
  let fixture: ComponentFixture<DptopaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DptopaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DptopaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
