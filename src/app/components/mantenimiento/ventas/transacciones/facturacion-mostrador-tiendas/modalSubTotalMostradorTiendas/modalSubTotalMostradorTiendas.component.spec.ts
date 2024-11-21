/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalSubTotalMostradorTiendasComponent } from './modalSubTotalMostradorTiendas.component';

describe('ModalSubTotalMostradorTiendasComponent', () => {
  let component: ModalSubTotalMostradorTiendasComponent;
  let fixture: ComponentFixture<ModalSubTotalMostradorTiendasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSubTotalMostradorTiendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubTotalMostradorTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
