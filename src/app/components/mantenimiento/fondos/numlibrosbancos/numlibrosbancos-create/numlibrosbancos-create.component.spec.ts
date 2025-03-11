/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumlibrosbancosCreateComponent } from './numlibrosbancos-create.component';

describe('NumlibrosbancosCreateComponent', () => {
  let component: NumlibrosbancosCreateComponent;
  let fixture: ComponentFixture<NumlibrosbancosCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumlibrosbancosCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumlibrosbancosCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
