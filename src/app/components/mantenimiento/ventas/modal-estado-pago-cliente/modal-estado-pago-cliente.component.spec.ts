/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalEstadoPagoClienteComponent } from './modal-estado-pago-cliente.component';

describe('ModalEstadoPagoClienteComponent', () => {
  let component: ModalEstadoPagoClienteComponent;
  let fixture: ComponentFixture<ModalEstadoPagoClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEstadoPagoClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEstadoPagoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
