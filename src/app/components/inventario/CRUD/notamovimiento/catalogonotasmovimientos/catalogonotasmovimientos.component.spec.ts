/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CatalogonotasmovimientosComponent } from './catalogonotasmovimientos.component';

describe('CatalogonotasmovimientosComponent', () => {
  let component: CatalogonotasmovimientosComponent;
  let fixture: ComponentFixture<CatalogonotasmovimientosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogonotasmovimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogonotasmovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
