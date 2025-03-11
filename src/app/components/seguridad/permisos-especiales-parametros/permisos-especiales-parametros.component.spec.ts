/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PermisosEspecialesParametrosComponent } from './permisos-especiales-parametros.component';

describe('PermisosEspecialesParametrosComponent', () => {
  let component: PermisosEspecialesParametrosComponent;
  let fixture: ComponentFixture<PermisosEspecialesParametrosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisosEspecialesParametrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosEspecialesParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
