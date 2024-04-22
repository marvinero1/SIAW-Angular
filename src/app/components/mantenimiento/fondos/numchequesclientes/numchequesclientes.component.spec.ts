/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumchequesclientesComponent } from './numchequesclientes.component';

describe('NumchequesclientesComponent', () => {
  let component: NumchequesclientesComponent;
  let fixture: ComponentFixture<NumchequesclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumchequesclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumchequesclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
