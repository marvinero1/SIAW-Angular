import {ComponentFixture, TestBed} from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {ForgotPasswordComponent} from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ForgotPasswordComponent],
            providers: [
                DatePipe,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MatSnackBar, useValue: { open: () => { } } },
                { provide: MatDialog, useValue: { open: () => { } } },
                { provide: MatDialogRef, useValue: {} },
                { provide: ToastrService, useValue: { success: () => { }, error: () => { } } }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
