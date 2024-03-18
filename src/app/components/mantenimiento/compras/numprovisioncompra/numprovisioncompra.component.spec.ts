/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumprovisioncompraComponent } from './numprovisioncompra.component';

describe('NumprovisioncompraComponent', () => {
  let component: NumprovisioncompraComponent;
  let fixture: ComponentFixture<NumprovisioncompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumprovisioncompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumprovisioncompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
