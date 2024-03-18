/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionTipoAjusteCreateComponent } from './numeracion-tipo-ajuste-create.component';

describe('NumeracionTipoAjusteCreateComponent', () => {
  let component: NumeracionTipoAjusteCreateComponent;
  let fixture: ComponentFixture<NumeracionTipoAjusteCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionTipoAjusteCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionTipoAjusteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
