/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumdevolucionesdeudorComponent } from './numdevolucionesdeudor.component';

describe('NumdevolucionesdeudorComponent', () => {
  let component: NumdevolucionesdeudorComponent;
  let fixture: ComponentFixture<NumdevolucionesdeudorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumdevolucionesdeudorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumdevolucionesdeudorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
