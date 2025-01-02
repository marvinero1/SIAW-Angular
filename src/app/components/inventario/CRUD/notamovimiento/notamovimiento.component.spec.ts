/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotamovimientoComponent } from './notamovimiento.component';

describe('NotamovimientoComponent', () => {
  let component: NotamovimientoComponent;
  let fixture: ComponentFixture<NotamovimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotamovimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotamovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
