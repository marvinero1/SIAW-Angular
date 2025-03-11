/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RegistrarInventarioGrupoComponent } from './registrar-inventario-grupo.component';

describe('RegistrarInventarioGrupoComponent', () => {
  let component: RegistrarInventarioGrupoComponent;
  let fixture: ComponentFixture<RegistrarInventarioGrupoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarInventarioGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarInventarioGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
