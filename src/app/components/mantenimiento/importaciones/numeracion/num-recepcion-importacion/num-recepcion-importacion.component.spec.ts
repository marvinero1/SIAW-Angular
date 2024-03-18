/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumRecepcionImportacionComponent } from './num-recepcion-importacion.component';

describe('NumRecepcionImportacionComponent', () => {
  let component: NumRecepcionImportacionComponent;
  let fixture: ComponentFixture<NumRecepcionImportacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumRecepcionImportacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumRecepcionImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
