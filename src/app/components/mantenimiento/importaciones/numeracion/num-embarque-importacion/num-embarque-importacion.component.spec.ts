/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumEmbarqueImportacionComponent } from './num-embarque-importacion.component';

describe('NumEmbarqueImportacionComponent', () => {
  let component: NumEmbarqueImportacionComponent;
  let fixture: ComponentFixture<NumEmbarqueImportacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumEmbarqueImportacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumEmbarqueImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
