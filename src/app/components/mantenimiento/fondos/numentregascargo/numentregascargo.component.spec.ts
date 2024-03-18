/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumentregascargoComponent } from './numentregascargo.component';

describe('NumentregascargoComponent', () => {
  let component: NumentregascargoComponent;
  let fixture: ComponentFixture<NumentregascargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumentregascargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumentregascargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
