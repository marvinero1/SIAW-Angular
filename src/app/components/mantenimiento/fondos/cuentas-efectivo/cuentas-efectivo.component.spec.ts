/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; // ✅ Nueva forma
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Importar el módulo correcto
import { MatSnackBar } from '@angular/material/snack-bar';

import { CuentasEfectivoComponent } from './cuentas-efectivo.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('CuentasEfectivoComponent', () => {
  let component: CuentasEfectivoComponent;
  let fixture: ComponentFixture<CuentasEfectivoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CuentasEfectivoComponent],
      providers: [
        provideHttpClient(),       // ✅ Provee HttpClient
        provideHttpClientTesting(), // ✅ Provee un mock para pruebas
        { provide: MatSnackBar, useValue: { open: () => { } } }, // ✅ Proveer un mock de MatSnackBar
        { provide: MatDialogRef, useValue: {} } // ✅ Proveer un mock de MatDialogRef
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
