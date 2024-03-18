/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumeracionDesctVariosDirectosCreateComponent } from './numeracion-desct-varios-directos-create.component';

describe('NumeracionDesctVariosDirectosCreateComponent', () => {
  let component: NumeracionDesctVariosDirectosCreateComponent;
  let fixture: ComponentFixture<NumeracionDesctVariosDirectosCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionDesctVariosDirectosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDesctVariosDirectosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
