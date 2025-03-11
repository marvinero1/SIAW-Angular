/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UrgentesAlmacenesComponent } from './urgentes-almacenes.component';

describe('UrgentesAlmacenesComponent', () => {
  let component: UrgentesAlmacenesComponent;
  let fixture: ComponentFixture<UrgentesAlmacenesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentesAlmacenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentesAlmacenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
