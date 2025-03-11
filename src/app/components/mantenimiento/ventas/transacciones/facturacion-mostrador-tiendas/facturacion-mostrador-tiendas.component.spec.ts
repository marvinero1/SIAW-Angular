/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FacturacionMostradorTiendasComponent } from './facturacion-mostrador-tiendas.component';

describe('FacturacionMostradorTiendasComponent', () => {
  let component: FacturacionMostradorTiendasComponent;
  let fixture: ComponentFixture<FacturacionMostradorTiendasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionMostradorTiendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionMostradorTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
