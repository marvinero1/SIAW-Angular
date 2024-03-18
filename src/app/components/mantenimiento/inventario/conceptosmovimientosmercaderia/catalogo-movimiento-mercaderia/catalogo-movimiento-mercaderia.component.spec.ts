/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CatalogoMovimientoMercaderiaComponent } from './catalogo-movimiento-mercaderia.component';

describe('CatalogoMovimientoMercaderiaComponent', () => {
  let component: CatalogoMovimientoMercaderiaComponent;
  let fixture: ComponentFixture<CatalogoMovimientoMercaderiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoMovimientoMercaderiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoMovimientoMercaderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
