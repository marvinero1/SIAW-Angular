/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CatalogoClientesIgualesComponent } from './catalogo-clientes-iguales.component';

describe('CatalogoClientesIgualesComponent', () => {
  let component: CatalogoClientesIgualesComponent;
  let fixture: ComponentFixture<CatalogoClientesIgualesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoClientesIgualesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoClientesIgualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
