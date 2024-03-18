/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumProformaImportacionComponent } from './num-proforma-importacion.component';

describe('NumProformaImportacionComponent', () => {
  let component: NumProformaImportacionComponent;
  let fixture: ComponentFixture<NumProformaImportacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumProformaImportacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumProformaImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
