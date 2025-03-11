/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumdevolucionesdeudorEditComponent } from './numdevolucionesdeudor-edit.component';

describe('NumdevolucionesdeudorEditComponent', () => {
  let component: NumdevolucionesdeudorEditComponent;
  let fixture: ComponentFixture<NumdevolucionesdeudorEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumdevolucionesdeudorEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumdevolucionesdeudorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
