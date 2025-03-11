/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionPagosMoraEditComponent } from './numeracion-pagos-mora-edit.component';

describe('NumeracionPagosMoraEditComponent', () => {
  let component: NumeracionPagosMoraEditComponent;
  let fixture: ComponentFixture<NumeracionPagosMoraEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionPagosMoraEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionPagosMoraEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
