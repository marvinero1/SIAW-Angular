/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalMinimoComplementariasComponent } from './modalMinimoComplementarias.component';

describe('ModalMinimoComplementariasComponent', () => {
  let component: ModalMinimoComplementariasComponent;
  let fixture: ComponentFixture<ModalMinimoComplementariasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMinimoComplementariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMinimoComplementariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
