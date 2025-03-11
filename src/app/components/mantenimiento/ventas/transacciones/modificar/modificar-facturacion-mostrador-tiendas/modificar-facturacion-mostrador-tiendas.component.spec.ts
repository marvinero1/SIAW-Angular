/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModificarFacturacionMostradorTiendasComponent } from './modificar-facturacion-mostrador-tiendas.component';

describe('ModificarFacturacionMostradorTiendasComponent', () => {
  let component: ModificarFacturacionMostradorTiendasComponent;
  let fixture: ComponentFixture<ModificarFacturacionMostradorTiendasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarFacturacionMostradorTiendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarFacturacionMostradorTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
