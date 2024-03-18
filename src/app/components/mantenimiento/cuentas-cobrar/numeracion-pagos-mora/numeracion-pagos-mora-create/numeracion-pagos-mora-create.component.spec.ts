/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionPagosMoraCreateComponent } from './numeracion-pagos-mora-create.component';

describe('NumeracionPagosMoraCreateComponent', () => {
  let component: NumeracionPagosMoraCreateComponent;
  let fixture: ComponentFixture<NumeracionPagosMoraCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionPagosMoraCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionPagosMoraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
