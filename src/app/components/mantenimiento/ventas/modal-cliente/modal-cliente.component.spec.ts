/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalClienteComponent } from './modal-cliente.component';

describe('ModalClienteComponent', () => {
  let component: ModalClienteComponent;
  let fixture: ComponentFixture<ModalClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalClienteComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} } // ✅ Proveer un mock de MatDialogRef
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
