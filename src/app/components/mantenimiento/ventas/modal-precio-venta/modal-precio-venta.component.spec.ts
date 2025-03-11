/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ModalPrecioVentaComponent } from './modal-precio-venta.component';

describe('ModalPrecioVentaComponent', () => {
  let component: ModalPrecioVentaComponent;
  let fixture: ComponentFixture<ModalPrecioVentaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPrecioVentaComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} } 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrecioVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
