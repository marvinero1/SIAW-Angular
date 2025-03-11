/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { NumeracionDescuentoPorMoraCreateComponent } from './numeracion-descuento-por-mora-create.component';

describe('NumeracionDescuentoPorMoraCreateComponent', () => {
  let component: NumeracionDescuentoPorMoraCreateComponent;
  let fixture: ComponentFixture<NumeracionDescuentoPorMoraCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumeracionDescuentoPorMoraCreateComponent],
      providers: [DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } }, 
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MatDialogRef, useValue: {} },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionDescuentoPorMoraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
