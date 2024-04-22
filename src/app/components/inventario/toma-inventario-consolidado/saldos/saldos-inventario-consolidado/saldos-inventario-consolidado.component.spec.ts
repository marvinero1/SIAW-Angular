/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SaldosInventarioConsolidadoComponent } from './saldos-inventario-consolidado.component';

describe('SaldosInventarioConsolidadoComponent', () => {
  let component: SaldosInventarioConsolidadoComponent;
  let fixture: ComponentFixture<SaldosInventarioConsolidadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldosInventarioConsolidadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldosInventarioConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
