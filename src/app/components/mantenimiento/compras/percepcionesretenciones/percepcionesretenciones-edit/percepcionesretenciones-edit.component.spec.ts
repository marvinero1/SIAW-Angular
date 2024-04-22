/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PercepcionesretencionesEditComponent } from './percepcionesretenciones-edit.component';

describe('PercepcionesretencionesEditComponent', () => {
  let component: PercepcionesretencionesEditComponent;
  let fixture: ComponentFixture<PercepcionesretencionesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercepcionesretencionesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercepcionesretencionesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
