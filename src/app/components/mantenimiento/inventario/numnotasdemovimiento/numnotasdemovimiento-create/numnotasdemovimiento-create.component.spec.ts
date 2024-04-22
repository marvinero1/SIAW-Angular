/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumnotasdemovimientoCreateComponent } from './numnotasdemovimiento-create.component';

describe('NumnotasdemovimientoCreateComponent', () => {
  let component: NumnotasdemovimientoCreateComponent;
  let fixture: ComponentFixture<NumnotasdemovimientoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumnotasdemovimientoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumnotasdemovimientoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
