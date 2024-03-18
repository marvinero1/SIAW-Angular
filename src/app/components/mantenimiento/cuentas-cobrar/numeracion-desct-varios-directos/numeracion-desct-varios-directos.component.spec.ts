/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionDesctVariosDirectosComponent } from './numeracion-desct-varios-directos.component';

describe('NumeracionDesctVariosDirectosComponent', () => {
  let component: NumeracionDesctVariosDirectosComponent;
  let fixture: ComponentFixture<NumeracionDesctVariosDirectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionDesctVariosDirectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDesctVariosDirectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
