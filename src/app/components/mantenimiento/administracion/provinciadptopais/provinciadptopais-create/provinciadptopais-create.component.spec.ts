/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProvinciadptopaisCreateComponent } from './provinciadptopais-create.component';

describe('ProvinciadptopaisCreateComponent', () => {
  let component: ProvinciadptopaisCreateComponent;
  let fixture: ComponentFixture<ProvinciadptopaisCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinciadptopaisCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinciadptopaisCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
