/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BancoEditComponent } from './banco-edit.component';

describe('BancoEditComponent', () => {
  let component: BancoEditComponent;
  let fixture: ComponentFixture<BancoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BancoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
