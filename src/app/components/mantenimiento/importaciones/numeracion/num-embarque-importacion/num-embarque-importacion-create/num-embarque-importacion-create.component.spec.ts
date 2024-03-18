/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumEmbarqueImportacionCreateComponent } from './num-embarque-importacion-create.component';

describe('NumEmbarqueImportacionCreateComponent', () => {
  let component: NumEmbarqueImportacionCreateComponent;
  let fixture: ComponentFixture<NumEmbarqueImportacionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumEmbarqueImportacionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumEmbarqueImportacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
