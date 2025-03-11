/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConceptosmovimientosmercaderiaComponent } from './conceptosmovimientosmercaderia.component';

describe('ConceptosmovimientosmercaderiaComponent', () => {
  let component: ConceptosmovimientosmercaderiaComponent;
  let fixture: ComponentFixture<ConceptosmovimientosmercaderiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptosmovimientosmercaderiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosmovimientosmercaderiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
