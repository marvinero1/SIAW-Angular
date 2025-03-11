/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModificarSolicitudMercaderiaUrgenteComponent } from './modificar-solicitud-mercaderia-urgente.component';

describe('ModificarSolicitudMercaderiaUrgenteComponent', () => {
  let component: ModificarSolicitudMercaderiaUrgenteComponent;
  let fixture: ComponentFixture<ModificarSolicitudMercaderiaUrgenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarSolicitudMercaderiaUrgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarSolicitudMercaderiaUrgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
