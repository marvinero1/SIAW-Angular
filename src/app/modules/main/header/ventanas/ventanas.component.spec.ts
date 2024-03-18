/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VentanasComponent } from './ventanas.component';

describe('VentanasComponent', () => {
  let component: VentanasComponent;
  let fixture: ComponentFixture<VentanasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
