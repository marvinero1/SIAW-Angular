/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModificarNotaRemisionComponent } from './modificar-nota-remision.component';

describe('ModificarNotaRemisionComponent', () => {
  let component: ModificarNotaRemisionComponent;
  let fixture: ComponentFixture<ModificarNotaRemisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarNotaRemisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarNotaRemisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
