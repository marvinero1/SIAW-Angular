/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CatalogoSolicitudUrgenteComponent } from './catalogo-solicitud-urgente.component';

describe('CatalogoSolicitudUrgenteComponent', () => {
  let component: CatalogoSolicitudUrgenteComponent;
  let fixture: ComponentFixture<CatalogoSolicitudUrgenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoSolicitudUrgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoSolicitudUrgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
