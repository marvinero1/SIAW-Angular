/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RecargoDocumentoEditComponent } from './recargo-documento-edit.component';

describe('RecargoDocumentoEditComponent', () => {
  let component: RecargoDocumentoEditComponent;
  let fixture: ComponentFixture<RecargoDocumentoEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RecargoDocumentoEditComponent],
      providers: [DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargoDocumentoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
