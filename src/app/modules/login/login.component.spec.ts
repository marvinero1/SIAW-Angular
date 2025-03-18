/* eslint-disable @typescript-eslint/no-unused-vars */
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {LoginComponent} from './login.component';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';
import { LogService } from '@services/log-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [LoginComponent],
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
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
