/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumreposicionComponent } from './numreposicion.component';

describe('NumreposicionComponent', () => {
  let component: NumreposicionComponent;
  let fixture: ComponentFixture<NumreposicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumreposicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumreposicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
