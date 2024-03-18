/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RubroComponent } from './rubro.component';

describe('RubroComponent', () => {
  let component: RubroComponent;
  let fixture: ComponentFixture<RubroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RubroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
