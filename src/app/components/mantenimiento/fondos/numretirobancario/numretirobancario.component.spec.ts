/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumretirobancarioComponent } from './numretirobancario.component';

describe('NumretirobancarioComponent', () => {
  let component: NumretirobancarioComponent;
  let fixture: ComponentFixture<NumretirobancarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumretirobancarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumretirobancarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
