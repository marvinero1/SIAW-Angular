/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PermisosEspecialesEditComponent } from './permisos-especiales-edit.component';

describe('PermisosEspecialesEditComponent', () => {
  let component: PermisosEspecialesEditComponent;
  let fixture: ComponentFixture<PermisosEspecialesEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisosEspecialesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosEspecialesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
