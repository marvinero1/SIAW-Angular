/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumcomprasmenoresComponent } from './numcomprasmenores.component';

describe('NumcomprasmenoresComponent', () => {
  let component: NumcomprasmenoresComponent;
  let fixture: ComponentFixture<NumcomprasmenoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumcomprasmenoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumcomprasmenoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
