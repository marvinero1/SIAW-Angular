/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ParametrosFacturacionSIATComponent } from './parametros-facturacion-SIAT.component';

describe('ParametrosFacturacionSIATComponent', () => {
  let component: ParametrosFacturacionSIATComponent;
  let fixture: ComponentFixture<ParametrosFacturacionSIATComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosFacturacionSIATComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosFacturacionSIATComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
