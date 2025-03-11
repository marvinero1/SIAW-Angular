/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ModalAlmacenComponent } from './modal-almacen.component';

describe('ModalAlmacenComponent', () => {
  let component: ModalAlmacenComponent;
  let fixture: ComponentFixture<ModalAlmacenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAlmacenComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
