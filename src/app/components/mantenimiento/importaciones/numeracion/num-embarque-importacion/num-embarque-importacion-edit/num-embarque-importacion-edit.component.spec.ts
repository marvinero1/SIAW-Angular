/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumEmbarqueImportacionEditComponent } from './num-embarque-importacion-edit.component';

describe('NumEmbarqueImportacionEditComponent', () => {
  let component: NumEmbarqueImportacionEditComponent;
  let fixture: ComponentFixture<NumEmbarqueImportacionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumEmbarqueImportacionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumEmbarqueImportacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
