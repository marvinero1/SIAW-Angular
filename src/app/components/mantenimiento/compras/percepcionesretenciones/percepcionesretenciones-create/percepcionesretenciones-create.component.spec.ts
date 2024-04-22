/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PercepcionesretencionesCreateComponent } from './percepcionesretenciones-create.component';

describe('PercepcionesretencionesCreateComponent', () => {
  let component: PercepcionesretencionesCreateComponent;
  let fixture: ComponentFixture<PercepcionesretencionesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercepcionesretencionesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercepcionesretencionesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
