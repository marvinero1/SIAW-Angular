/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeudoresIntegrantesComponent } from './deudores-integrantes.component';

describe('DeudoresIntegrantesComponent', () => {
  let component: DeudoresIntegrantesComponent;
  let fixture: ComponentFixture<DeudoresIntegrantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeudoresIntegrantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeudoresIntegrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
