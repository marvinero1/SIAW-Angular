/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumpedidomercaderiaCreateComponent } from './numpedidomercaderia-create.component';

describe('NumpedidomercaderiaCreateComponent', () => {
  let component: NumpedidomercaderiaCreateComponent;
  let fixture: ComponentFixture<NumpedidomercaderiaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumpedidomercaderiaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumpedidomercaderiaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
