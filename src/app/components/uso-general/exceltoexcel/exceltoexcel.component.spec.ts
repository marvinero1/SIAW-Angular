/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExceltoexcelComponent } from './exceltoexcel.component';

describe('ExceltoexcelComponent', () => {
  let component: ExceltoexcelComponent;
  let fixture: ComponentFixture<ExceltoexcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceltoexcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceltoexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
