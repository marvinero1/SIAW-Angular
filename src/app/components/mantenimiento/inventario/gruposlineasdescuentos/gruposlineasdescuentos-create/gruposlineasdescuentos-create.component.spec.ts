/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GruposlineasdescuentosCreateComponent } from './gruposlineasdescuentos-create.component';

describe('GruposlineasdescuentosCreateComponent', () => {
  let component: GruposlineasdescuentosCreateComponent;
  let fixture: ComponentFixture<GruposlineasdescuentosCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposlineasdescuentosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposlineasdescuentosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
