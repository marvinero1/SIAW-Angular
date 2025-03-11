/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CatalogoFacturasComponent } from './catalogo-facturas.component';

describe('CatalogoFacturasComponent', () => {
  let component: CatalogoFacturasComponent;
  let fixture: ComponentFixture<CatalogoFacturasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoFacturasComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
