import {TestBed, inject, waitForAsync} from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {AuthGuard} from './auth.guard';

describe('AuthGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthGuard,
                DatePipe,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MatSnackBar, useValue: { open: () => { } } },
                { provide: MatDialog, useValue: { open: () => { } } },
                { provide: MatDialogRef, useValue: {} },
                { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
        });
    });

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});
