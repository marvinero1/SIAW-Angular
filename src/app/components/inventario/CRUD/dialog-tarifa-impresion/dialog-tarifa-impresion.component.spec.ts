/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DialogTarifaImpresionComponent } from './dialog-tarifa-impresion.component';

describe('DialogTarifaImpresionComponent', () => {
  let component: DialogTarifaImpresionComponent;
  let fixture: ComponentFixture<DialogTarifaImpresionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTarifaImpresionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTarifaImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
