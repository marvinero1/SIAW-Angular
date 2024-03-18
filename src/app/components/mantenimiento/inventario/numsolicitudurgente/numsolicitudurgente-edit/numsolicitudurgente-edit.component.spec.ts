/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumsolicitudurgenteEditComponent } from './numsolicitudurgente-edit.component';

describe('NumsolicitudurgenteEditComponent', () => {
  let component: NumsolicitudurgenteEditComponent;
  let fixture: ComponentFixture<NumsolicitudurgenteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumsolicitudurgenteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumsolicitudurgenteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
