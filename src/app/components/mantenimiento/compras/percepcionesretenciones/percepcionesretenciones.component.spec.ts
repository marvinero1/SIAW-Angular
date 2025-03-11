/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PercepcionesretencionesComponent } from './percepcionesretenciones.component';

describe('PercepcionesretencionesComponent', () => {
  let component: PercepcionesretencionesComponent;
  let fixture: ComponentFixture<PercepcionesretencionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PercepcionesretencionesComponent],
      providers: [
        DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } }, 
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercepcionesretencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
