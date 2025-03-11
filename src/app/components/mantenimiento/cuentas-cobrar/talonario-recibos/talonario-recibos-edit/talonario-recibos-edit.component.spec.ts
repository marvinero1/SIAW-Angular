/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TalonarioRecibosEditComponent } from './talonario-recibos-edit.component';

describe('TalonarioRecibosEditComponent', () => {
  let component: TalonarioRecibosEditComponent;
  let fixture: ComponentFixture<TalonarioRecibosEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TalonarioRecibosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalonarioRecibosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
