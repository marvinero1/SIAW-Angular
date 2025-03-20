/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Renderer2 } from '@angular/core';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RefreshPasswordComponent } from './refresh-password.component';
import { MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

describe('RefreshPasswordComponent', () => {
  let component: RefreshPasswordComponent;
  let fixture: ComponentFixture<RefreshPasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [RefreshPasswordComponent],
      providers: [
        DatePipe,
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
        { provide: MAT_DIALOG_DATA, useValue: {} }, 
        
        // 🔹 Mocks para los servicios del constructor
        { provide: Renderer2, useValue: { setStyle: () => { } } },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: Router, useValue: { navigate: () => { } } },
        { provide: ApiService, useValue: { login: () => { }, logout: () => { } } },
        { provide: LogService, useValue: {} },
        { provide: NgxSpinnerService, useValue: { show: () => { }, hide: () => { } } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
