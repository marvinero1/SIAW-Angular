/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NumsolicitudurgenteEditComponent } from './numsolicitudurgente-edit.component';

describe('NumsolicitudurgenteEditComponent', () => {
  let component: NumsolicitudurgenteEditComponent;
  let fixture: ComponentFixture<NumsolicitudurgenteEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumsolicitudurgenteEditComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumsolicitudurgenteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
