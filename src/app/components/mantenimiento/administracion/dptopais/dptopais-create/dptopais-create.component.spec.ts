/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DptopaisCreateComponent } from './dptopais-create.component';

describe('DptopaisCreateComponent', () => {
  let component: DptopaisCreateComponent;
  let fixture: ComponentFixture<DptopaisCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DptopaisCreateComponent],
      providers: [DatePipe] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DptopaisCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
