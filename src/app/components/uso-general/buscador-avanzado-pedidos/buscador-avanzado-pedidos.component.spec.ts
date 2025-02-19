/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuscadorAvanzadoPedidosComponent } from './buscador-avanzado-pedidos.component';

describe('BuscadorAvanzadoPedidosComponent', () => {
  let component: BuscadorAvanzadoPedidosComponent;
  let fixture: ComponentFixture<BuscadorAvanzadoPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorAvanzadoPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorAvanzadoPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
