import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {RegisterComponent} from './register.component';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [RegisterComponent],
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
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        fixture.detectChanges(); // 🔥 Esto asegura que Angular renderice el componente antes del test
    });

    it('should create', () => {
        fixture.detectChanges(); // Asegura que el DOM está listo
        expect(fixture.componentInstance).toBeTruthy();
    });
});
