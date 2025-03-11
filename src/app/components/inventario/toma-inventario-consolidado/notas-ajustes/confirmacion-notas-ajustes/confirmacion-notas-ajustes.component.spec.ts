/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConfirmacionNotasAjustesComponent } from './confirmacion-notas-ajustes.component';

describe('ConfirmacionNotasAjustesComponent', () => {
  let component: ConfirmacionNotasAjustesComponent;
  let fixture: ComponentFixture<ConfirmacionNotasAjustesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionNotasAjustesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionNotasAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
