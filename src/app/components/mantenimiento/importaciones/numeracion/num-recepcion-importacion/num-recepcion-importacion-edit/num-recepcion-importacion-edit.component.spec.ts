/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumRecepcionImportacionEditComponent } from './num-recepcion-importacion-edit.component';

describe('NumRecepcionImportacionEditComponent', () => {
  let component: NumRecepcionImportacionEditComponent;
  let fixture: ComponentFixture<NumRecepcionImportacionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumRecepcionImportacionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumRecepcionImportacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
