/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExportarImportarSaldosComponent } from './exportar-importar-saldos.component';

describe('ExportarImportarSaldosComponent', () => {
  let component: ExportarImportarSaldosComponent;
  let fixture: ComponentFixture<ExportarImportarSaldosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportarImportarSaldosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportarImportarSaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
