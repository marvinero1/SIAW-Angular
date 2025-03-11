/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NumeracionDevoclucionAnticipoCreateComponent } from './numeracion-devoclucion-anticipo-create.component';

describe('NumeracionDevoclucionAnticipoCreateComponent', () => {
  let component: NumeracionDevoclucionAnticipoCreateComponent;
  let fixture: ComponentFixture<NumeracionDevoclucionAnticipoCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumeracionDevoclucionAnticipoCreateComponent],
      providers: [DatePipe] 
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDevoclucionAnticipoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
