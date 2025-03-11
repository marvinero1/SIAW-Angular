/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NumeraciontransferenciasEditComponent } from './numeraciontransferencias-edit.component';

describe('NumeraciontransferenciasEditComponent', () => {
  let component: NumeraciontransferenciasEditComponent;
  let fixture: ComponentFixture<NumeraciontransferenciasEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumeraciontransferenciasEditComponent],
      providers: [DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeraciontransferenciasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
