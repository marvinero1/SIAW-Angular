/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CatalogoNotasRemisionComponent } from './catalogo-notas-remision.component';

describe('CatalogoNotasRemisionComponent', () => {
  let component: CatalogoNotasRemisionComponent;
  let fixture: ComponentFixture<CatalogoNotasRemisionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoNotasRemisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoNotasRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
