/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionDescuentoPorMoraCreateComponent } from './numeracion-descuento-por-mora-create.component';

describe('NumeracionDescuentoPorMoraCreateComponent', () => {
  let component: NumeracionDescuentoPorMoraCreateComponent;
  let fixture: ComponentFixture<NumeracionDescuentoPorMoraCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionDescuentoPorMoraCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDescuentoPorMoraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
