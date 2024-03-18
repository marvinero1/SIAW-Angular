/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TipoconocimientocargaCreateComponent } from './tipoconocimientocarga-create.component';

describe('TipoconocimientocargaCreateComponent', () => {
  let component: TipoconocimientocargaCreateComponent;
  let fixture: ComponentFixture<TipoconocimientocargaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoconocimientocargaCreateComponent ]
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
