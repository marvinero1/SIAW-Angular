/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SolicitudMercaderiaUrgenteComponent } from './solicitud-mercaderia-urgente.component';

describe('SolicitudMercaderiaUrgenteComponent', () => {
  let component: SolicitudMercaderiaUrgenteComponent;
  let fixture: ComponentFixture<SolicitudMercaderiaUrgenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudMercaderiaUrgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudMercaderiaUrgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
