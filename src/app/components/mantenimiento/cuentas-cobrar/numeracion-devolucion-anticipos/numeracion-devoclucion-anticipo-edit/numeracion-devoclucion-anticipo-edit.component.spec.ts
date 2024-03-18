/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionDevoclucionAnticipoEditComponent } from './numeracion-devoclucion-anticipo-edit.component';

describe('NumeracionDevoclucionAnticipoEditComponent', () => {
  let component: NumeracionDevoclucionAnticipoEditComponent;
  let fixture: ComponentFixture<NumeracionDevoclucionAnticipoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionDevoclucionAnticipoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDevoclucionAnticipoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
