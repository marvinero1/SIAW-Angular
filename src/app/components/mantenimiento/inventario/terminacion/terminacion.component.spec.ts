/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TerminacionComponent } from './terminacion.component';

describe('TerminacionComponent', () => {
  let component: TerminacionComponent;
  let fixture: ComponentFixture<TerminacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
