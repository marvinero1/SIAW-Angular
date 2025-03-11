/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TranferirMostradorTiendasComponent } from './tranferirMostradorTiendas.component';

describe('TranferirMostradorTiendasComponent', () => {
  let component: TranferirMostradorTiendasComponent;
  let fixture: ComponentFixture<TranferirMostradorTiendasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TranferirMostradorTiendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranferirMostradorTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
