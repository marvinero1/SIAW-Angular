/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumpedidomercaderiaEditComponent } from './numpedidomercaderia-edit.component';

describe('NumpedidomercaderiaEditComponent', () => {
  let component: NumpedidomercaderiaEditComponent;
  let fixture: ComponentFixture<NumpedidomercaderiaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumpedidomercaderiaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumpedidomercaderiaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
