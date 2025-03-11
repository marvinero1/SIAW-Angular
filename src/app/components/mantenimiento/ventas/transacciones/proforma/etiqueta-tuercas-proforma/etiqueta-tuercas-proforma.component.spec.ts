/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EtiquetaTuercasProformaComponent } from './etiqueta-tuercas-proforma.component';

describe('EtiquetaTuercasProformaComponent', () => {
  let component: EtiquetaTuercasProformaComponent;
  let fixture: ComponentFixture<EtiquetaTuercasProformaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EtiquetaTuercasProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetaTuercasProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
