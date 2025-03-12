import {ComponentFixture, TestBed} from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RecoverPasswordComponent} from './recover-password.component';

describe('RecoverPasswordComponent', () => {
    let component: RecoverPasswordComponent;
    let fixture: ComponentFixture<RecoverPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RecoverPasswordComponent],
            providers: [
                DatePipe,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MatSnackBar, useValue: { open: () => { } } },
                { provide: MatDialog, useValue: { open: () => { } } },
                { provide: MatDialogRef, useValue: {} },
                { provide: ToastrService, useValue: { success: () => { }, error: () => { } } },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoverPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
