/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumdevolucionesdeudorCreateComponent } from './numdevolucionesdeudor-create.component';

describe('NumdevolucionesdeudorCreateComponent', () => {
  let component: NumdevolucionesdeudorCreateComponent;
  let fixture: ComponentFixture<NumdevolucionesdeudorCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumdevolucionesdeudorCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumdevolucionesdeudorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
