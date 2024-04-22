/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DptopaisEditComponent } from './dptopais-edit.component';

describe('DptopaisEditComponent', () => {
  let component: DptopaisEditComponent;
  let fixture: ComponentFixture<DptopaisEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DptopaisEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DptopaisEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
