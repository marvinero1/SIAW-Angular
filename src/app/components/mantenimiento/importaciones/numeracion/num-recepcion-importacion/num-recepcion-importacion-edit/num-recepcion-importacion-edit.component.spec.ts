/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { NumRecepcionImportacionEditComponent } from './num-recepcion-importacion-edit.component';

describe('NumRecepcionImportacionEditComponent', () => {
  let component: NumRecepcionImportacionEditComponent;
  let fixture: ComponentFixture<NumRecepcionImportacionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumRecepcionImportacionEditComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
        MessageService,
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumRecepcionImportacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
