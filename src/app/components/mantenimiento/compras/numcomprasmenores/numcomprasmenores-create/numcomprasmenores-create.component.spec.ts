/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumcomprasmenoresCreateComponent } from './numcomprasmenores-create.component';

describe('NumcomprasmenoresCreateComponent', () => {
  let component: NumcomprasmenoresCreateComponent;
  let fixture: ComponentFixture<NumcomprasmenoresCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumcomprasmenoresCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumcomprasmenoresCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
