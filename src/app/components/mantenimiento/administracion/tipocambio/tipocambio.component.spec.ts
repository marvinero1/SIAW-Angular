/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TipocambioComponent } from './tipocambio.component';

describe('TipocambioComponent', () => {
  let component: TipocambioComponent;
  let fixture: ComponentFixture<TipocambioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipocambioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
