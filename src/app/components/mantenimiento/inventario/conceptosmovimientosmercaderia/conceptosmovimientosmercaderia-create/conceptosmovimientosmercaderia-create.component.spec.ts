/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConceptosmovimientosmercaderiaCreateComponent } from './conceptosmovimientosmercaderia-create.component';

describe('ConceptosmovimientosmercaderiaCreateComponent', () => {
  let component: ConceptosmovimientosmercaderiaCreateComponent;
  let fixture: ComponentFixture<ConceptosmovimientosmercaderiaCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptosmovimientosmercaderiaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosmovimientosmercaderiaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
