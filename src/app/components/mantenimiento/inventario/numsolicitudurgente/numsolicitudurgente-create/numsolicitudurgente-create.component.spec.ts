/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumsolicitudurgenteCreateComponent } from './numsolicitudurgente-create.component';

describe('NumsolicitudurgenteCreateComponent', () => {
  let component: NumsolicitudurgenteCreateComponent;
  let fixture: ComponentFixture<NumsolicitudurgenteCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumsolicitudurgenteCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumsolicitudurgenteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
