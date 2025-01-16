/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotaMovimientoBuscadorAvanzadoComponent } from './nota-movimiento-buscador-avanzado.component';

describe('NotaMovimientoBuscadorAvanzadoComponent', () => {
  let component: NotaMovimientoBuscadorAvanzadoComponent;
  let fixture: ComponentFixture<NotaMovimientoBuscadorAvanzadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaMovimientoBuscadorAvanzadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaMovimientoBuscadorAvanzadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
