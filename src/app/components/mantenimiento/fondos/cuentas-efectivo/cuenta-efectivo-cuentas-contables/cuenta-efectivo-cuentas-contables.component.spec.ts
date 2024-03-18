/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CuentaEfectivoCuentasContablesComponent } from './cuenta-efectivo-cuentas-contables.component';

describe('CuentaEfectivoCuentasContablesComponent', () => {
  let component: CuentaEfectivoCuentasContablesComponent;
  let fixture: ComponentFixture<CuentaEfectivoCuentasContablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaEfectivoCuentasContablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaEfectivoCuentasContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
