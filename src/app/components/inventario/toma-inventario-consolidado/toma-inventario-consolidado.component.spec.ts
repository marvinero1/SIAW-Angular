/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TomaInventarioConsolidadoComponent } from './toma-inventario-consolidado.component';

describe('TomaInventarioConsolidadoComponent', () => {
  let component: TomaInventarioConsolidadoComponent;
  let fixture: ComponentFixture<TomaInventarioConsolidadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TomaInventarioConsolidadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TomaInventarioConsolidadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
