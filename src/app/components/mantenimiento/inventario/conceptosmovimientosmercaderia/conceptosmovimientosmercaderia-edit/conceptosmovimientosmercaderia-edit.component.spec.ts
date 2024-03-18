/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConceptosmovimientosmercaderiaEditComponent } from './conceptosmovimientosmercaderia-edit.component';

describe('ConceptosmovimientosmercaderiaEditComponent', () => {
  let component: ConceptosmovimientosmercaderiaEditComponent;
  let fixture: ComponentFixture<ConceptosmovimientosmercaderiaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptosmovimientosmercaderiaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosmovimientosmercaderiaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
