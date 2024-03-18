/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumTipoDocumentoVentaComponent } from './num-tipo-documento-venta.component';

describe('NumTipoDocumentoVentaComponent', () => {
  let component: NumTipoDocumentoVentaComponent;
  let fixture: ComponentFixture<NumTipoDocumentoVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumTipoDocumentoVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumTipoDocumentoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
