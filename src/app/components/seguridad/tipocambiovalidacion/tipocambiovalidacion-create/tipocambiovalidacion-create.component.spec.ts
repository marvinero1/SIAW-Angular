/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { TipocambiovalidacionCreateComponent } from './tipocambiovalidacion-create.component';

describe('TipocambiovalidacionCreateComponent', () => {
  let component: TipocambiovalidacionCreateComponent;
  let fixture: ComponentFixture<TipocambiovalidacionCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TipocambiovalidacionCreateComponent],
      providers: [DatePipe] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipocambiovalidacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
