/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModificarParametroAComponent } from './modificar-parametro-A.component';

describe('ModificarParametroAComponent', () => {
  let component: ModificarParametroAComponent;
  let fixture: ComponentFixture<ModificarParametroAComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarParametroAComponent],
      providers: [DatePipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarParametroAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
