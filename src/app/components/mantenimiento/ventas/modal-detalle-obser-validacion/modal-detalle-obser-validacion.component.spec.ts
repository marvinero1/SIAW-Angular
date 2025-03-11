/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalDetalleObserValidacionComponent } from './modal-detalle-obser-validacion.component';

describe('ModalDetalleObserValidacionComponent', () => {
  let component: ModalDetalleObserValidacionComponent;
  let fixture: ComponentFixture<ModalDetalleObserValidacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleObserValidacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleObserValidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
