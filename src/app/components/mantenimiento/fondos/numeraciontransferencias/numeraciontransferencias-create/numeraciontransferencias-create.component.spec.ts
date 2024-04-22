/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeraciontransferenciasCreateComponent } from './numeraciontransferencias-create.component';

describe('NumeraciontransferenciasCreateComponent', () => {
  let component: NumeraciontransferenciasCreateComponent;
  let fixture: ComponentFixture<NumeraciontransferenciasCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeraciontransferenciasCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeraciontransferenciasCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
