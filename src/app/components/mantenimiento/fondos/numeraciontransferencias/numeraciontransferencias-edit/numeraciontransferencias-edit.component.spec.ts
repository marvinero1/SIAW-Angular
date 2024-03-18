/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeraciontransferenciasEditComponent } from './numeraciontransferencias-edit.component';

describe('NumeraciontransferenciasEditComponent', () => {
  let component: NumeraciontransferenciasEditComponent;
  let fixture: ComponentFixture<NumeraciontransferenciasEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeraciontransferenciasEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeraciontransferenciasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
