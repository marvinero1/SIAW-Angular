/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LineasPorcentajeDesctComponent } from './lineas-porcentaje-desct.component';

describe('LineasPorcentajeDesctComponent', () => {
  let component: LineasPorcentajeDesctComponent;
  let fixture: ComponentFixture<LineasPorcentajeDesctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineasPorcentajeDesctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineasPorcentajeDesctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
