/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionTipoAjusteEditComponent } from './numeracion-tipo-ajuste-edit.component';

describe('NumeracionTipoAjusteEditComponent', () => {
  let component: NumeracionTipoAjusteEditComponent;
  let fixture: ComponentFixture<NumeracionTipoAjusteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionTipoAjusteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionTipoAjusteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
