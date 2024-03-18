/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalCatalogoNumeracionProformaComponent } from './modal-catalogo-numeracion-proforma.component';

describe('ModalCatalogoNumeracionProformaComponent', () => {
  let component: ModalCatalogoNumeracionProformaComponent;
  let fixture: ComponentFixture<ModalCatalogoNumeracionProformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCatalogoNumeracionProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCatalogoNumeracionProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
