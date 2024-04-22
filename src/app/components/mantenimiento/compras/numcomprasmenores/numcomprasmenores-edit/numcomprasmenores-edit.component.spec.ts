/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumcomprasmenoresEditComponent } from './numcomprasmenores-edit.component';

describe('NumcomprasmenoresEditComponent', () => {
  let component: NumcomprasmenoresEditComponent;
  let fixture: ComponentFixture<NumcomprasmenoresEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumcomprasmenoresEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumcomprasmenoresEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
