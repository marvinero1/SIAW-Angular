/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PermisoEspecialPasswordComponent } from './permiso-especial-password.component';

describe('PermisoEspecialPasswordComponent', () => {
  let component: PermisoEspecialPasswordComponent;
  let fixture: ComponentFixture<PermisoEspecialPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisoEspecialPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisoEspecialPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
