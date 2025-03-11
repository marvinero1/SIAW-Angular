/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ObservacionesHojaRutaComponent } from './observaciones-hoja-ruta.component';

describe('ObservacionesHojaRutaComponent', () => {
  let component: ObservacionesHojaRutaComponent;
  let fixture: ComponentFixture<ObservacionesHojaRutaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesHojaRutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesHojaRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
