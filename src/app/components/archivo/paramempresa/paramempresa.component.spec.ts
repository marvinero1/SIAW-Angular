/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ParamempresaComponent } from './paramempresa.component';

describe('ParamempresaComponent', () => {
  let component: ParamempresaComponent;
  let fixture: ComponentFixture<ParamempresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamempresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
