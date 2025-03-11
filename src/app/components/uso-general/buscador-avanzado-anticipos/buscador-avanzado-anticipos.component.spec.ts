/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuscadorAvanzadoAnticiposComponent } from './buscador-avanzado-anticipos.component';

describe('BuscadorAvanzadoAnticiposComponent', () => {
  let component: BuscadorAvanzadoAnticiposComponent;
  let fixture: ComponentFixture<BuscadorAvanzadoAnticiposComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorAvanzadoAnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorAvanzadoAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
