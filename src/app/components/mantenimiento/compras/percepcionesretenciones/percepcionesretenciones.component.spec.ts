/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PercepcionesretencionesComponent } from './percepcionesretenciones.component';

describe('PercepcionesretencionesComponent', () => {
  let component: PercepcionesretencionesComponent;
  let fixture: ComponentFixture<PercepcionesretencionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercepcionesretencionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercepcionesretencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
