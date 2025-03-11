/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EtiquetasItemProformaComponent } from './etiquetas-item-proforma.component';

describe('EtiquetasItemProformaComponent', () => {
  let component: EtiquetasItemProformaComponent;
  let fixture: ComponentFixture<EtiquetasItemProformaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EtiquetasItemProformaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetasItemProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
