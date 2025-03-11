/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalGenerarAutorizacionComponent } from './modal-generar-autorizacion.component';

describe('ModalGenerarAutorizacionComponent', () => {
  let component: ModalGenerarAutorizacionComponent;
  let fixture: ComponentFixture<ModalGenerarAutorizacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGenerarAutorizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGenerarAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
