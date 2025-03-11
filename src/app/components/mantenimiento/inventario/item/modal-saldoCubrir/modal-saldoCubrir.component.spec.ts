/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalSaldoCubrirComponent } from './modal-saldoCubrir.component';

describe('ModalSaldoCubrirComponent', () => {
  let component: ModalSaldoCubrirComponent;
  let fixture: ComponentFixture<ModalSaldoCubrirComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSaldoCubrirComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSaldoCubrirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
