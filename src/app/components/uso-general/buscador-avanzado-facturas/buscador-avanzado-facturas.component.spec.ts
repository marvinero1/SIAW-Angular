/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuscadorAvanzadoFacturasComponent } from './buscador-avanzado-facturas.component';

describe('BuscadorAvanzadoFacturasComponent', () => {
  let component: BuscadorAvanzadoFacturasComponent;
  let fixture: ComponentFixture<BuscadorAvanzadoFacturasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorAvanzadoFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorAvanzadoFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
