/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RubroEditComponent } from './rubro-edit.component';

describe('RubroEditComponent', () => {
  let component: RubroEditComponent;
  let fixture: ComponentFixture<RubroEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RubroEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubroEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
