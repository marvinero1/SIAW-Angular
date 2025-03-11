/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumnotasdemovimientoEditComponent } from './numnotasdemovimiento-edit.component';

describe('NumnotasdemovimientoEditComponent', () => {
  let component: NumnotasdemovimientoEditComponent;
  let fixture: ComponentFixture<NumnotasdemovimientoEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumnotasdemovimientoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumnotasdemovimientoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
