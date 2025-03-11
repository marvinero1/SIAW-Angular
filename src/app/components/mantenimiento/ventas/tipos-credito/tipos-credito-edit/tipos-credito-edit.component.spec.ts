/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { TiposCreditoEditComponent } from './tipos-credito-edit.component';

describe('TiposCreditoEditComponent', () => {
  let component: TiposCreditoEditComponent;
  let fixture: ComponentFixture<TiposCreditoEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [TiposCreditoEditComponent],
      providers: [DatePipe,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} }, 
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposCreditoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
