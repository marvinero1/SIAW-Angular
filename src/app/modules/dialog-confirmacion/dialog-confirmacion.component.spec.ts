/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DialogConfirmacionComponent } from './dialog-confirmacion.component';

describe('DialogConfirmacionComponent', () => {
  let component: DialogConfirmacionComponent;
  let fixture: ComponentFixture<DialogConfirmacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
