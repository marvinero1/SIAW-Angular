/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumsolicitudurgenteComponent } from './numsolicitudurgente.component';

describe('NumsolicitudurgenteComponent', () => {
  let component: NumsolicitudurgenteComponent;
  let fixture: ComponentFixture<NumsolicitudurgenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumsolicitudurgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumsolicitudurgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
