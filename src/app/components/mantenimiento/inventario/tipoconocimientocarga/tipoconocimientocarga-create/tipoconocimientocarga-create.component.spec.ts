/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TipoconocimientocargaCreateComponent } from './tipoconocimientocarga-create.component';

describe('TipoconocimientocargaCreateComponent', () => {
  let component: TipoconocimientocargaCreateComponent;
  let fixture: ComponentFixture<TipoconocimientocargaCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TipoconocimientocargaCreateComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoconocimientocargaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
