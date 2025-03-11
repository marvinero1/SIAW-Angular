/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NumRecepcionImportacionCreateComponent } from './num-recepcion-importacion-create.component';

describe('NumRecepcionImportacionCreateComponent', () => {
  let component: NumRecepcionImportacionCreateComponent;
  let fixture: ComponentFixture<NumRecepcionImportacionCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumRecepcionImportacionCreateComponent],
      providers: [DatePipe] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumRecepcionImportacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
