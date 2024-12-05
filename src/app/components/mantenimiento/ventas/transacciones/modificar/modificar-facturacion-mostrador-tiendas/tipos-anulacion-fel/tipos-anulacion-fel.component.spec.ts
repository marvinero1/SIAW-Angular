/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TiposAnulacionFelComponent } from './tipos-anulacion-fel.component';

describe('TiposAnulacionFelComponent', () => {
  let component: TiposAnulacionFelComponent;
  let fixture: ComponentFixture<TiposAnulacionFelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposAnulacionFelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposAnulacionFelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
