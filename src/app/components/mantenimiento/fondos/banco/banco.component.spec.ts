/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BancoComponent } from './banco.component';

describe('BancoComponent', () => {
  let component: BancoComponent;
  let fixture: ComponentFixture<BancoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BancoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
