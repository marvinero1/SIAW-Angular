/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionDevolucionAnticiposComponent } from './numeracion-devolucion-anticipos.component';

describe('NumeracionDevolucionAnticiposComponent', () => {
  let component: NumeracionDevolucionAnticiposComponent;
  let fixture: ComponentFixture<NumeracionDevolucionAnticiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionDevolucionAnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDevolucionAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
