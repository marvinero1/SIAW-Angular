/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EtiquetaImpresionProformaComponent } from './etiqueta-impresion-proforma.component';

describe('EtiquetaImpresionProformaComponent', () => {
  let component: EtiquetaImpresionProformaComponent;
  let fixture: ComponentFixture<EtiquetaImpresionProformaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtiquetaImpresionProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetaImpresionProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
