/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionDesctVariosDirectosEditComponent } from './numeracion-desct-varios-directos-edit.component';

describe('NumeracionDesctVariosDirectosEditComponent', () => {
  let component: NumeracionDesctVariosDirectosEditComponent;
  let fixture: ComponentFixture<NumeracionDesctVariosDirectosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionDesctVariosDirectosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDesctVariosDirectosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
