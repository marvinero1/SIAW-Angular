/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalCreditoAutorizacionComponent } from './modalCreditoAutorizacion.component';

describe('ModalCreditoAutorizacionComponent', () => {
  let component: ModalCreditoAutorizacionComponent;
  let fixture: ComponentFixture<ModalCreditoAutorizacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreditoAutorizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreditoAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
