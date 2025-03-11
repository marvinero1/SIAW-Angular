/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NumeracionPagosMoraCreateComponent } from './numeracion-pagos-mora-create.component';

describe('NumeracionPagosMoraCreateComponent', () => {
  let component: NumeracionPagosMoraCreateComponent;
  let fixture: ComponentFixture<NumeracionPagosMoraCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumeracionPagosMoraCreateComponent],
      providers: [
        DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionPagosMoraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
