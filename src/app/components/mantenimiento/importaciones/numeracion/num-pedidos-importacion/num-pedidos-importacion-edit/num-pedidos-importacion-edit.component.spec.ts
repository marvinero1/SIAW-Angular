/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NumPedidosImportacionEditComponent } from './num-pedidos-importacion-edit.component';

describe('NumPedidosImportacionEditComponent', () => {
  let component: NumPedidosImportacionEditComponent;
  let fixture: ComponentFixture<NumPedidosImportacionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumPedidosImportacionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumPedidosImportacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
