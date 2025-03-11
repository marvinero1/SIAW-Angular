/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CuentasEfectivosEditComponent } from './cuentas-efectivos-edit.component';

describe('CuentasEfectivosEditComponent', () => {
  let component: CuentasEfectivosEditComponent;
  let fixture: ComponentFixture<CuentasEfectivosEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentasEfectivosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasEfectivosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
