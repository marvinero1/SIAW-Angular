/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumpedidomercaderiaComponent } from './numpedidomercaderia.component';

describe('NumpedidomercaderiaComponent', () => {
  let component: NumpedidomercaderiaComponent;
  let fixture: ComponentFixture<NumpedidomercaderiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumpedidomercaderiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumpedidomercaderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
