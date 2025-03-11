/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NivelesDescuentosCreateComponent } from './niveles-descuentos-create.component';

describe('NivelesDescuentosCreateComponent', () => {
  let component: NivelesDescuentosCreateComponent;
  let fixture: ComponentFixture<NivelesDescuentosCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NivelesDescuentosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelesDescuentosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
