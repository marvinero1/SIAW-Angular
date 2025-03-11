/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionPagosMoraComponent } from './numeracion-pagos-mora.component';

describe('NumeracionPagosMoraComponent', () => {
  let component: NumeracionPagosMoraComponent;
  let fixture: ComponentFixture<NumeracionPagosMoraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionPagosMoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionPagosMoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
