/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TarifaPermitidasUsuarioComponent } from './tarifa-permitidas-usuario.component';

describe('TarifaPermitidasUsuarioComponent', () => {
  let component: TarifaPermitidasUsuarioComponent;
  let fixture: ComponentFixture<TarifaPermitidasUsuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifaPermitidasUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifaPermitidasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
