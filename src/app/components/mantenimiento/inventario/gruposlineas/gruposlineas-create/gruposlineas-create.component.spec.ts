/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GruposlineasCreateComponent } from './gruposlineas-create.component';

describe('GruposlineasCreateComponent', () => {
  let component: GruposlineasCreateComponent;
  let fixture: ComponentFixture<GruposlineasCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GruposlineasCreateComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposlineasCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
