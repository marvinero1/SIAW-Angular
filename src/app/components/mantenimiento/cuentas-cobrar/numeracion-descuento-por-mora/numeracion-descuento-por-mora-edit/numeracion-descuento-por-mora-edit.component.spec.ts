/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionDescuentoPorMoraEditComponent } from './numeracion-descuento-por-mora-edit.component';

describe('NumeracionDescuentoPorMoraEditComponent', () => {
  let component: NumeracionDescuentoPorMoraEditComponent;
  let fixture: ComponentFixture<NumeracionDescuentoPorMoraEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionDescuentoPorMoraEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDescuentoPorMoraEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
